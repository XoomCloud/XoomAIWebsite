"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";

/** Sticky bottom CTA — appears after the hero, hidden near the form to avoid overlap. */
export function StickyCta() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const form = document.getElementById("book");
      const nearForm = form ? form.getBoundingClientRect().top < window.innerHeight + 120 : false;
      setShow(y > 700 && !nearForm);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[#06070b]/90 px-4 py-3 backdrop-blur-xl lg:hidden"
        >
          <a
            href="#book"
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6d3bf5] to-[#0891b2] py-3.5 text-base font-semibold text-white"
          >
            <CalendarCheck className="size-5" aria-hidden /> Book Free Strategy Session
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
