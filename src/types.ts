export interface GitHubData {
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  total_stars: number;
  top_repos: {
    name: string;
    description: string;
    stars: number;
    language: string;
  }[];
  events: any[];
}

export interface SkillScore {
  name: string;
  score: number;
}

export interface CardData {
  id: string;
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  github_data: any;
  brain_score: number;
  skill_scores: SkillScore[];
  ai_summary: string;
  top_projects: any;
  activity_grid: any;
  stats: any;
  is_pro: boolean;
  view_count: number;
  created_at: string;
  refreshed_at?: string;
}
