import express from "express";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

console.log("Starting server initialization...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy SDK Initializers
let supabaseClient: SupabaseClient | null = null;
function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY) are missing.");
    }
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

let stripeClient: Stripe | null = null;
function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is missing.");
    }
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-24-preview" as any,
    });
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(compression());
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Routes
  app.get("/api/github-data/:username", async (req, res) => {
    const { username } = req.params;
    try {
      const [userRes, reposRes, eventsRes] = await Promise.all([
        axios.get(`https://api.github.com/users/${username}`),
        axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        axios.get(`https://api.github.com/users/${username}/events/public?per_page=100`),
      ]);

      res.json({
        user: userRes.data,
        repos: reposRes.data,
        events: eventsRes.data
      });
    } catch (error: any) {
      console.error("GitHub fetch error:", error);
      if (error.response?.status === 404) {
        return res.status(404).json({ error: "GitHub username not found" });
      }
      res.status(500).json({ error: "Failed to fetch GitHub data" });
    }
  });

  app.post("/api/save-card", async (req, res) => {
    const { username, github_data, brain_score, ai_summary, skill_scores, top_projects, stats } = req.body;

    try {
      const supabase = getSupabase();
      const cardData = {
        username,
        name: github_data.name || username,
        avatar_url: github_data.avatar_url,
        bio: github_data.bio,
        github_data,
        brain_score,
        ai_summary,
        skill_scores,
        top_projects,
        stats,
        is_pro: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        refreshed_at: new Date().toISOString()
      };

      const { data: savedCard, error: saveError } = await supabase
        .from("cards")
        .upsert(cardData, { onConflict: "username" })
        .select()
        .single();

      if (saveError) throw saveError;
      res.json(savedCard);
    } catch (error: any) {
      console.error("Save error:", error);
      res.status(500).json({ error: error.message || "Failed to save card" });
    }
  });

  app.get("/api/recruiter/search", async (req, res) => {
    const { minScore, language, search } = req.query;
    try {
      const supabase = getSupabase();
      let query = supabase.from("cards").select("*");

      if (minScore) {
        query = query.gte("brain_score", parseInt(minScore as string));
      }
      
      if (search) {
        query = query.ilike("username", `%${search}%`);
      }

      const { data, error } = await query.order("brain_score", { ascending: false }).limit(50);
      if (error) throw error;
      
      let filteredData = data;
      if (language && language !== "All") {
        filteredData = data.filter(card => 
          card.skill_scores.some((s: any) => s.name === language)
        );
      }

      res.json(filteredData);
    } catch (error: any) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("brain_score", { ascending: false })
        .limit(100);

      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/card/:username", async (req, res) => {
    const { username } = req.params;
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("username", username)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: "Card not found" });
      }

      await supabase
        .from("cards")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id);

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch card" });
    }
  });

  app.post("/api/stripe/checkout", async (req, res) => {
    const { username } = req.body;
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.STRIPE_PRO_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.APP_URL}/card/${username}?success=true`,
        cancel_url: `${process.env.APP_URL}/pricing`,
        metadata: { username },
      });
      res.json({ url: session.url });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Stripe error" });
    }
  });

  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const username = session.metadata?.username;
      if (username) {
        const supabase = getSupabase();
        await supabase
          .from("cards")
          .update({ is_pro: true })
          .eq("username", username);
      }
    }

    res.json({ received: true });
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      }
    }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
