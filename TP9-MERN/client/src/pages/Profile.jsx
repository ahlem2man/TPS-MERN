import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const r = await api.get(`/users/${user._id}/courses`);
        setCourses(r.data.courses || []);
      } catch(err){
        console.error("Erreur récupération cours:", err);
      }
      setLoadingCourses(false);
    }
    if(user) loadCourses();
  }, [user]);

  if (!user) return <h2 style={center}>Vous devez vous connecter 🔐</h2>;
  if (loadingCourses) return <h2 style={center}>Chargement...</h2>;

  return (
    <div style={container}>

      {/*===== CARD INFO USER =====*/}
      <div style={cardUser}>
        <img src="https://i.pravatar.cc/150?img=32" alt="avatar" style={avatar}/>
        <h2 style={{marginTop:10}}>{user.username} 👋</h2>
        <p style={email}>{user.email}</p>

        <div style={statsBox}>
          <div><b>{courses.length}</b><span>Cours inscrits</span></div>
          <div><b>{courses.length * 2}</b><span>Points XP</span></div>
          <div><b>✔</b><span>Membre actif</span></div>
        </div>

        <button onClick={logout} style={logoutBtn}>Se déconnecter</button>
      </div>

      {/*===== COURS INSCRITS =====*/}
      <div style={coursesCard}>
        <h2>📚 Mes Cours Suivis</h2>

        {courses.length === 0 && (
          <div style={empty}>
            <p>Tu n’es inscrit à aucun cours 😢</p>
            <Link to="/courses" style={btnBlue}>Explorer les cours</Link>
          </div>
        )}

        <div style={courseList}>
          {courses.map(c => (
            <div key={c._id} style={courseItem}>
              <h3>{c.title}</h3>
              <p>{c.description?.slice(0,120)}...</p>
              <Link to={`/courses/${c._id}`} style={courseBtn}>Voir cours →</Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


/* ====================== STYLES ====================== */

const container = {width:"85%",maxWidth:1100,margin:"40px auto",display:"flex",gap:30};

const cardUser = {
  flex:1,
  background:"#fff",
  padding:25,
  borderRadius:12,
  textAlign:"center",
  boxShadow:"0 4px 15px rgba(0,0,0,.08)"
};
const avatar = {width:120,height:120,borderRadius:"50%",objectFit:"cover",border:"3px solid #3498db"};
const email = {opacity:.7,marginBottom:15};

const statsBox = {
  display:"flex",
  justifyContent:"space-around",
  margin:"20px 0",
  fontSize:14
};

const logoutBtn={background:"#e74c3c",border:"none",color:"#fff",padding:"10px 20px",borderRadius:8,cursor:"pointer",marginTop:15};

const coursesCard={flex:2,background:"#fff",padding:25,borderRadius:12,boxShadow:"0 4px 12px rgba(0,0,0,.07)"};
const courseList={marginTop:20,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20};

const courseItem={background:"#f8f9fa",padding:18,borderRadius:8,borderLeft:"5px solid #3498db"};
const courseBtn={display:"inline-block",marginTop:10,color:"#fff",background:"#3498db",padding:"7px 14px",borderRadius:6,textDecoration:"none",fontSize:14};

const empty={background:"#f4f4f4",padding:45,textAlign:"center",borderRadius:8,marginTop:30};
const btnBlue={background:"#3498db",padding:"10px 20px",borderRadius:6,color:"#fff",textDecoration:"none"};

const center = {textAlign:"center",marginTop:50,fontSize:22};
