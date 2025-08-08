export function formatDate(date: Date | string | number | undefined, opts: Intl.DateTimeFormatOptions = {}) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      day: opts.day ?? "numeric",
      month: opts.month ?? "long",
      year: opts.year ?? "numeric",
      hour: "2-digit",
      minute: "numeric",
      ...opts,
    }).format(new Date(date));
  } catch {
    return "";
  }
}
