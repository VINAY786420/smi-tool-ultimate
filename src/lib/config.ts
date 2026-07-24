import 'dotenv/config';

export function getKeywords(): string[] {
  const raw = process.env.SEARCH_KEYWORDS || '';
  const keywords = raw
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  return keywords.length > 0 ? keywords : ['technology']; // safe default so collectors never crash on empty config
}

export function insertRows<T>(rows: T[], batchSize = 200): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < rows.length; i += batchSize) {
    batches.push(rows.slice(i, i + batchSize));
  }
  return batches;
}
