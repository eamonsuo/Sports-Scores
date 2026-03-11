"use client";

import { useEffect } from "react";

export default function ClientDateSetter() {
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // "2026-03-11"
    document.cookie = `clientDate=${today}; path=/; max-age=86400`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.cookie = `clientTimezone=${encodeURIComponent(timezone)}; path=/; max-age=86400`;
  }, []);
  return null;
}
