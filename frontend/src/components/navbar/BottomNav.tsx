import { useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { RiMenuLine } from "react-icons/ri";
import { useSettings } from "../../context/SettingsContext";
import PlaybackSheet from "./PlaybackSheet";
import BackingTrackModal, {
  type BackingTrack,
} from "../controls/play-scale/BackingTrackModal";
import FloatingPlayer from "../controls/play-scale/FloatingPlayer";
import "./BottomNav.scss";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

const BottomNav = ({ isOpen, onToggle }: Props) => {
  const [playbackOpen, setPlaybackOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<BackingTrack | null>(null);
  const { settings } = useSettings();

  const handleMenuToggle = () => {
    setPlaybackOpen(false);
    onToggle();
  };

  const handleOpenBackingTrack = () => {
    setPlaybackOpen(false);
    setModalOpen(true);
  };

  return (
    <>
      <div className="bottom-nav">
        <button
          className={`bottom-nav__play-btn${settings.playScale ? " bottom-nav__play-btn--active" : ""}`}
          onClick={() => setPlaybackOpen(true)}
          aria-label="Playback controls"
        >
          {settings.playScale ? <FaStop size={13} /> : <FaPlay size={13} />}
          <span>{settings.playScale ? "Playing" : "Play"}</span>
        </button>
        <button
          className={`bottom-nav__menu-btn${isOpen ? " bottom-nav__menu-btn--open" : ""}`}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <RiMenuLine size={18} />
        </button>
      </div>

      {playbackOpen && (
        <PlaybackSheet
          onClose={() => setPlaybackOpen(false)}
          onOpenBackingTrack={handleOpenBackingTrack}
          activeTrack={activeTrack}
        />
      )}

      {modalOpen && (
        <BackingTrackModal
          onClose={() => setModalOpen(false)}
          onPlay={(track) => setActiveTrack(track)}
          activeTrackId={activeTrack?.id ?? null}
        />
      )}

      {activeTrack && (
        <FloatingPlayer track={activeTrack} onClose={() => setActiveTrack(null)} />
      )}
    </>
  );
};

export default BottomNav;
