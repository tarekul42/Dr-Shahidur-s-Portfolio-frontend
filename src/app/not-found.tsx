"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function MedicalScanIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-radial from-brand-primary/5 to-transparent overflow-hidden group">
      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(47,160,132,0.03),rgba(87,143,202,0.02),rgba(111,207,151,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-40" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(47,160,132,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,160,132,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* HUD Radar ring */}
      <div className="absolute w-72 h-72 rounded-full border border-brand-primary/10 flex items-center justify-center animate-[spin_25s_linear_infinite]">
        <div className="w-64 h-64 rounded-full border border-dashed border-brand-primary/20" />
        <div className="absolute w-2 h-2 bg-brand-primary rounded-full top-0" />
        <div className="absolute w-1.5 h-1.5 bg-brand-secondary rounded-full bottom-8 right-8" />
      </div>

      {/* Holographic Spine / Bone SVG Outline */}
      <svg
        className="w-44 h-44 text-brand-primary/80 drop-shadow-[0_0_15px_rgba(47,160,132,0.5)] z-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>Orthopedic Medical Scan</title>
        <path d="M12 2v20M8 5h8M7 8h10M6 11h12M7 14h10M8 17h8M9 20h6" />
        <path d="M12 5c-3 0-5 1.5-5 3s2 3 5 3M12 5c3 0 5 1.5 5 3s-2 3-5 3" />
        <path d="M12 8c-4 0-6 2-6 4.5s2 4.5 5 4.5M12 8c4 0 6 2 6 4.5s-2 4.5-5 4.5" />
        <path d="M12 11c-5 0-7 2.5-7 5.5s2 5.5 7 5.5M12 11c5 0 7 2.5 7 5.5s-2 5.5-7 5.5" />
        <circle
          cx="12"
          cy="5"
          r="1.2"
          className="fill-brand-accent animate-pulse"
        />
        <circle
          cx="12"
          cy="11"
          r="1.2"
          className="fill-brand-accent animate-pulse"
        />
        <circle
          cx="12"
          cy="17"
          r="1.2"
          className="fill-brand-accent animate-pulse"
        />
      </svg>

      {/* Moving scanning beam */}
      <div className="absolute left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-brand-primary to-transparent shadow-[0_0_15px_rgba(47,160,132,0.8)] z-10 animate-[scan_3.5s_ease-in-out_infinite]" />

      {/* Telemetry text */}
      <div className="absolute top-6 left-6 font-mono text-[9px] text-brand-primary/50 space-y-1">
        <div>SYS.LOC: /PAGE_NOT_FOUND</div>
        <div>SYS.ERR: 404_NOT_FOUND</div>
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[9px] text-brand-primary/50 text-right space-y-1">
        <div>SCAN STATUS: ACTIVE</div>
        <div>RESOLVING METRIC...</div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; opacity: 0.3; }
          50% { top: 90%; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-center px-6 py-20 relative overflow-hidden gap-12 container mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full space-y-10 z-10"
      >
        <div className="space-y-4">
          <div className="text-7xl md:text-8xl font-black text-brand-primary">
            404
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-heading-light dark:text-text-heading-dark">
            This page has been relocated
          </h1>
          <p className="text-text-para-light dark:text-text-para-dark leading-relaxed">
            The page you’re looking for doesn’t exist or may have been moved.
            Try searching for it or return to the homepage.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            type="text"
            placeholder="Search articles, research, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button href="/" size="lg" className="w-full sm:w-auto">
            Go Home
          </Button>
          <Link
            href="/contact"
            className="text-sm font-bold uppercase tracking-widest text-brand-primary hover:text-brand-hover transition-colors"
          >
            Contact the clinic
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:w-1/2 max-w-lg aspect-square lg:aspect-4/5 rounded-4xl overflow-hidden bg-bg-light dark:bg-bg-dark shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(47,160,132,0.15)] relative z-10"
      >
        <MedicalScanIllustration />
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute inset-0 -z-10"
      >
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-40 h-40 rounded-full bg-brand-primary/10 blur-2xl"
        />
        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -8, 0] }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-16 right-10 w-56 h-56 rounded-full bg-brand-secondary/10 blur-2xl"
        />
      </motion.div>
    </div>
  );
}
