import { useState, useEffect } from 'react';
import { Sidebar, type PageId } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { supabase } from '@/lib/supabase';
import { DashboardPage } from '@/pages/DashboardPage';
import { CollectionPage } from '@/pages/CollectionPage';
import { TrendsPage } from '@/pages/TrendsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { InfluencersPage } from '@/pages/InfluencersPage';
import { JobsPage } from '@/pages/JobsPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { IntegrationsPage } from '@/pages/IntegrationsPage';
import { SettingsPage } from '@/pages/SettingsPage';

const META: Record<PageId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Social Media Intelligence Overview' },
  collection: { title: 'Data Collection', subtitle: 'Collected data across all 18 platforms' },
  trends: { title: 'Trends', subtitle: 'Trending topics and hashtag performance' },
  analytics: { title: 'AI Analytics', subtitle: 'Sentiment, emotion, and virality analysis' },
  influencers: { title: 'Influencers', subtitle: 'Scored influencer profiles' },
  jobs: { title: 'Jobs', subtitle: 'Background collection and analysis jobs' },
  alerts: { title: 'Alerts', subtitle: 'Real-time alert monitoring' },
  reports: { title: 'Reports', subtitle: 'Generated report files' },
  integrations: { title: 'Integrations', subtitle: 'Webhooks and external services' },
  settings: { title: 'Settings', subtitle: 'API keys, security, and preferences' },
};

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [alertCount, setAlertCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const [{ count: a }, { count: j }] = await Promise.all([
        supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('resolved', false),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).in('status', ['pending', 'running']),
      ]);
      setAlertCount(a ?? 0); setJobCount(j ?? 0);
    };
    fetch();
  }, [page]);

  const render = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />; case 'collection': return <CollectionPage />;
      case 'trends': return <TrendsPage />; case 'analytics': return <AnalyticsPage />;
      case 'influencers': return <InfluencersPage />; case 'jobs': return <JobsPage />;
      case 'alerts': return <AlertsPage />; case 'reports': return <ReportsPage />;
      case 'integrations': return <IntegrationsPage />; case 'settings': return <SettingsPage />;
    }
  };

  const m = META[page];
  return (
    <div className="flex min-h-screen bg-[#0a0e1a]">
      <Sidebar active={page} onNavigate={setPage} alertCount={alertCount} jobCount={jobCount} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={m.title} subtitle={m.subtitle} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }} refreshing={refreshing} />
        <main className="flex-1 overflow-y-auto" key={page}>{render()}</main>
      </div>
    </div>
  );
}
