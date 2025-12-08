import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Charger les cours de l'utilisateur
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?._id) return;

      try {
        const res = await api.get(`/users/${user._id}/courses`);
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Erreur récupération cours :", err);
      }
      setLoadingCourses(false);
    };

    fetchCourses();
  }, [user]);

  if (!user) return <h2 style={{ textAlign: "center" }}>Vous devez vous connecter</h2>;
  if (loadingCourses) return <h2 style={{ textAlign: "center" }}>Chargement des cours...</h2>;

  return (
    <div style={container}>
      {/* ==== Infos utilisateur ==== */}
      <div style={block}>
        <h2>Profil Utilisateur</h2>
        <p>
          <strong>Nom d’utilisateur :</strong> {user.username}
        </p>
        <p>
          <strong>Email :</strong> {user.email}
        </p>
        <button onClick={logout} style={dangerButton}>
          Se déconnecter
        </button>
      </div>

      {/* ==== Cours inscrits ==== */}
      <div style={block}>
        <h2>📚 Cours Inscrits</h2>
        {courses.length === 0 ? (
          <p>Aucun cours pour l’instant.</p>
        ) : (
          <ul>
            {courses.map((c) => (
              <li key={c._id} style={list}>
                <strong>{c.title}</strong>
                <br />
                <span>{c.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---- STYLES ---- */
const container = {
  width: "60%",
  margin: "40px auto",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
};

const block = {
  background: "#fff",
  padding: "25px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,.1)",
};

const list = {
  background: "#f8f8f8",
  padding: "10px",
  borderRadius: "5px",
  marginBottom: "10px",
};

const dangerButton = {
  background: "#d9534f",
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};
