/*
  Seed data matching the mock screenshots, so `npm run dev` renders the
  same Dashboard / Data Collection / Influencers / Analytics / Trends /
  Jobs / Alerts / Reports / Integrations views shown in the design.
  Run after 0001_init.sql: supabase db reset (applies migrations + this file)
*/

-- ---------- collected_data ----------
insert into collected_data (platform, platform_type, data_type, keyword, title, content, author, url, likes, comments, shares, views, price, sentiment, collected_at, source) values
('TikTok', 'Social', 'Post', 'fashion trends', 'GRWM summer look', null, '@glamgirl', null, 28000, 1200, 4500, null, null, 'Positive', now() - interval '16 hours', 'api'),
('Google News', 'News', 'Article', 'fashion trends', 'Sustainable fashion gains momentum', null, 'Vogue', null, null, null, null, 4200, null, 'Positive', now() - interval '16 hours', 'api'),
('NewsAPI', 'News', 'Article', 'AI tools', 'Tech giants pour billions into AI infrastructure', null, 'TechCrunch', null, null, null, null, 8900, null, 'Neutral', now() - interval '16 hours', 'api'),
('Flipkart', 'Marketplace', 'Product', 'wireless earbuds', 'boAt Airdopes 141', null, 'FlipkartSeller', null, null, null, null, null, 1299, null, now() - interval '16 hours', 'api'),
('Amazon India', 'Marketplace', 'Product', 'wireless earbuds', 'Noise Buds Pro - TWS Earbuds', null, 'AmazonSeller', null, null, null, null, null, 2999, null, now() - interval '16 hours', 'api'),
('YouTube', 'Social', 'Post', 'AI tools', 'I built an app with only AI in 24 hours', null, 'CreatorCode', null, 12400, 1800, 3200, null, null, 'Positive', now() - interval '16 hours', 'api'),
('Instagram', 'Social', 'Post', 'fashion trends', 'Summer collection drop', null, '@styleblogger', null, 4300, 520, null, null, null, null, now() - interval '16 hours', 'api'),
('Reddit', 'Social', 'Post', 'AI tools', 'Best AI coding assistants 2025?', null, 'u/coderdude', null, 560, 180, null, null, null, null, now() - interval '16 hours', 'api'),
('Twitter/X', 'Social', 'Post', 'AI tools', 'Worried about AI replacing jobs', null, '@devworker', null, 940, 210, null, null, null, null, now() - interval '16 hours', 'api'),
('Twitter/X', 'Social', 'Post', 'AI tools', 'AI is transforming every industry in 2025', null, '@techwatch', null, 1800, 340, null, null, null, null, now() - interval '16 hours', 'api');

-- ---------- influencers ----------
insert into influencers (platform, username, full_name, followers, engagement_rate, avg_likes, avg_comments, avg_shares, score, sentiment_score, virality_score, profile_url, verified) values
('TikTok', '@glamgirl', 'Glam Girl', 2400000, 12.3, 28000, 1200, 0, 98.5, 90.0, 98.5, null, true),
('YouTube', 'CreatorCode', 'Creator Code', 1200000, 8.5, 12400, 1800, 0, 95.8, 85.0, 95.8, null, true),
('Instagram', '@styleblogger', 'Style Blogger', 890000, 6.8, 4300, 520, 0, 91.2, 92.0, 91.2, null, true),
('Twitter/X', '@techwatch', 'Tech Watch', 540000, 4.2, 1800, 340, 0, 87.5, 88.0, 87.5, null, true),
('Twitter/X', '@devworker', 'Dev Worker', 120000, 3.5, 940, 210, 0, 62.3, 40.0, 62.3, null, false),
('Reddit', 'u/coderdude', 'Coder Dude', 85000, 5.0, 560, 180, 0, 45.0, 55.0, 45.0, null, false);

-- ---------- trends ----------
insert into trends (platform, platform_type, keyword, hashtag, volume, growth_rate, recorded_at) values
('TikTok', 'Social', 'fashion trends', '#GRWM', 157000, 52, now() - interval '16 hours');

-- ---------- analytics ----------
insert into analytics (keyword, platform, total_mentions, positive_pct, negative_pct, neutral_pct, avg_engagement, top_platform, top_influencers, trending_topics, virality_stats, generated_at) values
('AI tools', 'YouTube', 48200, 58, 22, 20, 12400, 'YouTube',
  '[{"username":"CreatorCode","score":95.8},{"username":"@techwatch","score":87.5}]',
  '{AI,automation,coding,infrastructure}',
  '{"avg_virality":72.5,"peak_day":"2025-07-22"}', now() - interval '16 hours'),
('fashion trends', 'TikTok', 157000, 72, 10, 18, 31000, 'TikTok',
  '[{"username":"@glamgirl","score":98.5},{"username":"@styleblogger","score":91.2}]',
  '{summer,pastels,sustainable,GRWM}',
  '{"avg_virality":94.8,"peak_day":"2025-07-23"}', now() - interval '16 hours'),
('wireless earbuds', 'Amazon India', 18000, 65, 15, 20, 2200, 'Amazon India',
  '[]',
  '{earbuds,audio,budget,ANC}',
  '{"avg_virality":18.0,"peak_day":"2025-07-20"}', now() - interval '16 hours');

-- ---------- jobs ----------
insert into jobs (job_type, priority, status, platform, keyword, started_at, completed_at, retry_count, error_message, created_at) values
('collect', 5, 'completed', 'Twitter/X', 'AI tools', now() - interval '365 days', now() - interval '365 days', 0, null, now() - interval '16 hours'),
('collect', 3, 'running', 'YouTube', 'AI tools', now() - interval '365 days', null, 0, null, now() - interval '16 hours'),
('analyze', 4, 'pending', null, 'fashion trends', null, null, 0, null, now() - interval '16 hours'),
('collect', 2, 'failed', 'TikTok', 'fashion trends', now() - interval '365 days', null, 3, 'HTTP 429: rate limited', now() - interval '16 hours'),
('collect', 1, 'pending', 'Amazon India', 'wireless earbuds', null, null, 0, null, now() - interval '16 hours'),
('report', 3, 'completed', null, 'AI tools', now() - interval '366 days', now() - interval '366 days', 0, null, now() - interval '16 hours');

-- ---------- alerts ----------
insert into alerts (alert_type, severity, platform, message, triggered_at, acknowledged, resolved, sent_to) values
('trend_spike', 'critical', 'TikTok', 'Trend "fashion trends" spiked 52% on TikTok in last hour', now() - interval '16 hours', false, false, '{slack,telegram}'),
('rate_limit', 'warning', 'TikTok', 'TikTok scraper hit rate limit (HTTP 429). Retrying with backoff.', now() - interval '16 hours', false, false, '{email}'),
('sentiment_shift', 'info', 'Twitter/X', 'Sentiment shifted +8% positive for "AI tools" on Twitter/X', now() - interval '16 hours', false, false, '{slack}'),
('job_failed', 'critical', 'TikTok', 'Collection job for fashion trends on TikTok failed after 3 retries', now() - interval '16 hours', false, false, '{email,slack}');

-- ---------- reports ----------
insert into reports (report_type, filename, file_path, file_size, keywords, platforms, is_scheduled, generated_at) values
('PDF', 'AI_tools_report_2025-07-22.pdf', '/reports/AI_tools_report_2025-07-22.pdf', 2506752, 'AI tools', 'Twitter/X,YouTube,Reddit', true, now() - interval '16 hours'),
('Excel', 'fashion_trends_2025-07-23.xlsx', '/reports/fashion_trends_2025-07-23.xlsx', 1822720, 'fashion trends', 'Instagram,TikTok', false, now() - interval '16 hours'),
('CSV', 'earbuds_data_2025-07-20.csv', '/reports/earbuds_data_2025-07-20.csv', 942080, 'wireless earbuds', 'Amazon India,Flipkart', false, now() - interval '16 hours'),
('HTML', 'dashboard_2025-07-23.html', '/reports/dashboard_2025-07-23.html', 3283968, 'AI tools,fashion trends', 'All', true, now() - interval '16 hours'),
('JSON', 'api_export_2025-07-23.json', '/reports/api_export_2025-07-23.json', 5735628, 'AI tools', 'Twitter/X', false, now() - interval '16 hours');

-- ---------- webhooks ----------
insert into webhooks (name, url, events, headers, active, created_at) values
('Slack Alerts', 'https://hooks.slack.com/services/T0/B0/X0', 'alert_triggered,job_failed', '{}', true, now() - interval '16 hours'),
('Zapier Flow', 'https://hooks.zapier.com/hooks/catch/123456/abc', 'report_generated,trend_detected', '{}', true, now() - interval '16 hours'),
('Discord Bot', 'https://discord.com/api/webhooks/123/abc', 'alert_triggered', '{}', false, now() - interval '16 hours');
