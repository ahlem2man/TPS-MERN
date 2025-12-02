import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function MyReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyReviews();
    }
  }, [user]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/users/${user.id}/reviews`);
      setReviews(response.data.reviews);
      setError('');
    } catch (err) {
      console.error('Erreur chargement reviews:', err);
      setError('Impossible de charger vos reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Supprimer cette review ?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        setReviews(reviews.filter(review => review._id !== reviewId));
      } catch (err) {
        console.error('Erreur suppression:', err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Chargement de vos reviews...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Mes Reviews</h1>
      
      {error && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}

      {reviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          marginTop: '20px'
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Vous n'avez pas encore laissé de reviews.
          </p>
          <Link 
            to="/courses"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px'
            }}
          >
            Parcourir les cours
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '30px' }}>
          <p style={{ marginBottom: '20px' }}>
            Vous avez laissé {reviews.length} review{reviews.length > 1 ? 's' : ''}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reviews.map(review => (
              <div 
                key={review._id}
                style={{
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  borderLeft: '4px solid #3498db'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 10px 0' }}>
                      <Link 
                        to={`/courses/${review.course._id}`}
                        style={{ color: '#2c3e50', textDecoration: 'none' }}
                      >
                        {review.course.title}
                      </Link>
                    </h3>
                    <p style={{ color: '#7f8c8d', marginBottom: '15px' }}>
                      {review.course.instructor}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  color: '#f39c12', 
                  fontSize: '20px',
                  marginBottom: '10px'
                }}>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                  <span style={{ 
                    fontSize: '16px', 
                    color: '#7f8c8d',
                    marginLeft: '10px'
                  }}>
                    ({review.rating}/5)
                  </span>
                </div>
                
                <p style={{ 
                  margin: '10px 0',
                  lineHeight: '1.6',
                  color: '#34495e'
                }}>
                  {review.comment}
                </p>
                
                <div style={{ 
                  fontSize: '14px', 
                  color: '#95a5a6',
                  borderTop: '1px solid #ecf0f1',
                  paddingTop: '10px',
                  marginTop: '15px'
                }}>
                  Posté le {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyReviews;