# SMI Tool Ultimate v2.0

Social Media Intelligence Tool — Ultimate Edition. Web-based dashboard for monitoring, collecting, and analyzing data across 18 social media, marketplace, and news platforms.

## Pages
- Dashboard, Data Collection, Trends, AI Analytics, Influencers, Jobs, Alerts, Reports, Integrations, Settings

## Platforms (18)
- Social: Twitter/X, Instagram, Facebook, Reddit, LinkedIn, TikTok, YouTube, Pinterest, Snapchat, Threads
- Marketplace: Amazon India, Flipkart, Meesho, Myntra, Nykaa
- News: NewsAPI, RSS Feeds, Google News

## Tech Stack
React 18 + TypeScript, Vite, Tailwind CSS, Supabase, lucide-react

## Getting Started

1. Create a Supabase project (or run one locally with the Supabase CLI).
2. Apply the schema — one migration file per page (`supabase/migrations/`):

   | File | Page |
   |---|---|
   | `0000_extensions.sql` | — (pg_trgm, needed by search indexes) |
   | `0001_collected_data.sql` | Data Collection |
   | `0002_trends.sql` | Trends |
   | `0003_analytics.sql` | AI Analytics |
   | `0004_influencers.sql` | Influencers |
   | `0005_jobs.sql` | Jobs |
   | `0006_alerts.sql` | Alerts |
   | `0007_reports.sql` | Reports |
   | `0008_webhooks.sql` | Integrations |
   | `0009_user_preferences.sql` | Settings |

   Dashboard has no table of its own — it reads from `collected_data`,
   `jobs`, `alerts`, and `influencers`, all covered above.

   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push          # applies every file in supabase/migrations/ in order
   psql "$DATABASE_URL" -f supabase/seed.sql   # optional: sample data matching the design mock
   ```
3. Copy `.env` and fill in your project's values:
   ```bash
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
   ```
4. Install and run:
   ```bash
   npm install
   npm run dev
   ```
