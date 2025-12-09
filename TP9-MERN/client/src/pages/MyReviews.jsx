import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function MyReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => { if(user) load(); }, [user]);

  async function load() {
    try {
      setLoading(true);
      const r = await api.get(`/reviews/users/${user.id}/reviews`);
      setReviews(r.data.reviews || []);
      setMsg('');
    } catch {
      setMsg("⚠ Impossible de charger vos avis.");
    } finally { setLoading(false); }
  }

  // =============== SUPPRIMER UN AVIS ===============
  async function deleteReview(id) {
    if(!window.confirm("Supprimer cet avis ?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
    } catch {
      alert("Erreur suppression ❌");
    }
  }

  if (loading)
    return <h2 style={{textAlign:"center",marginTop:50}}>Chargement...</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>⭐ Mes Avis</h1>

      {msg && <div style={styles.alert}>{msg}</div>}

      {/* Aucun avis */}
      {reviews.length === 0 && (
        <div style={styles.emptyBox}>
          <p>Aucun avis pour le moment.</p>
          <Link to="/courses" style={styles.btnExplore}>Explorer les cours 📘</Link>
        </div>
      )}

      {/* LISTE DES AVIS */}
      <div style={styles.list}>
        {reviews.map((r,i)=>(
          <div key={r._id} style={{...styles.card, animationDelay: `${i*0.15}s`}}>
            
            <Link to={`/courses/${r.course._id}`} style={styles.courseTitle}>
              {r.course.title}
            </Link>
            <span style={styles.teacher}>{r.course.instructor}</span>

            <div style={styles.stars}>
              {"★".repeat(r.rating)}
              <span style={styles.note}>({r.rating}/5)</span>
            </div>

            <p style={styles.comment}>{r.comment}</p>

            <div style={styles.footer}>
              <small>{new Date(r.createdAt).toLocaleDateString("fr-FR")}</small>

              <div style={{display:"flex",gap:"8px"}}>
                <button style={styles.deleteBtn} onClick={()=>deleteReview(r._id)}>🗑 Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ========== STYLES ========== */

const styles = {
  container:{maxWidth:900,margin:"auto",padding:30},
  pageTitle:{fontSize:32,fontWeight:700,color:"#2c3e50"},

  list:{marginTop:30,display:"flex",flexDirection:"column",gap:20},

  card:{
    background:"#fff",padding:20,borderRadius:10,
    borderLeft:"5px solid #3498db",
    boxShadow:"0 3px 8px rgba(0,0,0,0.08)",
    animation:"fadeIn .5s ease forwards",opacity:0
  },

  courseTitle:{fontSize:22,fontWeight:"bold",textDecoration:"none",color:"#2d3436"},
  teacher:{color:"#7f8c8d",display:"block",marginBottom:10},

  stars:{color:"#F1C40F",fontSize:22,margin:"10px 0"},
  note:{fontSize:15,marginLeft:5,color:"#34495e"},

  comment:{fontSize:16,lineHeight:1.5,color:"#2c3e50",marginTop:8},

  footer:{display:"flex",justifyContent:"space-between",marginTop:15,borderTop:"1px solid #eee",paddingTop:8},

  deleteBtn:{background:"#e74c3c",border:"none",padding:"6px 12px",borderRadius:5,color:"#fff",cursor:"pointer"},
  editBtn:{background:"#2980b9",border:"none",padding:"6px 12px",borderRadius:5,color:"#fff",cursor:"pointer"},

  emptyBox:{marginTop:40,textAlign:"center",background:"#f4f4f4",padding:40,borderRadius:8},
  btnExplore:{marginTop:15,display:"inline-block",padding:"10px 20px",background:"#3498db",color:"#fff",borderRadius:6,textDecoration:"none"},

  alert:{background:"#ffeaea",padding:15,color:"#b33",borderRadius:6,marginTop:15}
};


/* Animation simple */
const css = `
@keyframes fadeIn {from {opacity:0;transform:translateY(8px);} to {opacity:1;transform:none;}}
`;
document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
