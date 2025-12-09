import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, [id]);

  // ================= LOAD DATA =================
  async function fetchData() {
    setLoading(true);
    try {
      const c = await api.get(`/courses/${id}`);
      setCourse(c.data.course);

      const r = await api.get(`/courses/${id}/reviews`);
      setReviews(r.data.reviews || []);

    } catch {
      alert("Cours introuvable !");
      navigate("/courses");
    }
    setLoading(false);
  }

  // ================= ENROLL =================
  const enroll = async () => {
    if (!isAuthenticated) return navigate("/login");

    try {
      await api.post(`/courses/${id}/enroll`);
      alert("Inscription réussie 🎉");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  // ================= POST REVIEW =================
  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    if (!review.comment.trim()) return alert("Écris un avis !");

    setSending(true);

    try {
      await api.post(`/courses/${id}/reviews`, review);
      setReview({ rating: 5, comment:"" });
      setShowForm(false);
      fetchData();
      alert("Avis ajouté ✔");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'envoi");
    }
    setSending(false);
  };

  if (loading) return <h2 style={styles.center}>Chargement...</h2>;
  if (!course) return <h2 style={styles.center}>Cours introuvable</h2>;

  const alreadyRated = reviews.some(r => r.user?._id === user?._id);

  return (
    <div style={styles.container}>
      {/* 🔹 TITRE */}
      <h1 style={styles.title}>{course.title}</h1>
      <p style={styles.desc}>{course.description}</p>

      {/* 🔸 INFOS */}
      <div style={styles.infoBox}>
        <p><b>👨‍🏫 Instructeur :</b> {course.instructor}</p>
        <p><b>👥 Inscrits :</b> {course.students?.length || 0}</p>
        <p><b>⭐ Moyenne :</b> {reviews.length>0 ? (reviews.reduce((a,b)=>a+b.rating,0)/reviews.length).toFixed(1) : "—"}</p>
      </div>

      <button onClick={enroll} style={styles.enrollBtn}>📘 S'inscrire</button>

      {/* REVIEWS */}
      <h2 style={{marginTop:50}}>Avis des étudiants</h2>
      {reviews.length === 0 && <p>Aucun avis pour le moment.</p>}

      {reviews.map(r => (
        <div key={r._id} style={styles.reviewCard}>
          <div style={{color:"#FDCB2E",fontSize:20}}>
            {"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}
          </div>
          <p>{r.comment}</p>
          <span style={styles.author}>
            {r.user?.username} — {new Date(r.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}

      {/* FORMULAIRE D'AVIS */}
      {isAuthenticated && !alreadyRated && (
        <>
          {!showForm ? (
            <button onClick={()=>setShowForm(true)} style={styles.reviewBtn}>
              ✍ Rédiger un avis
            </button>
          ) : (
            <form onSubmit={submitReview} style={styles.form}>
              <label>Note :</label><br/>

              {[1,2,3,4,5].map(star => (
                <button key={star} type="button"
                  onClick={()=>setReview({...review,rating:star})}
                  style={{...styles.star, color: star<=review.rating ? "#FDCB2E":"#bbb"}}>
                  ★
                </button>
              ))}

              <textarea
                required rows="4"
                placeholder="Écris ton expérience..."
                value={review.comment}
                onChange={e=>setReview({...review,comment:e.target.value})}
                style={styles.textarea}
              />

              <button disabled={sending} style={styles.submitBtn}>
                {sending ? "Publication..." : "Publier"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

/* ======================= CSS INLINE ======================= */

const styles = {
  container:{ maxWidth:860, margin:"auto", padding:40, fontFamily:"Arial" },
  title:{ fontSize:32, fontWeight:"bold", color:"#2c3e50" },
  desc:{ opacity:.8, fontSize:17, marginBottom:25 },

  infoBox:{
    background:"#f3f3f3", padding:15, borderRadius:10, marginBottom:20
  },

  enrollBtn:{
    padding:"12px 30px", background:"#27ae60", color:"#fff",
    borderRadius:6, fontSize:16, cursor:"pointer"
  },

  reviewCard:{
    background:"#fff", marginTop:20, padding:15,
    borderRadius:10, border:"1px solid #ddd"
  },
  author:{ fontSize:13, opacity:.5 },

  reviewBtn:{
    marginTop:30, padding:"10px 18px", background:"#3498db",
    color:"#fff", borderRadius:6, cursor:"pointer"
  },

  form:{ marginTop:25 },
  star:{ fontSize:32, background:"none", border:"none", cursor:"pointer" },

  textarea:{
    width:"100%", marginTop:15, padding:10,
    borderRadius:8, border:"1px solid #bbb"
  },

  submitBtn:{
    marginTop:15, background:"#2ecc71", color:"white",
    padding:"10px 25px", borderRadius:6, cursor:"pointer"
  },

  center:{ textAlign:"center", marginTop:50 }
};
