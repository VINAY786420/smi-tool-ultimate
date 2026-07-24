import { supabase } from './supabase.js';

export async function startJob(platform: string, keyword: string) {
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      job_type: 'collection',
      priority: 3,
      status: 'running',
      platform,
      keyword,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    console.error(`[jobs] failed to create job row for ${platform}:`, error.message);
    return null;
  }
  return data.id as string;
}

export async function completeJob(jobId: string | null, insertedCount: number) {
  if (!jobId) return;
  await supabase
    .from('jobs')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      payload: { inserted: insertedCount },
    })
    .eq('id', jobId);
}

export async function failJob(jobId: string | null, message: string) {
  if (!jobId) return;
  await supabase
    .from('jobs')
    .update({
      status: 'failed',
      completed_at: new Date().toISOString(),
      error_message: message.slice(0, 500),
    })
    .eq('id', jobId);
}
