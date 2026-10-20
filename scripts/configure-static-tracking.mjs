import { writeFileSync } from 'node:fs';
const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-T3NZH8T5H7';
if (!/^G-[A-Z0-9]+$/.test(gaId)) throw new Error('Invalid NEXT_PUBLIC_GA_ID');
writeFileSync(new URL('../public/xoomtalent/tracking-config.js', import.meta.url),
  'window.XOOM_TRACKING_CONFIG = Object.freeze(' + JSON.stringify({ gaId }) + ');\n');
