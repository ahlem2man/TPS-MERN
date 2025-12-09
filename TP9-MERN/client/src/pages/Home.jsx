export default function Home() {
  return (
    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      flexDirection:"column",
      background:"linear-gradient(135deg,#4facfe,#00f2fe)",
      color:"#fff",
      textAlign:"center"
    }}>
      <h1 style={{ fontSize:"3.5rem", fontWeight:"bold", marginBottom:"15px" }}>
        Welcome to EduPlatform 🎓
      </h1>

      <p style={{ fontSize:"1.3rem", width:"60%", lineHeight:"1.5" }}>
        Une plateforme d’apprentissage moderne.
        Explore des cours, crée des reviews, rejoins des formations et améliore tes compétences.
      </p>
    </div>
  );
}
