'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LockButton } from './lock-button';

const LINKS = [
  { href: '/admin', label: 'Orders' },
  { href: '/admin/sent', label: 'Sent' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/admin" className="brand">
          Cash Flow <span className="badge">Admin</span>
        </Link>
        <nav className="nav-links">
          {LINKS.map((link) => {
            // "/admin" would otherwise stay active on every admin route.
            const active =
              link.href === '/admin'
                ? pathname === '/admin' || /^\/admin\/[^/]+$/.test(pathname)
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}>
                {link.label}
              </Link>
            );
          })}
          <LockButton />
        </nav>
      </div>
    </header>
  );
}
