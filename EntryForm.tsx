
import React, { useState } from 'react';
import { CalendarDaysIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { getWeekRange } from './utils';

interface EntryFormProps {
  onSave: (content: string, date: string) => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ onSave }) => {
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSave(content, date);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl blur opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
      <div className="relative glass rounded-2xl border border-slate-200 p-4 shadow-xl shadow-slate-200/50">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="List your Accomplishments..."
          className="w-full min-h-[150px] bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none leading-relaxed text-lg"
          onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleSubmit(e); }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t border-slate-100 gap-4">
          <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl border border-slate-200">
            <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Week Of</span>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 border-none focus:ring-0 outline-none p-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{getWeekRange(date)}</p>
          </div>
          <button
            type="submit"
            disabled={!content.trim()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all bg-black text-white hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <span>Save</span> <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
