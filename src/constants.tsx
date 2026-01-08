
import React from 'react';

export const COLORS = {
  primary: '#fbbf24', // Amber 400
  secondary: '#38bdf8', // Sky 400
  accent: '#f43f5e', // Rose 500
  bg: '#0f172a', // Slate 900
  card: '#1e293b', // Slate 800
  text: '#f8fafc', // Slate 50
  gold: '#fbbf24',
  silver: '#94a3b8',
  bronze: '#92400e',
};

export const WORLD_COLORS = [
  'bg-sky-500',
  'bg-emerald-500',
  'bg-indigo-500'
];

export const WORLD_NAMES = [
  'Sky Kingdom',
  'Jade Valley',
  'Abyssal Depth'
];

export const RULES = {
  TOTAL_WORLDS: 3,
  LEVELS_PER_WORLD: 5,
  AD_REMOVE_PRICE: 2.99,
};

export const Icons = {
  Star: ({ className = "w-6 h-6", fill = "currentColor" }: { className?: string; fill?: string; key?: React.Key }) => (
    <svg className={className} viewBox="0 0 24 24" fill={fill}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Lock: ({ className = "w-6 h-6" }: { className?: string; key?: React.Key }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0110 0v4"></path>
    </svg>
  ),
  Play: ({ className = "w-6 h-6" }: { className?: string; key?: React.Key }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  // Added Settings icon to fix missing property error in SettingsScreen
  Settings: ({ className = "w-6 h-6" }: { className?: string; key?: React.Key }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  // Added Music icon to fix missing property error in SettingsScreen
  Music: ({ className = "w-6 h-6" }: { className?: string; key?: React.Key }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  ),
  // Added Volume icon to fix missing property error in SettingsScreen
  Volume: ({ className = "w-6 h-6" }: { className?: string; key?: React.Key }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
  ),
};
