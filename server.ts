import express from "express";
import compression from "compression";
import admin from "firebase-admin";
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
let db: admin.firestore.Firestore | null = null;
function getFirestore() {
  if (!db) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Robust private key parsing to handle escaped newlines and potential quotes
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
      }
    }

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Firebase environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are missing.");
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    db = admin.firestore();
  }
  return db;
}

// Simple In-Memory Cache for GitHub Data
const githubCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Temporary Cache for Generated Cards (Preview)
const cardPreviewCache = new Map<string, { data: any, timestamp: number }>();
const CARD_PREVIEW_TTL = 1000 * 60 * 30; // 30 minutes

async function fetchWithCache(username: string) {
  const cached = githubCache.get(username);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  const getHeaders = (useToken: boolean) => {
    const headers: any = {
      'User-Agent': 'GitHub-Brain-Card-App'
    };
    if (useToken && process.env.GITHUB_TOKEN) {
      const token = process.env.GITHUB_TOKEN.trim();
      headers['Authorization'] = `token ${token}`;
    }
    return headers;
  };

  const performFetch = async (useToken: boolean) => {
    const headers = getHeaders(useToken);
    const [userRes, reposRes, eventsRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
      axios.get(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
    ]);

    return {
      user: userRes.data,
      repos: reposRes.data,
      events: eventsRes.data
    };
  };

  try {
    // Try with token first if available
    const data = await performFetch(!!process.env.GITHUB_TOKEN);
    githubCache.set(username, { data, timestamp: Date.now() });
    return data;
  } catch (error: any) {
    // If 401 (Unauthorized) and we were using a token, retry without token
    if (error.response?.status === 401 && process.env.GITHUB_TOKEN) {
      console.warn(`GitHub Token is invalid (401). Retrying without token for ${username}...`);
      try {
        const data = await performFetch(false);
        githubCache.set(username, { data, timestamp: Date.now() });
        return data;
      } catch (retryError: any) {
        throw retryError;
      }
    }

    console.error(`GitHub API Error for ${username}:`, {
      status: error.response?.status,
      message: error.message,
      rateLimit: error.response?.headers?.['x-ratelimit-remaining'],
      reset: error.response?.headers?.['x-ratelimit-reset']
    });
    throw error;
  }
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

export async function createServer() {
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
      const data = await fetchWithCache(username);
      res.json(data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return res.status(404).json({ error: "GitHub username not found" });
      }
      if (error.response?.status === 401) {
        return res.status(401).json({ error: "The provided GITHUB_TOKEN is invalid or expired. Please check your environment variables." });
      }
      if (error.response?.status === 403 && error.response?.headers?.['x-ratelimit-remaining'] === '0') {
        return res.status(429).json({ error: "GitHub API rate limit exceeded. Please try again later." });
      }
      res.status(500).json({ error: `Failed to fetch GitHub data: ${error.message}` });
    }
  });

  app.post("/api/save-card", async (req, res) => {
    const { username, github_data, brain_score, ai_summary, skill_scores, top_projects, stats } = req.body;

    try {
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

      // Store in temporary preview cache instead of directly in Firestore
      cardPreviewCache.set(username, { data: cardData, timestamp: Date.now() });
      
      res.json(cardData);
    } catch (error: any) {
      console.error("Save error:", error);
      res.status(500).json({ error: error.message || "Failed to cache card" });
    }
  });

  app.get("/api/recruiter/search", async (req, res) => {
    const { minScore, language, search } = req.query;
    try {
      const db = getFirestore();
      let query: admin.firestore.Query = db.collection("cards");

      if (minScore) {
        query = query.where("brain_score", ">=", parseInt(minScore as string));
      }
      
      // Firestore doesn't support ilike. For simplicity, we'll fetch and filter in memory if search is provided
      // or just skip it for now. Let's do a simple orderBy to allow the gte query to work.
      const snapshot = await query.orderBy("brain_score", "desc").limit(100).get();
      let data = snapshot.docs.map(doc => doc.data());

      if (search) {
        const searchLower = (search as string).toLowerCase();
        data = data.filter(card => 
          card.username.toLowerCase().includes(searchLower) || 
          (card.name && card.name.toLowerCase().includes(searchLower))
        );
      }
      
      if (language && language !== "All") {
        data = data.filter(card => 
          card.skill_scores.some((s: any) => s.name === language)
        );
      }

      res.json(data.slice(0, 50));
    } catch (error: any) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const db = getFirestore();
      const snapshot = await db.collection("cards")
        .orderBy("brain_score", "desc")
        .limit(100)
        .get();

      const data = snapshot.docs.map(doc => doc.data());
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/card/:username", async (req, res) => {
    const { username } = req.params;
    try {
      // Check preview cache first
      const cached = cardPreviewCache.get(username);
      if (cached && (Date.now() - cached.timestamp < CARD_PREVIEW_TTL)) {
        return res.json(cached.data);
      }

      const db = getFirestore();
      const doc = await db.collection("cards").doc(username).get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Card not found in preview or database" });
      }

      const data = doc.data()!;
      await db.collection("cards").doc(username).update({
        view_count: (data.view_count || 0) + 1
      });

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch card" });
    }
  });

  app.post("/api/stripe/checkout", async (req, res) => {
    const { username } = req.body;
    try {
      const stripe = getStripe();
      const priceId = process.env.STRIPE_PRO_PRICE_ID;
      const appUrl = process.env.APP_URL;

      if (!priceId || !appUrl) {
        throw new Error("Stripe configuration (STRIPE_PRO_PRICE_ID, APP_URL) is missing.");
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${appUrl}/card/${username}?success=true`,
        cancel_url: `${appUrl}/pricing`,
        metadata: { username },
      });
      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Checkout Error:", error);
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
        const db = getFirestore();
        await db.collection("cards").doc(username).update({ is_pro: true });
      }
    }

    res.json({ received: true });
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
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

  return app;
}

// Only start the server if this file is run directly
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  createServer().then((app) => {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}
