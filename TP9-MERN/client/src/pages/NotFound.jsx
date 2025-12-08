import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        fontSize: '120px', 
        color: '#e74c3c',
        margin: '0',
        fontWeight: 'bold'
      }}>
        404
      </h1>
      <h2 style={{ 
        color: '#2c3e50',
        margin: '20px 0'
      }}>
        Page non trouvée
      </h2>
      <p style={{ 
        color: '#7f8c8d',
        fontSize: '18px',
        lineHeight: '1.6',
        marginBottom: '40px'
      }}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <Link 
          to="/"
          style={{
            padding: '12px 30px',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          ← Retour à l'accueil
        </Link>
        <Link 
          to="/courses"
          style={{
            padding: '12px 30px',
            backgroundColor: '#2ecc71',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Parcourir les cours
        </Link>
      </div>
    </div>
  );
}

export default NotFound;