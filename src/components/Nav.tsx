"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Sprout,
  Sun,
  Bug,
  FlaskConical,
  Users,
  LayoutDashboard,
  MapPin,
  ChevronDown,
  BookOpen,
} from "lucide-react";

const mainLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/plants", label: "My Plants", icon: Sprout },
  { href: "/locations", label: "Locations", icon: MapPin },
];

const tipLinks = [
  { href: "/guides/sunlight", label: "Sunlight", icon: Sun },
  { href: "/guides/diseases", label: "Diseases", icon: Bug },
  { href: "/guides/fertilizers", label: "Fertilizers", icon: FlaskConical },
  { href: "/guides/companions", label: "Companions", icon: Users },
];

export function Nav() {
  const pathname = usePathname();
  const [tipsOpen, setTipsOpen] = useState(false);
  const tipsRef = useRef<HTMLDivElement>(null);

  const tipsActive = pathname.startsWith("/guides");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (tipsRef.current && !tipsRef.current.contains(e.target as Node)) {
        setTipsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
        {mainLinks.map(({ href, label, icon: Icon }) => {
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
        <div className="relative" ref={tipsRef}>
          <button
            type="button"
            onClick={() => setTipsOpen((o) => !o)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
              tipsActive
                ? "bg-emerald-800 text-white"
                : "text-emerald-200/80 hover:bg-emerald-900 hover:text-white"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Plant tips
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${tipsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {tipsOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 min-w-[11rem] rounded-lg border border-emerald-800 bg-emerald-950 py-1 shadow-lg">
              {tipLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setTipsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-emerald-900 ${
                    pathname.startsWith(href) ? "bg-emerald-800 text-white" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
