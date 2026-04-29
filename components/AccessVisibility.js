"use client";

import { useAccess } from "@/components/AccessProvider";

export function AdvancedOnly({ children, fallback = null }) {
  const { hasAdvancedAccess, isAdmin, ready } = useAccess();

  if (!ready) {
    return null;
  }

  if (hasAdvancedAccess || isAdmin) {
    return children;
  }

  return fallback;
}

export function AdminOnly({ children, fallback = null }) {
  const { isAdmin, ready } = useAccess();

  if (!ready) {
    return null;
  }

  return isAdmin ? children : fallback;
}

export function CommonOnly({ children, fallback = null }) {
  const { isCommon, ready } = useAccess();

  if (!ready) {
    return null;
  }

  return isCommon ? children : fallback;
}
