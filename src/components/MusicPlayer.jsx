import { useRef, useState } from "react";
import { Music2, Pause, Play } from "lucide-react";

export default function MusicPlayer({
  isPlaying: externalIsPlaying,
  onToggle: externalOnToggle,
  visible = true,
  error: externalError = false
}) {
  const internalAudioRef = useRef(null);
  const [internalPlaying, setInternalPlaying] = useState(false);
  const [internalError, setInternalError] = useState(false);

  const isControlled = typeof externalOnToggle === "function";
  const playing = isControlled ? externalIsPlaying : internalPlaying;
  const hasError = isControlled ? externalError : internalError;

  const handleToggle = async () => {
    if (isControlled) {
      externalOnToggle();
      return;
    }
    const audio = internalAudioRef.current;
    if (!audio) return;
    if (internalPlaying) {
      audio.pause();
      setInternalPlaying(false);
    } else {
      try {
        await audio.play();
        setInternalPlaying(true);
        setInternalError(false);
      } catch {
        setInternalError(true);
        setInternalPlaying(false);
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
      {!isControlled && (
        <audio
          ref={internalAudioRef}
          src="/music/backsound.mp3"
          loop
          preload="auto"
          onEnded={() => setInternalPlaying(false)}
        />
      )}
      {hasError && (
        <span className="rounded-full bg-espresso px-3 py-2 text-xs text-ivory shadow-lg">
          Musik tidak dapat diputar
        </span>
      )}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={playing ? "Jeda musik latar" : "Putar musik latar"}
        className="music-button"
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
        <Music2 size={16} />
      </button>
    </div>
  );
}
