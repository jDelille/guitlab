import { useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RiMenuLine } from "react-icons/ri";
import SearchMenu from "./SearchMenu";
import "./BottomNav.scss";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

const BottomNav = ({ isOpen, onToggle }: Props) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const openSearch = () => setSearchOpen(true);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <>
      <div className="bottom-nav">
        <div
          className={`bottom-nav__search${searchOpen ? " bottom-nav__search--open" : ""}`}
          onClick={!searchOpen ? openSearch : undefined}
        >
          <IoSearchOutline size={15} />
          {searchOpen ? (
            <input
              ref={inputRef}
              className="bottom-nav__search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={closeSearch}
              onKeyDown={(e) => e.key === "Escape" && closeSearch()}
              placeholder="Search scales..."
              autoFocus
            />
          ) : (
            <span>Search</span>
          )}
        </div>
        <button
          className={`bottom-nav__menu-btn${isOpen ? " bottom-nav__menu-btn--open" : ""}`}
          onClick={onToggle}
          aria-label="Toggle menu"
        >
          <RiMenuLine size={18} />
        </button>
      </div>

      {searchOpen && <SearchMenu query={query} onClose={closeSearch} />}
    </>
  );
};

export default BottomNav;
