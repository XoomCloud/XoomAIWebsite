import assert from "node:assert/strict";
import test from "node:test";
import { meetingUrls } from "../src/lib/meeting-url";

test("booking attribution survives in both embedded and fallback calendars", () => {
  const params = { utm_source: "ig", utm_medium: "paid_social", utm_campaign: "Take a week off", utm_content: "ad-123", utm_term: "adset-456", utm_id: "campaign-789" };
  const urls = meetingUrls(params);
  for (const url of [urls.embed, urls.fallback]) {
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, "https://meetings.hubspot.com/vlad-nielsen");
    for (const [key, value] of Object.entries(params)) assert.equal(parsed.searchParams.get(key), value);
  }
  assert.equal(new URL(urls.embed).searchParams.get("embed"), "true");
  assert.equal(new URL(urls.fallback).searchParams.has("embed"), false);
});

test("arbitrary fields, repeated parameters and oversized values are not forwarded", () => {
  const urls = meetingUrls({ email: "private@example.com", redirect: "https://example.com", embed: "false", fbclid: "click-id", utm_source: ["fb", "ig"], utm_campaign: "x".repeat(513), utm_medium: " " });
  assert.equal(urls.embed, "https://meetings.hubspot.com/vlad-nielsen?embed=true");
});

test("campaign values are encoded rather than interpreted as new URL parameters", () => {
  const url = new URL(meetingUrls({ utm_content: "creative&email=private@example.com#fragment" }).embed);
  assert.equal(url.searchParams.get("utm_content"), "creative&email=private@example.com#fragment");
  assert.equal(url.searchParams.has("email"), false);
  assert.equal(url.hash, "");
});
