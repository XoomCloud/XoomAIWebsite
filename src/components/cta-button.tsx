"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { SITE } from "@/lib/site";

type Props = ButtonProps & {
  href?: string;
  event?: string;
  eventLabel?: string;
  /** When true, link to the external booking system. */
  booking?: boolean;
  children: React.ReactNode;
};

/** A trackable CTA. Emits a dataLayer event on click for GA4/GTM. */
export function CTAButton({
  href,
  booking,
  event = "cta_click",
  eventLabel,
  children,
  ...props
}: Props) {
  const target = booking ? SITE.bookingUrl : href ?? "#";
  const external = target.startsWith("http");

  const onClick = () =>
    trackEvent(event, { label: eventLabel ?? (typeof children === "string" ? children : undefined), destination: target });

  if (external) {
    return (
      <Button asChild {...props}>
        <a href={target} target="_blank" rel="noopener noreferrer" data-cta={eventLabel} onClick={onClick}>
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild {...props}>
      <Link href={target} data-cta={eventLabel} onClick={onClick}>
        {children}
      </Link>
    </Button>
  );
}
