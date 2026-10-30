import React, { useState } from 'react';
import { 
  BarChart3, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  Settings, 
  Sliders, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { exportToCSV } from '../utils/exportUtils';
import { useData } from '../context/DataContext';

export default function PowerBIEmbed({ isOpen, onClose }) {
  const { powerBiConfig, updatePowerBiConfig, attendanceRecords } = useData();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState(powerBiConfig.embedUrl);
  const [reportName, setReportName] = useState(powerBiConfig.reportName);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updatePowerBiConfig({
      embedUrl: customUrl,
      reportName: reportName,
      lastRefreshed: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setShowConfig(false);
    }, 1200);
  };

  const handleDownloadDatasetForPowerBIDesktop = () => {
    exportToCSV(attendanceRecords, 'PowerBI_Faculty_Attendance_Dataset.csv');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[88vh]'
      }`}>
        
        {/* Power BI Window Titlebar (styled like Microsoft Power BI Service) */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {powerBiConfig.reportName}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  Power BI Embedded
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Connected Report • Refreshed: {powerBiConfig.lastRefreshed}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadDatasetForPowerBIDesktop}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Download CSV dataset ready to import in Power BI Desktop (.pbix)"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Export Dataset (.csv)</span>
            </button>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Configure Power BI Embed URL"
            >
              <Settings className="w-4 h-4" />
            </button>

            <a
              href={powerBiConfig.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Open full report in browser tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors font-bold ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Configuration Dropdown (if toggled) */}
        {showConfig && (
          <form onSubmit={handleSaveConfig} className="p-4 bg-slate-950/95 border-b border-slate-800 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Configure Power BI Embed Settings
              </span>
              <span className="text-[11px] text-slate-400">
                Paste your Power BI Publish to Web or Secure Embed URL below
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Embed URL (https://app.powerbi.com/...)</label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://app.powerbi.com/view?r=..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Report Title</label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="e.g. Faculty KPI & Attendance"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSaved ? 'Saved!' : 'Save & Reload'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Embedded Report Frame */}
        <div className="flex-1 w-full h-full bg-slate-950 relative">
          <iframe
            title={powerBiConfig.reportName}
            src={powerBiConfig.embedUrl}
            className="w-full h-full border-0"
            allowFullScreen={true}
          />
        </div>

        {/* Power BI Footer Info Bar */}
        <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Sparkles className="w-3 h-3" />
              Power BI Interactive Mode
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline">Use slicers, cross-highlighting & visual filters directly in report</span>
          </div>

          <div>
            Powered by Microsoft Power BI Embedded & Web Services
          </div>
        </div>

      </div>
    </div>
  );
}
