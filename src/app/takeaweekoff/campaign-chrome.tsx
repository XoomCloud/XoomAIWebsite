import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { AuditLink } from "./campaign-interactions";
import styles from "./campaign.module.css";

export function CampaignHeader({ booking = false }: { booking?: boolean }) {
  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${styles.headerInner}`}>
        <Link href={booking ? "/takeaweekoff" : "/"} aria-label={booking ? "Back to Take a Week Off" : "XoomAI home"} className={styles.logo}>
          <Image src="/images/XoomAI_Horizontal.png" alt="XoomAI" width={5705} height={1380} sizes="180px" />
        </Link>
        {booking ? (
          <Link href="/takeaweekoff" className={styles.backLink}><ArrowLeft size={16} aria-hidden="true" /> Back to the campaign</Link>
        ) : (
          <nav aria-label="Campaign navigation" className={styles.nav}>
            <a href="#workforce">The workforce</a>
            <a href="#results">Real results</a>
            <AuditLink placement="header" />
          </nav>
        )}
        {!booking && <a href={SITE.phoneHref} className={styles.mobilePhone} aria-label={`Call XoomAI on ${SITE.phone}`}><Phone size={21} aria-hidden="true" /></a>}
      </div>
    </header>
  );
}

export function CampaignFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.footerInner}`}>
        <div><strong>XoomAI</strong><p>A brand of {SITE.legalName}<br />Australian owned · ABN {SITE.abn}</p></div>
        <div className={styles.footerContact}><a href={SITE.phoneHref}>{SITE.phone}</a><a href={SITE.emailHref}>{SITE.email}</a></div>
        <p className={styles.copyright}>© {new Date().getFullYear()} {SITE.legalName}<br />Your business. Your rules. Your time back.</p>
      </div>
    </footer>
  );
}
