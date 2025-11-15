import { useSelector } from "react-redux";

export default function Header() {
  const favorites = useSelector((state) => state.favorites);

  return (
    <header className="header">
      <h1> Movies — Redux</h1>
      <div className="likes-badge">{favorites.length} favoris</div>
    </header>
  );
}
