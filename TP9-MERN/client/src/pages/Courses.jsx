import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchCourses(); }, [currentPage, searchTerm]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 6,
        ...(searchTerm && { search: searchTerm })
      });

      const res = await api.get(`/courses?${params.toString()}`);
      setCourses(res.data.courses || []);
      setTotalPages(res.data.pagination?.totalPages || 1);

    } catch (err) {
      console.error("Erreur chargement cours:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>📚 Tous les Cours</h1>

      {/* 🔍 Barre recherche */}
      <input 
        type="text"
        placeholder="Rechercher un cours..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.search}
      />

      {loading ? (
        <p style={styles.loading}>Chargement des cours...</p>
      ) : (
        <div style={styles.grid}>
          {courses.length > 0 ? courses.map(course => (
            <div key={course._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{course.title}</h3>
              <p style={styles.desc}>{course.description?.slice(0, 120)}...</p>
              <p style={{ color:"#555", marginBottom:10 }}>
                👥 {course.students?.length || 0} inscrits
              </p>
              <Link to={`/courses/${course._id}`} style={styles.btn}>
                Voir le cours →
              </Link>
            </div>
          )) : <h3>Aucun cours trouvé 😕</h3>}
        </div>
      )}

      {/* 📌 Pagination */}
      <div style={styles.pagination}>
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(currentPage - 1)}
          style={styles.pageBtn}
        >← Précédent</button>

        <span style={{ margin:"0 15px" }}>
          Page <strong>{currentPage}</strong> sur {totalPages}
        </span>

        <button 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(currentPage + 1)}
          style={styles.pageBtn}
        >Suivant →</button>
      </div>

    </div>
  );
}



/* ==================== 🎨 CSS Inline ==================== */
const styles = {
  container:{
    padding:"40px 60px",
    fontFamily:"Arial"
  },
  title:{
    fontSize:"2.4rem",
    marginBottom:20,
    color:"#2c3e50",
    fontWeight:"bold"
  },
  search:{
    width:"60%",
    padding:"10px 15px",
    borderRadius:"6px",
    border:"1px solid #ccc",
    marginBottom:"25px",
    fontSize:"1rem"
  },
  grid:{
    display:"grid",
    gap:"25px",
    gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))"
  },
  card:{
    background:"#fff",
    padding:"20px",
    borderRadius:"10px",
    boxShadow:"0 4px 12px rgba(0,0,0,0.08)",
    transition:"0.3s",
  },
  cardTitle:{
    margin:0,
    fontSize:"1.3rem",
    fontWeight:"bold",
    color:"#34495e"
  },
  desc:{
    color:"#555",
    margin:"10px 0"
  },
  btn:{
    display:"inline-block",
    padding:"8px 14px",
    background:"#2980b9",
    borderRadius:"5px",
    color:"white",
    textDecoration:"none",
    fontSize:"0.9rem"
  },
  loading:{
    textAlign:"center",
    fontSize:"1.3rem"
  },
  pagination:{
    marginTop:30,
    textAlign:"center"
  },
  pageBtn:{
    padding:"8px 16px",
    border:"none",
    background:"#005C9A",
    color:"#fff",
    borderRadius:"5px",
    cursor:"pointer"
  }
};
