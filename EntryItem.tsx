
import React, { useState } from 'react';
import { WeeklyEntry } from './types';
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface EntryItemProps {
  entry: WeeklyEntry;
  onUpdate: (id: string, content: string) => void;
}

export const EntryItem: React.FC<EntryItemProps> = ({ entry, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);

  const handleSave = () => {
    onUpdate(entry.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="relative pl-10 group animate-in">
      {/* Timeline Bullet */}
      <div className="absolute left-0 top-1.5 w-[24px] h-[24px] rounded-full bg-white border-4 border-slate-100 group-hover:border-slate-300 transition-colors flex items-center justify-center z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-slate-400"></div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-900">{entry.weekRange}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Edit entry"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="glass p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
          {isEditing ? (
            <div className="space-y-3">
              <textarea 
                value={editContent} 
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[100px] bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-black"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSave} 
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};
