"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const OVERRIDES_KEY = "futebol-hub-entity-overrides";
const initialOverrides = {
  teams: {},
  players: {},
  reports: {}
};

const EntityOverridesContext = createContext(null);

export function EntityOverridesProvider({ children }) {
  const [overrides, setOverrides] = useState(initialOverrides);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(OVERRIDES_KEY);
      if (stored) {
        setOverrides({ ...initialOverrides, ...JSON.parse(stored) });
      }
    } catch (_error) {
      setOverrides(initialOverrides);
    } finally {
      setReady(true);
    }
  }, []);

  function persist(nextState) {
    setOverrides(nextState);
    window.localStorage.setItem(OVERRIDES_KEY, JSON.stringify(nextState));
  }

  function saveOverride(type, slug, patch) {
    const nextState = {
      ...overrides,
      [type]: {
        ...overrides[type],
        [slug]: {
          ...(overrides[type]?.[slug] || {}),
          ...patch
        }
      }
    };

    persist(nextState);
  }

  function clearOverride(type, slug) {
    const currentGroup = { ...(overrides[type] || {}) };
    delete currentGroup[slug];

    persist({
      ...overrides,
      [type]: currentGroup
    });
  }

  function applyOverride(type, item) {
    const slug = item?.slug;
    if (!slug) {
      return item;
    }

    const patch = overrides[type]?.[slug];
    return patch ? { ...item, ...patch } : item;
  }

  const value = useMemo(
    () => ({
      overrides,
      ready,
      saveOverride,
      clearOverride,
      applyOverride
    }),
    [overrides, ready]
  );

  return <EntityOverridesContext.Provider value={value}>{children}</EntityOverridesContext.Provider>;
}

export function useEntityOverrides() {
  const context = useContext(EntityOverridesContext);

  if (!context) {
    throw new Error("useEntityOverrides must be used within EntityOverridesProvider.");
  }

  return context;
}
