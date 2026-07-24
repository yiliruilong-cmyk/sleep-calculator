"use client";

import { useEffect, useRef, useState } from "react";

const musicLoopStartSeconds = 5;
const musicLoopEndPaddingSeconds = 1.2;
const musicVolume = 0.22;

export function AmbientAudio() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const ambientContextRef = useRef<AudioContext | null>(null);
  const isEnabledRef = useRef(false);
  const musicBufferRef = useRef<AudioBuffer | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const onLoginPage = window.location.pathname === "/login";

    setIsReady(true);
    setIsLoginPage(onLoginPage);
    setIsEnabled(onLoginPage);

    return () => {
      stopMusic();
      void ambientContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!isReady || !isLoginPage) return;

    isEnabledRef.current = isEnabled;

    if (isEnabled) {
      void startMusic();
      window.addEventListener("pointerdown", unlockAudio, { once: true });
      window.addEventListener("keydown", unlockAudio, { once: true });
    } else {
      stopMusic();
    }

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [isEnabled, isLoginPage, isReady]);

  function getAmbientContext() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return null;

    if (!ambientContextRef.current) {
      ambientContextRef.current = new AudioContextConstructor();
    }

    return ambientContextRef.current;
  }

  async function loadMusicBuffer(context: AudioContext) {
    if (musicBufferRef.current) return musicBufferRef.current;

    const response = await fetch("/ambient-main.mp4");
    const audioData = await response.arrayBuffer();
    const buffer = await context.decodeAudioData(audioData);
    musicBufferRef.current = buffer;
    return buffer;
  }

  function unlockAudio() {
    if (!isEnabledRef.current) return;
    void startMusic();
  }

  async function startMusic() {
    if (musicSourceRef.current) return;

    const context = getAmbientContext();
    if (!context) return;

    try {
      await context.resume();
      const buffer = await loadMusicBuffer(context);
      if (!isEnabledRef.current || musicSourceRef.current) return;

      const gain = musicGainRef.current || context.createGain();
      if (!musicGainRef.current) {
        gain.connect(context.destination);
        musicGainRef.current = gain;
      }
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(0.001, context.currentTime);
      gain.gain.linearRampToValueAtTime(musicVolume, context.currentTime + 1.4);

      const loopStart = Math.min(musicLoopStartSeconds, Math.max(buffer.duration - 1, 0));
      const loopEnd = Math.max(loopStart + 1, buffer.duration - musicLoopEndPaddingSeconds);

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = loopStart;
      source.loopEnd = loopEnd;
      source.connect(gain);
      source.start(0, loopStart);
      source.onended = () => {
        if (musicSourceRef.current === source) musicSourceRef.current = null;
      };
      musicSourceRef.current = source;
    } catch {
      // Browsers may block autoplay until the first user gesture.
    }
  }

  function stopMusic() {
    const source = musicSourceRef.current;
    if (!source) return;

    musicSourceRef.current = null;
    source.onended = null;
    try {
      source.stop();
    } catch {
      // The source may already be stopped by the browser.
    }
    source.disconnect();
  }

  if (!isReady || !isLoginPage) return null;

  return (
    <button
      type="button"
      onClick={() => setIsEnabled((current) => !current)}
      className="fixed bottom-4 right-4 z-[70] inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.22] bg-ink/[0.72] px-4 py-3 text-sm font-bold text-white shadow-lift backdrop-blur-md transition hover:bg-ink/[0.88] print:hidden"
      aria-pressed={isEnabled}
      aria-label={isEnabled ? "Turn sound off" : "Turn sound on"}
    >
      {isEnabled ? "Sound on" : "Sound off"}
    </button>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
