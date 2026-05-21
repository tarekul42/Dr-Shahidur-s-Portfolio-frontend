"use client";

import { useState } from "react";

export const WhatsAppButton = ({ phone }: { phone?: string }) => {
  const [tooltip, setTooltip] = useState(false);
  const normalized = (phone || "+880123456789").replace(/\D/g, "");
  const href = `https://wa.me/${normalized}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip — CSS transition */}
      <div
        className={`absolute bottom-16 right-0 rounded-2xl bg-white dark:bg-card-dark border border-border-light dark:border-border-dark shadow-2xl px-4 py-3 text-sm text-text-heading-light dark:text-text-heading-dark whitespace-nowrap transition-all duration-200 pointer-events-none ${
          tooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        Chat with us on WhatsApp
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="w-14 h-14 rounded-full bg-[#25D366] shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <span className="sr-only">Chat on WhatsApp</span>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.973 11.973 0 0 0 12 0C5.373 0 0 5.373 0 12c0 2.113.56 4.081 1.526 5.78L0 24l6.41-1.684A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.18-3.48-8.52Zm-8.476 16.439a9.22 9.22 0 0 1-4.962-1.413l-.355-.215-3.8.998.998-3.712-.23-.381A9.219 9.219 0 1 1 12.044 19.92Zm5.082-6.567c-.279-.138-1.646-.812-1.9-.904-.255-.093-.441-.138-.627.138-.186.276-.72.904-.883 1.089-.162.186-.324.207-.603.069-.279-.138-1.177-.433-2.242-1.381-.829-.738-1.389-1.65-1.55-1.926-.162-.276-.017-.425.12-.563.123-.124.279-.324.419-.486.14-.162.186-.276.279-.459.093-.186.046-.345-.023-.483-.069-.138-.627-1.514-.858-2.076-.226-.548-.456-.474-.627-.483l-.536-.01c-.186 0-.486.069-.74.345-.255.276-.972.95-.972 2.313 0 1.364.994 2.688 1.132 2.873.138.186 1.96 2.994 4.75 4.2.664.286 1.18.456 1.584.584.666.213 1.272.183 1.75.111.534-.08 1.646-.672 1.878-1.323.232-.65.232-1.208.162-1.323-.069-.112-.255-.176-.534-.314Z" />
        </svg>
      </a>
    </div>
  );
};
