import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { supabase } from "../../../services/supabase";
import { useUser } from "../../../hooks/useUser";
import "./BackingTrackModal.scss";

export interface BackingTrack {
  id: string;
  title: string;
  youtubeId: string;
  isDefault?: boolean;
}

const DEFAULT_TRACKS: BackingTrack[] = [
  {
    id: "default-1",
    title: "Little Wing - Jimi Hendrix (E minor)",
    youtubeId: "kM1L94WAqhE",
    isDefault: true,
  },
  {
    id: "default-2",
    title: "Fire on the Mountain - Grateful Dead (B Mixolydian)",
    youtubeId: "MBZ8Msw80ow",
    isDefault: true,
  },
];

const STORAGE_KEY = "guitlab_backing_tracks";

function loadLocal(): BackingTrack[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal(tracks: BackingTrack[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
}

function parseEmbed(raw: string): { youtubeId: string; title: string } | null {
  const srcMatch = raw.match(/\/embed\/([a-zA-Z0-9_-]+)/);
  const titleMatch = raw.match(/title="([^"]+)"/);
  if (!srcMatch) return null;
  return {
    youtubeId: srcMatch[1],
    title: titleMatch?.[1] ?? "Backing Track",
  };
}

interface Props {
  onClose: () => void;
  onPlay: (track: BackingTrack) => void;
  activeTrackId: string | null;
}

const BackingTrackModal = ({ onClose, onPlay, activeTrackId }: Props) => {
  const { user } = useUser();
  const [savedTracks, setSavedTracks] = useState<BackingTrack[]>(loadLocal);
  const [embedInput, setEmbedInput] = useState("");
  const [parseError, setParseError] = useState("");

  // If logged in, sync from DB (DB is source of truth for authenticated users)
  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_backing_tracks")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          const tracks = data.map((row) => ({
            id: row.id,
            title: row.title,
            youtubeId: row.youtube_id,
          }));
          setSavedTracks(tracks);
          saveLocal(tracks);
        }
      });
  }, [user]);

  const handleAdd = async () => {
    const parsed = parseEmbed(embedInput);
    if (!parsed) {
      setParseError("Couldn't parse embed code. Make sure you copied the full <iframe> from YouTube.");
      return;
    }

    let newTrack: BackingTrack;

    if (user) {
      const { data, error } = await supabase
        .from("user_backing_tracks")
        .insert({ title: parsed.title, youtube_id: parsed.youtubeId, user_id: user.id })
        .select()
        .single();
      if (error || !data) return;
      newTrack = { id: data.id, title: data.title, youtubeId: data.youtube_id };
    } else {
      newTrack = { id: crypto.randomUUID(), youtubeId: parsed.youtubeId, title: parsed.title };
    }

    setSavedTracks((prev) => {
      const updated = [newTrack, ...prev];
      saveLocal(updated);
      return updated;
    });
    setEmbedInput("");
    setParseError("");
    onPlay(newTrack);
    onClose();
  };

  const handleDelete = async (id: string) => {
    setSavedTracks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveLocal(updated);
      return updated;
    });
    if (user) {
      await supabase.from("user_backing_tracks").delete().eq("id", id);
    }
  };

  return (
    <div className="bt-modal-overlay" onClick={onClose}>
      <div className="bt-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bt-modal__header">
          <span className="bt-modal__title">Backing Tracks</span>
          <button className="bt-modal__close" onClick={onClose}>
            <IoClose size={18} />
          </button>
        </div>

        <div className="bt-modal__add">
          <span className="bt-modal__section-label">Add a track</span>
          <p className="bt-modal__hint">
            On YouTube, click Share → Embed, then copy the full &lt;iframe&gt; code and paste it below.
            {!user && " Sign in to sync your tracks across devices."}
          </p>
          <div className="bt-modal__input-row">
            <textarea
              className="bt-modal__textarea"
              placeholder='<iframe ... src="https://www.youtube.com/embed/..." ...></iframe>'
              value={embedInput}
              onChange={(e) => { setEmbedInput(e.target.value); setParseError(""); }}
              rows={3}
            />
            <button className="bt-modal__add-btn" onClick={handleAdd} disabled={!embedInput.trim()}>
              Add
            </button>
          </div>
          {parseError && <span className="bt-modal__error">{parseError}</span>}
        </div>

        <div className="bt-modal__list">
          {savedTracks.length > 0 && (
            <>
              <span className="bt-modal__section-label">Your tracks</span>
              {savedTracks.map((track) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  active={activeTrackId === track.id}
                  onPlay={() => { onPlay(track); onClose(); }}
                  onDelete={() => handleDelete(track.id)}
                />
              ))}
            </>
          )}

          <span className="bt-modal__section-label">Default tracks</span>
          {DEFAULT_TRACKS.map((track) => (
            <TrackRow
              key={track.id}
              track={track}
              active={activeTrackId === track.id}
              onPlay={() => { onPlay(track); onClose(); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TrackRow = ({
  track,
  active,
  onPlay,
  onDelete,
}: {
  track: BackingTrack;
  active: boolean;
  onPlay: () => void;
  onDelete?: () => void;
}) => (
  <div className={`bt-track${active ? " bt-track--active" : ""}`}>
    <button className="bt-track__play" onClick={onPlay}>
      <FaPlay size={10} />
    </button>
    <span className="bt-track__title">{track.title}</span>
    {onDelete && (
      <button className="bt-track__delete" onClick={onDelete}>
        <MdDeleteOutline size={16} />
      </button>
    )}
  </div>
);

export default BackingTrackModal;
