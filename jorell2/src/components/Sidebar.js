"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Main Page',
    href: '/',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
  },
  {
    label: 'API Keys',
    href: '/api-keys',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16.24 7.76a6 6 0 11-8.48 8.48 6 6 0 018.48-8.48z"/><path d="M12 9v3l2 2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col py-8 px-6">
      <div className="mb-8">
        <span className="text-2xl font-bold text-gray-900">BA Sensei Keys</span>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-[16px] transition-colors ${
                isActive
                  ? 'bg-purple-100 text-purple-700' // highlighted
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 