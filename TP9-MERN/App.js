import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import MyReviews from "./pages/MyReviews";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar>
        {/* Exemples de liens dans la navbar */}
        <ul style={{ display: "flex", gap: "20px", listStyle: "none" }}>
          <li>
            <Link to="/">Accueil</Link>
          </li>
          <li>
            <Link to="/courses">Cours</Link>
          </li>
          <li>
            <Link to="/my-reviews">Mes Reviews</Link>
          </li>
          <li>
            <Link to="/profile">Mon Profil</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </Navbar>

      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} /> {/* Détails d’un cours */}
        <Route path="/login" element={<Login />} />

        {/* Pages protégées */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-reviews"
          element={
            <ProtectedRoute>
              <MyReviews />
            </ProtectedRoute>
          }
        />

        {/* Page 404 par défaut */}
        <Route path="*" element={<div style={{ padding: "50px", textAlign: "center" }}>Page non trouvée</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
