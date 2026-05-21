"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "futebol-hub-monitorados";

function readItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function saveItems(items) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("monitorados-updated"));
}

export function getMonitoredItems() {
  return readItems();
}

export default function MonitorButton({ item }) {
  const [isMonitored, setIsMonitored] = useState(false);

  useEffect(() => {
    setIsMonitored(readItems().some((entry) => entry.id === item.id && entry.type === item.type));
  }, [item.id, item.type]);

  function toggleMonitor() {
    const items = readItems();
    const exists = items.some((entry) => entry.id === item.id && entry.type === item.type);

    if (exists) {
      saveItems(items.filter((entry) => !(entry.id === item.id && entry.type === item.type)));
      setIsMonitored(false);
      return;
    }

    saveItems([{ ...item, savedAt: new Date().toISOString() }, ...items]);
    setIsMonitored(true);
  }

  return (
    <button type="button" className="ghost-button" onClick={toggleMonitor}>
      {isMonitored ? "Monitorando" : "Monitorar"}
    </button>
  );
}
