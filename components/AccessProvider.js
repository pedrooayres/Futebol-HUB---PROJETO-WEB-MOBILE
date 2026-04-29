"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AccessContext = createContext(null);

const STORAGE_KEY = "futebol-hub-access-role";

export function AccessProvider({ children }) {
  const [role, setRole] = useState("");
  const [ready, setReady] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    const storedRole = window.localStorage.getItem(STORAGE_KEY) || "";
    setRole(storedRole);
    setShowSelector(!storedRole);
    setReady(true);
  }, []);

  function chooseRole(nextRole) {
    window.localStorage.setItem(STORAGE_KEY, nextRole);
    setRole(nextRole);
    setShowSelector(false);
    setAdminError("");
  }

  function reopenSelector() {
    setShowSelector(true);
    setAdminError("");
  }

  async function unlockAdmin(code) {
    setAdminLoading(true);
    setAdminError("");

    try {
      const response = await fetch("/api/access/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setAdminError(data.message || "Nao foi possivel liberar o perfil admin.");
        return false;
      }

      chooseRole("admin");
      return true;
    } catch (_error) {
      setAdminError("Falha ao validar o acesso admin.");
      return false;
    } finally {
      setAdminLoading(false);
    }
  }

  const value = useMemo(
    () => ({
      role,
      ready,
      showSelector,
      setShowSelector,
      chooseRole,
      reopenSelector,
      unlockAdmin,
      adminLoading,
      adminError,
      isCommon: role === "common",
      isProfessional: role === "professional",
      isAdmin: role === "admin",
      hasAdvancedAccess: role === "professional" || role === "admin"
    }),
    [role, ready, showSelector, adminLoading, adminError]
  );

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const context = useContext(AccessContext);

  if (!context) {
    throw new Error("useAccess must be used within AccessProvider.");
  }

  return context;
}
