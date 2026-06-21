'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, setPending] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPending = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPending(false);
  }, []);

  React.useEffect(() => {
    clearPending();
  }, [pathname, searchParams, clearPending]);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isModifiedClick(event)) return;

      const target = event.target as Element | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin) return;
      if (nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search) return;

      setPending(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setPending(false), 6000);
    };

    window.addEventListener('click', handleClick, { capture: true });
    window.addEventListener('pageshow', clearPending);

    return () => {
      window.removeEventListener('click', handleClick, { capture: true });
      window.removeEventListener('pageshow', clearPending);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [clearPending]);

  return (
    <div
      className={`navigation-progress ${pending ? 'navigation-progress--active' : ''}`}
      aria-hidden="true"
    />
  );
}
