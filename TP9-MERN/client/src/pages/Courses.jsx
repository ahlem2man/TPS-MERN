import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';


function Courses() {
const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(true);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [searchTerm, setSearchTerm] = useState('');


useEffect(() => { fetchCourses(); }, [currentPage, searchTerm]);


const fetchCourses = async () => {
setLoading(true);
try {
const params = new URLSearchParams({ page: currentPage, limit: 10, ...(searchTerm && { search: searchTerm }) });
const res = await api.get(`/courses?${params.toString()}`);
setCourses(res.data.courses || []);
setTotalPages(res.data.pagination?.totalPages || res.data.totalPages || 1);
} catch (err) {
console.error('Erreur chargement cours:', err);
} finally { setLoading(false); }
};


return (
<div style={{ padding: 30 }}>
<h1>Liste des Cours</h1>
{loading ? <div>Chargement...</div> : (
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
{courses.map(c => (
<div key={c._id} style={{ padding: 20, background: 'white', borderRadius: 8 }}>
<h3>{c.title}</h3>
<p>{c.description?.slice(0,100)}...</p>
<p><strong>Étudiants:</strong> {c.students?.length || 0}</p>
<Link to={`/courses/${c._id}`}>Voir détails</Link>
</div>
))}
</div>
)}
</div>
);
}


export default Courses;