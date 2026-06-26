import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { HiSpeakerWave } from "react-icons/hi2";
import type { BackingTrack } from "./BackingTrackModal";
import "./FloatingPlayer.scss";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Props {
  track: BackingTrack;
  onClose: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

const FloatingPlayer = ({ track, onClose }: Props) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [volume, setVolume] = useState(80);
  const [speed, setSpeed] = useState(1);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const mountId = useRef(`yt-player-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const id = mountId.current;

    const initPlayer = () => {
      playerRef.current = new window.YT.Player(id, {
        videoId: track.youtubeId,
        playerVars: { autoplay: 1, modestbranding: 1 },
        events: {
          onReady: (e: any) => e.target.setVolume(80),
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.();
        initPlayer();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [track.youtubeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    playerRef.current?.setVolume?.(vol);
  };

  const handleSpeedChange = (s: number) => {
    setSpeed(s);
    playerRef.current?.setPlaybackRate?.(s);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDragging(true);

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const onUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const posStyle = pos
    ? { top: pos.y, left: pos.x, bottom: "auto", right: "auto" }
    : undefined;

  return (
    <div
      ref={containerRef}
      className={`floating-player${dragging ? " floating-player--dragging" : ""}`}
      style={posStyle}
    >
      <div className="floating-player__header" onMouseDown={handleDragStart}>
        <span className="floating-player__title">{track.title}</span>
        <button className="floating-player__close" onClick={onClose} aria-label="Close player">
          <IoClose size={16} />
        </button>
      </div>
      <div className="floating-player__embed">
        <div id={mountId.current} className="floating-player__yt-target" />
        {dragging && <div className="floating-player__drag-shield" />}
      </div>
      <div className="floating-player__controls">
        <div className="floating-player__volume">
          <HiSpeakerWave size={14} className="floating-player__vol-icon" />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>
        <div className="floating-player__speed">
          {SPEEDS.map((s) => (
            <button
              key={s}
              className={`floating-player__speed-btn${speed === s ? " floating-player__speed-btn--active" : ""}`}
              onClick={() => handleSpeedChange(s)}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingPlayer;
