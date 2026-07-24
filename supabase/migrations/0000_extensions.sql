/*
  # Extensions

  pg_trgm powers fast ilike/search indexes used by:
    - Data Collection page (search by keyword, title, author)
    - Influencers page (search by username, full name)
*/
create extension if not exists pg_trgm;
