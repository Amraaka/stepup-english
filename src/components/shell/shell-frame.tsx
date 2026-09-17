"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SIDEBAR_COOKIE } from "@/lib/ui-prefs";

type SidebarContext = { collapsed: boolean; toggle: () => void };

const Ctx = createContext<SidebarContext>({ collapsed: false, toggle: () => {} });

export function useSidebar(): SidebarContext {
  return useContext(Ctx);
}

/**
 * Desktop grid whose sidebar column collapses to an icon rail.
 * Columns include the floating sidebar's 12px left inset (panel is 248px / 76px).
 * Descendants style themselves with `group-data-[sidebar=collapsed]/shell:`.
 */
export function ShellFrame({
  initialCollapsed,
  children,
}: {
  initialCollapsed: boolean;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  useEffect(() => {
    document.cookie = `${SIDEBAR_COOKIE}=${collapsed ? "collapsed" : "expanded"}; path=/; max-age=31536000; samesite=lax`;
  }, [collapsed]);

  const value = useMemo(() => ({ collapsed, toggle }), [collapsed, toggle]);

  return (
    <Ctx.Provider value={value}>
      <div
        data-sidebar={collapsed ? "collapsed" : "expanded"}
        className={`group/shell min-h-dvh lg:grid lg:transition-[grid-template-columns] lg:duration-200 lg:ease-out ${
          collapsed ? "lg:grid-cols-[88px_minmax(0,1fr)]" : "lg:grid-cols-[260px_minmax(0,1fr)]"
        }`}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}
