import React from 'react';
import { Signal, Wifi, Battery } from 'lucide-react';

export const StatusBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1 text-xs font-semibold text-neutral-800 select-none bg-transparent">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="w-3.5 h-3.5 fill-current" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4 fill-current" />
      </div>
    </div>
  );
};
