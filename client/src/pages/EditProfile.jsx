import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bio: '',
    website: '',
    avatar: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        website: user.website || '',
        avatar: user.avatar || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer les messages d'erreur/succès quand l'utilisateur modifie
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put(`/profiles/${user.id}`, formData);
      
      // Mettre à jour l'utilisateur dans le contexte
      setUser(response.data.user);
      
      setSuccess('Profil mis à jour avec succès !');
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Chargement de votre profil...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px' }}>Modifier mon profil</h1>
        <p style={{ color: '#7f8c8d' }}>
          Mettez à jour vos informations personnelles
        </p>
      </div>

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

      {success && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#dfd',
          color: '#2c3e50',
          borderRadius: '5px'
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            maxLength="500"
            placeholder="Parlez-nous un peu de vous..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <div style={{ 
            textAlign: 'right', 
            fontSize: '14px', 
            color: '#95a5a6',
            marginTop: '5px'
          }}>
            {formData.bio.length}/500 caractères
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Site web
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
          <div style={{ 
            fontSize: '14px', 
            color: '#95a5a6',
            marginTop: '5px'
          }}>
            URL de votre site personnel, portfolio, etc.
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Avatar (URL)
          </label>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
          <div style={{ 
            fontSize: '14px', 
            color: '#95a5a6',
            marginTop: '5px'
          }}>
            Lien vers votre image de profil
          </div>
          
          {formData.avatar && (
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <div style={{ 
                fontSize: '14px', 
                color: '#7f8c8d',
                marginBottom: '8px'
              }}>
                Aperçu :
              </div>
              <img 
                src={formData.avatar} 
                alt="Aperçu avatar"
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #ecf0f1'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '15px',
          paddingTop: '20px',
          borderTop: '1px solid #ecf0f1'
        }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '12px 30px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/profile')}
            style={{
              padding: '12px 30px',
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

      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>
          Informations de compte
        </h3>
        <div style={{ lineHeight: '1.8' }}>
          <div>
            <strong>Nom d'utilisateur :</strong> {user.username}
          </div>
          <div>
            <strong>Email :</strong> {user.email}
          </div>
          <div>
            <strong>Date d'inscription :</strong> {new Date(user.createdAt).toLocaleDateString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;