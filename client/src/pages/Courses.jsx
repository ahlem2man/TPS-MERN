import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await api.get(`/courses?${params}`);
      setCourses(response.data.courses);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      console.error('Erreur chargement cours:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Retour à la première page
    fetchCourses();
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Liste des Cours</h1>
      
      {/* Barre de recherche */}
      <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Rechercher un cours..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            marginRight: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />
        <button type="submit">Rechercher</button>
      </form>
      
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          {/* Liste des cours */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {courses.map(course => (
              <div key={course._id} style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <h3>{course.title}</h3>
                <p>{course.description?.substring(0, 100)}...</p>
                <p><strong>Instructeur:</strong> {course.instructor}</p>
                <p><strong>Étudiants:</strong> {course.students?.length || 0}</p>
                <Link to={`/courses/${course._id}`}>Voir détails</Link>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    backgroundColor: currentPage === i + 1 ? '#3498db' : 'white',
                    color: currentPage === i + 1 ? 'white' : 'black'
                  }}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Courses;