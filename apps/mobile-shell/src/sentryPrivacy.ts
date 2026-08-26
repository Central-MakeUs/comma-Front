const URL_DATA_KEYS = ['from', 'to', 'url'] as const;

export function stripUrlDetails(value: string) {
  return value.split(/[?#]/, 1)[0];
}

export function sanitizeSentryBreadcrumb<
  T extends { category?: string; data?: Record<string, unknown> }
>(breadcrumb: T): T | null {
  if (breadcrumb.category === 'console') return null;
  if (!breadcrumb.data) return breadcrumb;

  const data = { ...breadcrumb.data };
  for (const key of URL_DATA_KEYS) {
    if (typeof data[key] === 'string') data[key] = stripUrlDetails(data[key]);
  }
  delete data.arguments;

  return { ...breadcrumb, data };
}

export function sanitizeSentryBreadcrumbs<
  T extends { category?: string; data?: Record<string, unknown> }
>(breadcrumbs: T[] | undefined) {
  return breadcrumbs?.flatMap((breadcrumb) => {
    const sanitized = sanitizeSentryBreadcrumb(breadcrumb);
    return sanitized ? [sanitized] : [];
  });
}
