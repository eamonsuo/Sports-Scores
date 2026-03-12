"use client";

import { useEffect } from "react";

export default function ClientDateSetter() {
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.cookie = `clientTimezone=${encodeURIComponent(timezone)}; path=/; max-age=86400`;
  }, []);
  return null;
}
