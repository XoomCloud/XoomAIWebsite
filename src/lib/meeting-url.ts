export type BookingSearchParams = Record<string, string | string[] | undefined>;

const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"] as const;

/** Forward campaign attribution only; never arbitrary form fields or personal data. */
export function meetingUrls(params: BookingSearchParams = {}) {
  const scheduler = new URL("https://meetings.hubspot.com/vlad-nielsen");
  for (const key of CAMPAIGN_KEYS) {
    const value = params[key];
    if (typeof value === "string" && value.trim() && value.length <= 512) {
      scheduler.searchParams.set(key, value);
    }
  }
  const fallback = scheduler.toString();
  scheduler.searchParams.set("embed", "true");
  return { embed: scheduler.toString(), fallback };
}
