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
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Utilisateur non identifié");
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // 🔹 Utilisation de la nouvelle route PUT /profiles
      const response = await api.put(`/profiles`, formData);

      // Mettre à jour le user dans le contexte
      setUser(prev => ({ ...prev, ...response.data.profile, ...response.data.user }));

      setSuccess('Profil mis à jour avec succès !');

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

  if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Chargement de votre profil...</p>;

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Modifier mon profil</h1>
      {error && <div style={{ background: '#fee', color: '#c33', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>{error}</div>}
      {success && <div style={{ background: '#dfd', color: '#2c3e50', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '25px' }}>
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            maxLength="500"
            placeholder="Parlez-nous un peu de vous..."
            style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          <div style={{ fontSize: '14px', color: '#95a5a6', textAlign: 'right' }}>{formData.bio.length}/500 caractères</div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label>Site web</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label>Avatar (URL)</label>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
            style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
          {formData.avatar && (
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <img
                src={formData.avatar}
                alt="Aperçu avatar"
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ecf0f1' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px', paddingTop: '20px', borderTop: '1px solid #ecf0f1' }}>
          <button type="submit" disabled={saving} style={{ padding: '12px 30px', backgroundColor: '#3498db', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button type="button" onClick={() => navigate('/profile')} style={{ padding: '12px 30px', backgroundColor: '#95a5a6', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
