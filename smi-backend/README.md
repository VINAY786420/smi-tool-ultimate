# SMI Tool — Collection Backend

Node.js + TypeScript backend that fetches real data from official platform APIs
and writes it into the same Supabase tables your frontend already reads from.

## Dual-mode design

Every collector checks whether its API credentials are present in `.env`:

- **Keys present** → uses the official authenticated API (higher rate limits, full data). Rows are tagged `source: 'api'`.
- **No keys** → falls back to a platform's public, no-auth endpoint where one legitimately exists (e.g. Reddit's public `.json` search, public RSS feeds). Rows are tagged `source: 'public'`.
- **Platform has no public or free API at all** (e.g. Instagram, Amazon India) → not included yet. Scraping platforms whose Terms of Service prohibit it isn't something this backend does; those need an official partner/affiliate API application.

You never have to change code — just add keys to `.env` and the next run automatically switches modes.

## Platforms implemented so far

| Platform | Status | What real-mode actually gives you |
|---|---|---|
| Reddit | ✅ | full keyword search (public fallback works too) |
| Google News | ✅ | full keyword search, no key ever needed |
| RSS Feeds | ✅ | your configured feeds, keyword-filtered |
| NewsAPI | ✅ | full keyword search (falls back to Google News RSS without a key) |
| YouTube | ✅ | full keyword search, but a key is mandatory (no fallback exists) |
| Twitter/X | ✅ | full keyword search, but needs a **paid** API tier |
| Instagram | ✅ | hashtag lookup only, needs a Business account |
| Facebook | ✅ | your own Page's posts only (public search was removed in 2015) |
| LinkedIn | ✅ | your own organization's posts only, needs Partner Program approval |
| TikTok | ✅ | your own connected account's videos only |
| Pinterest | ✅ | your own account's pins only |
| Threads | ✅ | your own account's posts only |
| Amazon India | ✅ | product search, needs an approved Associates account |
| Flipkart | ✅ | category feed (not full search), needs an approved affiliate account |
| Snapchat | ⏸ permanently unavailable | no content-read API exists at all |
| Meesho, Myntra, Nykaa | ⏸ permanently unavailable | no public or self-serve API exists |

**Important:** for Instagram, Facebook, LinkedIn, TikTok, Pinterest, and Threads, the official
APIs only let you read content from accounts/pages *you* control - none of them offer
true public keyword search across the platform. That's a limitation of what these
companies expose, not something more code can work around.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — from Supabase Dashboard → Settings → API. **Use the `service_role` key here** (this runs on a server, never the browser), not the `anon` key your frontend uses.
- `SEARCH_KEYWORDS` — comma-separated terms to track.
- Platform keys — optional, add whenever you get them.

## Run

```bash
npm run collect:all          # every collector, one after another
# or individually:
npm run collect:reddit
npm run collect:youtube
npm run collect:news
npm run collect:rss
npm run collect:googlenews
npm run collect:twitter
npm run collect:instagram
npm run collect:facebook
npm run collect:linkedin
npm run collect:tiktok
npm run collect:pinterest
npm run collect:snapchat     # always logs 'unavailable', 0 rows
npm run collect:threads
npm run collect:amazon
npm run collect:flipkart
npm run collect:meesho       # always logs 'unavailable', 0 rows
npm run collect:myntra       # always logs 'unavailable', 0 rows
npm run collect:nykaa        # always logs 'unavailable', 0 rows
```

Each run creates a row in the `jobs` table (visible on the Jobs page) and inserts results into `collected_data` (visible on Dashboard / Data Collection pages).

## Getting a free Reddit API key (optional, for higher limits)

1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app...", choose type **script**
3. Copy the client ID (under the app name) and secret into `.env`

## Deploying so it runs on a schedule

This is a script, not a web server — best run as a **scheduled job**, not a always-on web service:

- **Render → New → Cron Job**: set the command to `npm run collect:all`, schedule e.g. every hour.
- Alternatively, a Supabase Edge Function + `pg_cron` can call the same logic ported to Deno.

## All 18 platforms are now covered

Every platform from the original list has a collector. Where a platform's official API
only exposes your own account/page (Instagram, Facebook, LinkedIn, TikTok, Pinterest,
Threads), that's documented in the table above and in each collector's `note` field -
it's a limit of what those companies' APIs offer, not something this backend can extend.
Snapchat, Meesho, Myntra, and Nykaa have no public API at all and will always report
`unavailable`.
