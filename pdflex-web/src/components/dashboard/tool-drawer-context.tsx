"use client";

import * as React from "react";

type DrawerState = { open: boolean; toolKey: string | null };

type DrawerCtxShape = {
  state: DrawerState;
  openTool: (key: string) => void;
  closeDrawer: () => void;
};

const DrawerCtx = React.createContext<DrawerCtxShape | undefined>(undefined);

export function ToolDrawerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<DrawerState>({ open: false, toolKey: null });

  const openTool = React.useCallback((key: string) => {
    setState({ open: true, toolKey: key });
  }, []);

  const closeDrawer = React.useCallback(() => {
    setState({ open: false, toolKey: null });
  }, []);

  const value = React.useMemo(() => ({ state, openTool, closeDrawer }), [state, openTool, closeDrawer]);

  return <DrawerCtx.Provider value={value}>{children}</DrawerCtx.Provider>;
}

export function useToolDrawer() {
  const ctx = React.useContext(DrawerCtx);
  if (!ctx) throw new Error("useToolDrawer must be used within <ToolDrawerProvider />");
  return ctx;
}
