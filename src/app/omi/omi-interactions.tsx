"use client";

import { useState } from "react";
import { ArrowUpRight, AudioLines, Check, ChevronRight, Play, Workflow } from "lucide-react";
import { SITE } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { trackMetaCustom } from "@/lib/meta";
import styles from "./omi.module.css";

const moments = [
  { time: "09:15", title: "The client conversation", context: "Client meeting · New proposal", quote: "Send Alex the revised proposal. Include the installation option, and follow up on Friday.", memory: "Alex needs the revised scope and installation option before making a decision.", tasks: [
    { role: "Sales Representative", action: "Prepare the revised proposal", detail: "Installation option included · Ready for approval" },
    { role: "Executive Assistant", action: "Set the Friday follow-up", detail: "Client, deadline and conversation linked" },
    { role: "Operations Coordinator", action: "Update the opportunity", detail: "Scope and next step added to the CRM" },
  ] },
  { time: "11:30", title: "The site walk-through", context: "Site visit · Project coordination", quote: "The delivery has moved to Thursday. Let the project team know and draft the variation for review.", memory: "A delivery change affects the project schedule and needs a documented variation.", tasks: [
    { role: "Project Coordinator", action: "Update the delivery milestone", detail: "Thursday delivery · Dependencies flagged" },
    { role: "Project Administrator", action: "Draft the variation", detail: "Source conversation attached · Review required" },
    { role: "Executive Assistant", action: "Prepare the team update", detail: "Correct project and recipients identified" },
  ] },
  { time: "14:00", title: "The idea between meetings", context: "Voice note · A thought worth keeping", quote: "We should build an onboarding guide for new clients. Use the questions the team keeps getting asked.", memory: "Create a client onboarding guide using recurring questions and existing approved material.", tasks: [
    { role: "Knowledge Assistant", action: "Find the recurring questions", detail: "Search approved documents and knowledge sources" },
    { role: "Marketing Coordinator", action: "Outline the onboarding guide", detail: "Brand voice and client context included" },
    { role: "Operations Coordinator", action: "Create the review task", detail: "Owner, source material and next step in one place" },
  ] },
  { time: "16:45", title: "The end-of-day catch-up", context: "Daily review · Close the open loops", quote: "What did I commit to today, what still needs my approval, and what should I pick up tomorrow?", memory: "A practical handover of captured commitments, pending approvals and upcoming priorities.", tasks: [
    { role: "Executive Assistant", action: "Prepare your daily brief", detail: "Commitments and reminders grouped by priority" },
    { role: "Operations Coordinator", action: "Surface outstanding approvals", detail: "Decisions that need you, with their context" },
    { role: "Knowledge Assistant", action: "Make the detail easy to find", detail: "Ask a question and return to the source conversation" },
  ] },
];

export function OmiBookingLink({ placement, children = "Book an integration call", className = "" }: { placement: string; children?: React.ReactNode; className?: string }) {
  return <a className={`${styles.button} ${className}`} href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => {
    trackEvent("omi_integration_booking_click", { placement, destination: SITE.bookingUrl });
    trackMetaCustom("OmiIntegrationBookingClick", { placement });
  }}>{children}<ArrowUpRight size={18} aria-hidden="true" /></a>;
}

export function DayExplorer() {
  const [selected, setSelected] = useState(0);
  const moment = moments[selected];
  return <div className={styles.explorer}>
    <div className={styles.momentList} aria-label="Choose a workflow example">
      {moments.map((item, i) => <button key={item.time} type="button" aria-pressed={selected === i} aria-controls="omi-workflow-preview" className={selected === i ? styles.momentActive : ""} onClick={() => setSelected(i)}>
        <span>{item.time}</span><strong>{item.title}</strong><ChevronRight size={17} aria-hidden="true" />
      </button>)}
      <p>One day. Connected context.<br />A workforce ready for the next step.</p>
    </div>
    <div id="omi-workflow-preview" className={styles.preview} aria-live="polite" aria-atomic="true">
      <div className={styles.previewTop}><span><AudioLines size={16} aria-hidden="true" /> {moment.context}</span><span>Illustrative workflow</span></div>
      <blockquote>“{moment.quote}”</blockquote>
      <div className={styles.memory}><span><Workflow size={18} aria-hidden="true" /> XoomAgent™ understands the context</span><p>{moment.memory}</p></div>
      <div className={styles.taskList}>{moment.tasks.map(task => <div key={task.role} className={styles.task}><span className={styles.taskCheck}><Check size={16} aria-hidden="true" /></span><div><small>{task.role}</small><h3>{task.action}</h3><p>{task.detail}</p></div></div>)}</div>
      <p className={styles.previewNote}>Planned experience. Actions depend on your connected systems, configured roles and approval rules.</p>
    </div>
  </div>;
}

export function ProductFilm() {
  const [playing, setPlaying] = useState(false);
  if (playing) return <video className={styles.productVideo} controls autoPlay muted playsInline preload="metadata" poster="/images/omi/omi-hero.webp" aria-label="Omi pendant product film">
    <source src="/images/omi/omi-film.mp4" type="video/mp4" />Your browser does not support video. <a href="https://www.omi.me/">See Omi’s product film.</a>
  </video>;
  return <button type="button" className={styles.filmButton} onClick={() => setPlaying(true)}><Play size={15} aria-hidden="true" fill="currentColor" /> See the wearable</button>;
}
