
import React, { useState, useEffect, useRef } from 'react';
import { WeeklyEntry } from './types';
import { EntryForm } from './EntryForm';
import { EntryItem } from './EntryItem';
import { generateId, getWeekRange, parseCSV } from './utils';
import { 
  ClipboardDocumentCheckIcon, 
  ChartBarIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [entries, setEntries] = useState<WeeklyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('weekly_focus_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setEntries(parsed);
      }
    } catch (e) {
      console.error("Local storage load failed:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('weekly_focus_data', JSON.stringify(entries));
    }
  }, [entries, isLoading]);

  const handleSave = (content: string, date: string) => {
    const newEntry: WeeklyEntry = {
      id: generateId(),
      timestamp: Date.now(),
      weekRange: getWeekRange(date),
      content,
    };
    setEntries(prev => [newEntry, ...prev].sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleUpdate = (id: string, content: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, content } : e));
  };

  const handleExport = () => {
    if (!entries.length) return alert("No logs to export.");
    const headers = ['id', 'timestamp', 'weekRange', 'content'].join(',');
    const rows = entries.map(e => [
      e.id, 
      e.timestamp, 
      `"${e.weekRange}"`, 
      `"${e.content.replace(/"/g, '""')}"`
    ].join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `weekly-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        const startIdx = parsed[0]?.[0] === 'id' ? 1 : 0;
        const imported = parsed.slice(startIdx).map(row => ({
          id: row[0] || generateId(),
          timestamp: parseInt(row[1]) || Date.now(),
          weekRange: row[2] || "Unknown Week",
          content: row[3] || ""
        })).filter(e => e.content.trim() !== "");
        
        setEntries(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = imported.filter(i => !existingIds.has(i.id));
          return [...uniqueNew, ...prev].sort((a, b) => b.timestamp - a.timestamp);
        });
      } catch (err) {
        alert("Import failed. Please ensure the CSV format is correct.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fdfdff]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Initializing...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20">
      <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
      
      <nav className="flex items-center justify-between mb-16 lg:mb-24">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg">
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">Focus Tracker</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="p-2 text-slate-400 hover:text-slate-900 transition-colors" title="Export CSV">
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-slate-900 transition-colors" title="Import CSV">
            <ArrowUpTrayIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <ChartBarIcon className="w-3 h-3" />
            <span>{entries.length} Logs</span>
          </div>
        </div>
      </nav>

      <main className="space-y-16 lg:space-y-24">
        {/* Input Section */}
        <section className="space-y-8">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            What did you get done last week?
          </h2>
          <div className="animate-in" style={{ animationDelay: '0.1s' }}>
            <EntryForm onSave={handleSave} />
          </div>
        </section>

        {/* History Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Logs</h3>
          </div>

          <div className="space-y-12 relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-[2px] before:bg-slate-100">
            {entries.length === 0 ? (
              <div className="pl-12 py-10">
                <p className="text-slate-400 italic">No history yet. Record your first win above.</p>
              </div>
            ) : (
              entries.map(entry => (
                <EntryItem 
                  key={entry.id} 
                  entry={entry} 
                  onUpdate={handleUpdate}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="mt-32 pt-12 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-300 italic uppercase tracking-[0.2em]">
          Privacy-centric • All data stays in your browser
        </p>
      </footer>
    </div>
  );
};

export default App;
