import React from 'react';
import type { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  onSelect: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(employee)}
      className="backdrop-filter backdrop-blur-xl dark:bg-slate-900/30 bg-white/30 rounded-2xl shadow-md p-6 flex flex-col h-full transition-all duration-300 hover:scale-105 border dark:border-slate-700 border-slate-200 hover:border-[#1f9a65] cursor-pointer group hover:shadow-xl"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(employee)}
      aria-label={`Open chat with ${employee.name}`}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full dark:bg-slate-800 bg-slate-50 dark:text-[#28c780] text-[#1f9a65] mr-4 shrink-0 transition-colors group-hover:bg-[#1f9a65]/10">
          {employee.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold dark:text-white text-slate-950">{employee.name}</h3>
          <p className="dark:text-[#28c780] text-[#1f9a65] text-sm">{employee.roleKurdish}</p>
        </div>
      </div>
      <p className="dark:text-slate-300 text-slate-700 text-sm flex-grow">{employee.description}</p>
    </div>
  );
};
