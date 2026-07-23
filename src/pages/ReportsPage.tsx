import { FileText, Download, Calendar, FileSpreadsheet, FileJson, FileType, FileCode } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DataFetcher } from '@/components/DataFetcher';
import { Badge } from '@/components/Badge';
import { PageHeader } from '@/components/PageHeader';
import { REPORT_TYPE_COLORS, timeAgo } from '@/lib/constants';
import type { Report } from '@/types';

const ICONS: Record<string, typeof FileText> = {
  PDF: FileText, Excel: FileSpreadsheet, CSV: FileCode,
  HTML: FileType, PPTX: FileText, JSON: FileJson,
};

export function ReportsPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Reports"
        description="Generated reports in PDF, Excel, CSV, HTML, PPTX, and JSON formats"
        actions={
          <button className="btn-primary">
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        }
      />
      <DataFetcher query={() => supabase.from('reports').select('*').order('generated_at', { ascending: false })}>
        {(reports: Report[]) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((r) => {
              const Icon = ICONS[r.report_type] || FileText;
              const c = REPORT_TYPE_COLORS[r.report_type] || '#6b7280';
              return (
                <div key={r.id} className="card card-hover p-5 fade-in">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: c + '15', color: c }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-100 truncate">{r.filename}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge text={r.report_type} color={c} />
                        {r.is_scheduled && <Badge text="Scheduled" color="#8b5cf6" dot />}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-400">
                    {r.keywords && (
                      <div className="flex items-center justify-between">
                        <span>Keywords</span>
                        <span className="text-slate-300 truncate ml-2 max-w-[160px]">{r.keywords}</span>
                      </div>
                    )}
                    {r.platforms && (
                      <div className="flex items-center justify-between">
                        <span>Platforms</span>
                        <span className="text-slate-300 truncate ml-2 max-w-[160px]">{r.platforms}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Size</span>
                      <span className="text-slate-300">{(r.file_size / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Generated</span>
                      <span className="text-slate-300">{timeAgo(r.generated_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/50">
                    <button className="btn-ghost flex-1 justify-center text-xs">
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                    {r.is_scheduled && (
                      <button className="btn-ghost text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {!reports.length && (
              <div className="card p-12 text-center col-span-full">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No reports generated yet</p>
              </div>
            )}
          </div>
        )}
      </DataFetcher>
    </div>
  );
}
