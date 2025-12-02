import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // États pour le formulaire de review
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ 
    rating: 5, 
    comment: '' 
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    // Charger le cours
    api.get(`/courses/${id}`)
      .then(res => setCourse(res.data.course))
      .catch(err => console.error(err));

    // Charger les reviews
    api.get(`/courses/${id}/reviews`)
      .then(res => {
        setReviews(res.data.reviews || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await api.post(`/courses/${id}/enroll`, {
        userId: user.id
      });
      alert('Inscription réussie !');
      // Recharger les détails du cours pour mettre à jour le compteur d'étudiants
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data.course);
    } catch (err) {
      alert('Erreur lors de l\'inscription: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!reviewForm.comment.trim()) {
      alert('Veuillez écrire un commentaire');
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      await api.post(`/courses/${id}/reviews`, reviewForm);
      
      // Recharger les reviews
      const res = await api.get(`/courses/${id}/reviews`);
      setReviews(res.data.reviews || []);
      
      // Réinitialiser le formulaire
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      alert('Review ajoutée avec succès !');
    } catch (err) {
      console.error('Erreur ajout review:', err);
      alert(err.response?.data?.message || 'Erreur lors de l\'ajout de la review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading || !course) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Chargement...
      </div>
    );
  }

  // Vérifier si l'utilisateur a déjà laissé une review
  const userHasReviewed = reviews.some(r => r.user?._id === user?.id);

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>{course.title}</h1>
      
      <p style={{ fontSize: '18px', color: '#666', marginTop: '15px' }}>
        {course.description}
      </p>
      
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
      }}>
        <p><strong>Instructeur :</strong> {course.instructor}</p>
        <p><strong>Étudiants inscrits :</strong> {course.students?.length || 0}</p>
      </div>

      <button
        onClick={handleEnroll}
        style={{
          marginTop: '20px',
          padding: '15px 30px',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        S'inscrire au cours
      </button>

      <h2 style={{ marginTop: '40px' }}>Avis des étudiants</h2>
      
      {reviews.length === 0 ? (
        <p style={{ color: '#999' }}>Aucun avis pour le moment</p>
      ) : (
        reviews.map(review => (
          <div key={review._id} style={{
            padding: '15px',
            marginTop: '15px',
            backgroundColor: 'white',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}>
            <div style={{ color: '#f39c12', fontSize: '20px' }}>
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </div>
            <p style={{ marginTop: '10px' }}>{review.comment}</p>
            <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
              Par {review.user?.username || 'Anonyme'} • {new Date(review.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        ))
      )}

      {/* Formulaire pour ajouter une review */}
      {isAuthenticated && !userHasReviewed && (
        <div style={{ marginTop: '40px' }}>
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✍️ Laisser un avis
            </button>
          ) : (
            <div style={{
              padding: '25px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginTop: '20px'
            }}>
              <h3>Laisser votre avis</h3>
              <form onSubmit={handleSubmitReview}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>
                    Note :
                  </label>
                  <div style={{ display: 'flex', gap: '5px', fontSize: '30px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: star <= reviewForm.rating ? '#f39c12' : '#ddd',
                          fontSize: '30px',
                          padding: '0'
                        }}
                      >
                        ★
                      </button>
                    ))}
                    <span style={{ 
                      marginLeft: '15px', 
                      fontSize: '16px',
                      lineHeight: '40px',
                      color: '#7f8c8d'
                    }}>
                      {reviewForm.rating}/5
                    </span>
                  </div>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>
                    Commentaire :
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    required
                    rows="4"
                    maxLength="500"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Partagez votre expérience avec ce cours..."
                  />
                  <div style={{ 
                    textAlign: 'right', 
                    fontSize: '14px', 
                    color: '#95a5a6',
                    marginTop: '5px'
                  }}>
                    {reviewForm.comment.length}/500 caractères
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#2ecc71',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      opacity: isSubmittingReview ? 0.7 : 1
                    }}
                  >
                    {isSubmittingReview ? 'Envoi en cours...' : 'Publier mon avis'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setReviewForm({ rating: 5, comment: '' });
                    }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CourseDetails;