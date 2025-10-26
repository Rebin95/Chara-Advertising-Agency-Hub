import React from 'react';
import type { Client } from '../types';
import { FacebookIcon, InstagramIcon, TikTokIcon } from './icons';

const PlaceholderLogo1 = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="3"/>
      <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="3"/>
    </svg>
);
const PlaceholderLogo2 = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="6" y="6" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="3"/>
        <rect x="16" y="16" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="3"/>
    </svg>
);
const PlaceholderLogo3 = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M24 6L42 42H6L24 6Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
    </svg>
);
const PlaceholderLogo4 = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M8 16C16 8 32 8 40 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M8 24C16 16 32 16 40 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        <path d="M8 32C16 24 32 24 40 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
);
const placeholderLogos = [PlaceholderLogo1, PlaceholderLogo2, PlaceholderLogo3, PlaceholderLogo4];

interface ClientLogoProps {
  client: Client;
  index: number;
  onSelect: (name: string) => void;
}

const ClientLogo: React.FC<ClientLogoProps> = ({ client, index, onSelect }) => {
  const LogoComponent = placeholderLogos[index % placeholderLogos.length];
  const hasSocials = client.pages.facebook || client.pages.instagram || client.pages.tiktok;

  return (
    <div
      onClick={() => onSelect(client.name)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(client.name)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${client.name}`}
      className="group flex flex-col items-center justify-between p-4 backdrop-filter backdrop-blur-xl dark:bg-slate-900/30 bg-white/30 dark:border-slate-800/70 border border-slate-200 rounded-xl aspect-video transition-all duration-300 dark:hover:bg-slate-800/60 hover:bg-slate-50 hover:border-[#1f9a65]/50 cursor-pointer shadow-md hover:shadow-xl"
    >
      <div className="flex flex-col items-center">
          <div className="w-12 h-12 dark:text-slate-500 text-slate-400 transition-colors duration-300 dark:group-hover:text-white group-hover:text-slate-800">
            <LogoComponent />
          </div>
          <p className="mt-3 text-sm font-medium text-center dark:text-slate-400 text-slate-600 transition-colors duration-300 dark:group-hover:text-white group-hover:text-slate-900">{client.name}</p>
      </div>
      {hasSocials && (
        <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t dark:border-slate-800/50 border-slate-200/50 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {client.pages.facebook && (
                <a href={client.pages.facebook} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="dark:text-slate-400 text-slate-500 dark:hover:text-[#28c780] hover:text-[#1f9a65]" aria-label="Facebook">
                    <FacebookIcon />
                </a>
            )}
            {client.pages.instagram && (
                <a href={client.pages.instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="dark:text-slate-400 text-slate-500 dark:hover:text-[#28c780] hover:text-[#1f9a65]" aria-label="Instagram">
                    <InstagramIcon />
                </a>
            )}
            {client.pages.tiktok && (
                <a href={client.pages.tiktok} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="dark:text-slate-400 text-slate-500 dark:hover:text-[#28c780] hover:text-[#1f9a65]" aria-label="TikTok">
                    <TikTokIcon />
                </a>
            )}
        </div>
      )}
    </div>
  );
};

interface ClientLogosProps {
  clients: Client[];
  onSelectClient: (clientName: string) => void;
  onAddNew: () => void;
  t: (key: string) => string;
}


export const ClientLogos: React.FC<ClientLogosProps> = ({ clients, onSelectClient, onAddNew, t }) => {
  return (
    <div className="mt-16">
      <div className="flex justify-center items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold dark:text-[#28c780] text-[#1f9a65]">{t('manageClients')}</h2>
        <button 
            onClick={onAddNew}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#1f9a65] rounded-full hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-[#1f9a65] focus:ring-opacity-50 transition-colors"
        >
            + {t('addNewClient')}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {clients.map((client, index) => (
          <ClientLogo key={client.id} client={client} index={index} onSelect={onSelectClient} />
        ))}
      </div>
    </div>
  );
};