import { Link, useRouterState } from "@tanstack/react-router";
import {
  Boxes,
  Fingerprint,
  Images,
  LayoutDashboard,
  LayoutTemplate,
  Settings,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_MODE, getAIProvider } from "@/services/ai";

const PRIMARY_NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/create", label: "Create", icon: Wand2 },
  { to: "/projects", label: "Projects", icon: Boxes },
];

const LIBRARY_NAV = [
  { to: "/references", label: "References", icon: Images },
  { to: "/brand", label: "Brand DNA", icon: Fingerprint },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/assets", label: "Assets", icon: Sparkles },
];

function NavList({
  items,
  pathname,
}: {
  items: typeof PRIMARY_NAV;
  pathname: string;
}) {
  return (
    <div className="space-y-0.5">
      {items.map(({ to, label, icon: Icon }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const provider = getAIProvider();

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="px-5 pb-6 pt-6">
        <Link to="/" className="block">
          <div className="text-[15px] font-extrabold tracking-tight">DESIGN AI</div>
          <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
            AI-powered visual production
            <br />
            for creative teams
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3">
        <NavList items={PRIMARY_NAV} pathname={pathname} />
        <div>
          <div className="label-caps px-2.5 pb-2">Library</div>
          <NavList items={LIBRARY_NAV} pathname={pathname} />
        </div>
        <div>
          <div className="label-caps px-2.5 pb-2">Workspace</div>
          <NavList
            items={[{ to: "/settings", label: "Settings", icon: Settings }]}
            pathname={pathname}
          />
        </div>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            SM
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">Santiago Mendez</div>
            <div className="truncate text-[11px] text-muted-foreground">Design team</div>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between rounded-md bg-surface-sunken px-2.5 py-2">
          <span className="label-caps">{AI_MODE === "demo" ? "Demo mode" : "Production"}</span>
          <span
            className="size-1.5 rounded-full bg-signal"
            title={provider.label}
            aria-hidden
          />
        </div>
      </div>
    </aside>
  );
}
