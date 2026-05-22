"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  Sun,
  Bug,
  FlaskConical,
  Users,
  LayoutDashboard,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/plants", label: "My Plants", icon: Sprout },
  { href: "/guides/sunlight", label: "Sunlight", icon: Sun },
  { href: "/guides/diseases", label: "Diseases", icon: Bug },
  { href: "/guides/fertilizers", label: "Fertilizers", icon: FlaskConical },
  { href: "/guides/companions", label: "Companions", icon: Users },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-emerald-900/10 bg-emerald-950 text-emerald-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-3">
        <Link
          href="/"
          className="mr-4 flex items-center gap-2 font-semibold tracking-tight"
        >
          <Sprout className="h-6 w-6 text-emerald-400" />
          <span>Balcony Garden</span>
        </Link>
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-emerald-800 text-white"
                  : "text-emerald-200/80 hover:bg-emerald-900 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
