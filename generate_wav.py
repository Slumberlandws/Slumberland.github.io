#!/usr/bin/env python3
"""
Generate a pleasant looping background music WAV for the PttLB site.

The melody matches the Web Audio version that was used before:
  - C major pentatonic notes
  - 3 groups of 8 notes per phrase (start steps 0, 8, 4)
  - each note: sine fundamental + soft triangle octave, with a pluck envelope
  - soft bass on even beats
Two phrases are rendered so the loop sounds natural.
"""
import math
import wave
import os

SAMPLE_RATE = 44100
NOTES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]
PATTERN = [0, 2, 4, 2, 3, 1, 4, 2, 0, 3, 5, 3]
BEAT = 0.36
PHRASES = 2
TAIL = 0.8  # seconds of decay tail at the end


def render():
    total_beats = PHRASES * 3 * 8 * BEAT + TAIL
    n = int(total_beats * SAMPLE_RATE)
    buf = [0.0] * n

    def add(freq, start_t, dur, amp, octave_amp):
        start = int(start_t * SAMPLE_RATE)
        length = int(dur * SAMPLE_RATE)
        for i in range(length):
            idx = start + i
            if idx >= n:
                break
            t = i / SAMPLE_RATE
            # attack + exponential-ish decay envelope
            if t < 0.02:
                env = t / 0.02
            else:
                env = math.exp(-3.0 * (t - 0.02) / dur)
            env = min(1.0, env)
            if idx % 1 == 0:
                # sine fundamental
                buf[idx] += amp * env * math.sin(2 * math.pi * freq * t)
                # soft triangle octave
                buf[idx] += octave_amp * env * _tri(2 * freq, t)

    def _tri(freq, t):
        phase = (t * freq) % 1.0
        return 4.0 * abs(phase - 0.5) - 1.0

    # schedule the melody groups (start steps 0, 8, 4 repeated)
    step = 0
    t = 0.0
    for group in range(PHRASES * 3):
        for i in range(8):
            idx = (step + i) % len(PATTERN)
            note = NOTES[PATTERN[idx]]
            add(note, t + i * BEAT, BEAT * 1.8, 0.32, 0.10)
            if i % 2 == 0:
                add(NOTES[0] / 2, t + i * BEAT, BEAT * 3, 0.18, 0.0)
        step = (step + 8) % len(PATTERN)
        t += 8 * BEAT

    # normalize a little
    peak = max(1e-9, max(abs(v) for v in buf))
    scale = 0.7 / peak
    buf = [max(-1.0, min(1.0, v * scale)) for v in buf]

    out_dir = os.path.join("assets", "audio")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "background.wav")
    with wave.open(out_path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SAMPLE_RATE)
        frames = b"".join(
            int(v * 32767).to_bytes(2, "little", signed=True) for v in buf
        )
        w.writeframes(frames)
    print(f"Wrote {out_path}  ({len(buf)/SAMPLE_RATE:.2f}s, {len(frames)} bytes)")


if __name__ == "__main__":
    render()
