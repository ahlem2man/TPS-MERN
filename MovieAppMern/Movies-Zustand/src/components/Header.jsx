import { useMoviesStore } from "../zustand/useMoviesStore";

export default function Header() {
  const favorites = useMoviesStore((state) => state.favorites);

  return (
    <header className="header">
      <h1> Movies — Zustand</h1>
      <div className="likes-badge">{favorites.length} favoris</div>
    </header>
  );
}
