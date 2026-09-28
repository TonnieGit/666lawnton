"use client";

import { useEffect, useRef, useState } from "react";

// Minimal slice of the YouTube IFrame API we use.
interface YTPlayer {
  mute(): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: number; target: YTPlayer }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi() {
  apiPromise ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT!);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
}

/**
 * Muted background loop of a YouTube clip, [start, end) seconds. The server
 * renders the poster underneath; this fades the video in once it is actually
 * playing. Loads only after the page has loaded (keeps LCP on the poster),
 * never for reduced motion or Save-Data, and pauses while off screen.
 */
export function HeroVideo({ videoId, start = 0, end }: { videoId: string; start?: number; end: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData || !mountRef.current || !wrapRef.current) return;

    let player: YTPlayer | null = null;
    let ready = false;
    let visible = true;
    let cancelled = false;
    let timer: number | undefined;

    const sync = () => {
      if (!player || !ready) return;
      if (visible && !document.hidden) player.playVideo();
      else player.pauseVideo();
    };

    const init = async () => {
      const YT = await loadYouTubeApi();
      if (cancelled || !mountRef.current) return;
      player = new YT.Player(mountRef.current, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, playsinline: 1, rel: 0, start, end },
        events: {
          onReady: (e) => {
            ready = true;
            e.target.mute();
            sync();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(start, true);
              e.target.playVideo();
            }
          },
        },
      });
      // `end` stops playback; jump back just before it so the loop has no pause.
      timer = window.setInterval(() => {
        if (player && ready && player.getCurrentTime() >= end - 0.3) player.seekTo(start, true);
      }, 250);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(wrapRef.current);
    document.addEventListener("visibilitychange", sync);

    // Wait for the page (and its LCP poster) to finish loading first.
    const begin = () => ("requestIdleCallback" in window ? requestIdleCallback(() => init()) : setTimeout(init, 200));
    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin, { once: true });

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("load", begin);
      player?.destroy();
    };
  }, [videoId, start, end]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`hero-media-box pointer-events-none transition-opacity duration-1000 [&_iframe]:size-full ${playing ? "opacity-100" : "opacity-0"}`}
    >
      {/* The API replaces this node with the player iframe; React never re-renders it. */}
      <div ref={mountRef} />
    </div>
  );
}
