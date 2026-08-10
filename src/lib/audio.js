let audioCtx = null;
function tone(freq, start, dur, type, vol) {
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, audioCtx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + dur);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(audioCtx.currentTime + start);
  o.stop(audioCtx.currentTime + start + dur);
}
export function feedback(ok, soundOn) {
  if (soundOn) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
      if (ok) { tone(660, 0, 0.09, "sine", 0.12); tone(880, 0.09, 0.14, "sine", 0.12); }
      else { tone(180, 0, 0.22, "square", 0.08); }
    } catch { /* sin soporte de audio */ }
  }
  if (navigator.vibrate) navigator.vibrate(ok ? 25 : [90, 50, 90]);
}
