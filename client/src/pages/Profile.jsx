import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Profile() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${user.id}/courses`)
      .then(res => {
        setEnrolledCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user.id]);

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Mon Profil</h1>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <p><strong>Nom d’utilisateur :</strong> {user.username}</p>
        <p><strong>Email :</strong> {user.email}</p>
      </div>

      <h2 style={{ marginTop: '40px' }}>Mes Cours</h2>

      {loading ? (
        <div>Chargement...</div>
      ) : enrolledCourses.length === 0 ? (
        <p style={{ color: '#999' }}>Vous n’êtes inscrit à aucun cours</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {enrolledCourses.map(course => (
            <div key={course._id} style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}>
              <h4>{course.title}</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>{course.instructor}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
