"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus = "idle" | "requesting" | "recording" | "denied" | "unsupported" | "error";
export type Recording = { blob: Blob; url: string };

/**
 * Microphone recording with MediaRecorder. The mic is released after each take,
 * so the browser's recording indicator doesn't stay on. Recordings stay in memory.
 */
export function useRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [recording, setRecording] = useState<Recording | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const timer = useRef(0);
  const mounted = useRef(true);

  // Revoke the previous take's object URL when it is replaced or the page closes.
  useEffect(() => () => {
    if (recording) URL.revokeObjectURL(recording.url);
  }, [recording]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      window.clearTimeout(timer.current);
      if (recorder.current?.state === "recording") recorder.current.stop();
    };
  }, []);

  const start = useCallback(async (maxMs: number) => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch (e) {
      const denied = e instanceof DOMException && (e.name === "NotAllowedError" || e.name === "SecurityError");
      if (mounted.current) setStatus(denied ? "denied" : "error");
      return;
    }
    // Permission granted after the learner left the page: release the mic instead of recording.
    if (!mounted.current) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    const r = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    r.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    r.onstop = () => {
      window.clearTimeout(timer.current);
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: r.mimeType || "audio/webm" });
      setRecording({ blob, url: URL.createObjectURL(blob) });
      setStatus("idle");
    };
    recorder.current = r;
    r.start();
    setStatus("recording");
    timer.current = window.setTimeout(() => r.state === "recording" && r.stop(), maxMs);
  }, []);

  const stop = useCallback(() => {
    if (recorder.current?.state === "recording") recorder.current.stop();
  }, []);

  const reset = useCallback(() => setRecording(null), []);

  return { status, recording, start, stop, reset };
}
