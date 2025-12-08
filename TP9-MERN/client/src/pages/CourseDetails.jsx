import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    fetchCourseAndReviews();
  }, [id]);

  // ================= GET COURSE + REVIEWS ===================
  const fetchCourseAndReviews = async () => {
    setLoading(true);
    try {
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data.course);
    } catch {
      alert("Cours introuvable");
      setCourse(null);
    }

    try {
      const reviewsRes = await api.get(`/courses/${id}/reviews`);
      setReviews(reviewsRes.data.reviews || []);
    } catch {
      setReviews([]);
    }

    setLoading(false);
  };

  // ================= ENROLL ===================
  const handleEnroll = async () => {
    if (!isAuthenticated) return navigate("/login");

    try {
      await api.post(
        `/courses/${id}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } } // ← token ajouté
      );
      alert("Inscription réussie 🎉");
      fetchCourseAndReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur inscription");
    }
  };

  // ================= POST REVIEW ===================
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");

    if (!reviewForm.comment.trim()) {
      alert("Merci d'écrire quelque chose !");
      return;
    }

    setIsSubmittingReview(true);

    try {
      await api.post(
        `/courses/${id}/reviews`,
        {
          rating: reviewForm.rating,
          comment: reviewForm.comment
        },
        { headers: { Authorization: `Bearer ${user.token}` } } // ← token ajouté
      );

      fetchCourseAndReviews();
      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);
      alert("Review ajoutée ✔");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur ajout review");
    }

    setIsSubmittingReview(false);
  };

  if (loading || !course) return <h2 style={{textAlign:"center",marginTop:50}}>Chargement...</h2>;

  const alreadyReviewed = reviews.some(r => r.user?._id === user?._id);

  return (
    <div style={{ padding: "30px", maxWidth: "850px", margin: "auto" }}>
      <h1>{course.title}</h1>
      <p style={{fontSize:18,opacity:.7}}>{course.description}</p>

      <div style={{marginTop:25, padding:20, background:"#f8f8f8", borderRadius:10}}>
        <p><b>Instructeur:</b> {course.instructor}</p>
        <p><b>Étudiants inscrits:</b> {course.students?.length || 0}</p>
      </div>

      <button 
        onClick={handleEnroll}
        style={{
          marginTop:20,padding:"15px 35px",
          background:"#27ae60",color:"#fff",
          border:"none",borderRadius:6,cursor:"pointer"
        }}>
        📘 S'inscrire au cours
      </button>

      <h2 style={{marginTop:45}}>Avis des étudiants</h2>

      {reviews.length === 0 ? <p>Aucun avis pour le moment...</p> :
        reviews.map(r => (
          <div key={r._id} style={{padding:15,marginTop:15,border:"1px solid #ddd",borderRadius:8}}>
            <div style={{color:"#f1c40f"}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
            <p>{r.comment}</p>
            <span style={{fontSize:13,opacity:.6}}>
              {r.user?.username} — {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))
      }

      {/* ========== Ajouter review si inscrit ET pas déjà évalué ========== */}
      {isAuthenticated && !alreadyReviewed && (
        <div style={{marginTop:40}}>
          {!showReviewForm ? (
            <button 
              onClick={() => setShowReviewForm(true)}
              style={{padding:12,background:"#2ecc71",color:"#fff",borderRadius:6}}>
              ✍ Laisser un avis
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} style={{marginTop:30}}>
              <label>Note:</label><br/>
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button"
                  onClick={() => setReviewForm({...reviewForm,rating:s})}
                  style={{
                    fontSize:30,
                    color: s<=reviewForm.rating ? "#f1c40f" : "#ccc",
                    background:"none",border:"none",cursor:"pointer"
                }}>★</button>
              ))}

              <textarea 
                rows="4" required
                placeholder="Votre avis..."
                value={reviewForm.comment}
                onChange={(e)=>setReviewForm({...reviewForm,comment:e.target.value})}
                style={{width:"100%",padding:10,marginTop:15}}
              />

              <button disabled={isSubmittingReview}
                style={{
                  marginTop:15,padding:"10px 25px",
                  background:"#3498db",color:"#fff",borderRadius:6
                }}>
                {isSubmittingReview ? "Envoi..." : "Publier"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseDetails;
