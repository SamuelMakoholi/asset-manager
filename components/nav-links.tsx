"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Package, Building, Folder } from 'lucide-react';

const adminLinks = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: Home },
  { name: 'Users', href: '/dashboard/admin/users', icon: Users },
  { name: 'Categories', href: '/dashboard/admin/categories', icon: Folder },
  { name: 'Departments', href: '/dashboard/admin/departments', icon: Building },
  { name: 'Assets', href: '/dashboard/admin/assets', icon: Package },
];

const userLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Assets', href: '/dashboard/assets', icon: Package },
];

export default function NavLinks({ userRole }: { userRole: 'admin' | 'user' }) {
  const pathname = usePathname();
  const links = userRole === 'admin' ? adminLinks : userLinks;

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors
              ${isActive
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <LinkIcon className="h-4 w-4" />
            <span className="truncate">{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}
