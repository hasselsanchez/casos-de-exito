"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface HeroCtaState {
  heroCtaVisible: boolean;
  setHeroCtaVisible: (visible: boolean) => void;
}

const HeroCtaContext = createContext<HeroCtaState | null>(null);

export function HeroCtaProvider({ children }: { children: ReactNode }) {
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);
  return (
    <HeroCtaContext.Provider value={{ heroCtaVisible, setHeroCtaVisible }}>
      {children}
    </HeroCtaContext.Provider>
  );
}

export function useHeroCta() {
  const ctx = useContext(HeroCtaContext);
  if (!ctx) {
    throw new Error("useHeroCta must be used inside HeroCtaProvider");
  }
  return ctx;
}
