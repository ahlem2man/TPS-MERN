import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(username, email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d'inscription ❌");
    }
  };

  return (
    <div style={container}>

      <div style={card}>
        <h2 style={{textAlign:"center",marginBottom:20}}>Créer un compte ✨</h2>

        {error && <div style={errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>

          <div style={field}>
            <label>Nom d’utilisateur</label>
            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} required style={input}/>
          </div>

          <div style={field}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required style={input}/>
          </div>

          <div style={field}>
            <label>Mot de passe</label>
            <input type="password" value={password} minLength={6}
              onChange={(e)=>setPassword(e.target.value)} required style={input}/>
            <small style={{opacity:.6}}>Min 6 caractères</small>
          </div>

          <button type="submit" style={btn}>Créer mon compte 🚀</button>
        </form>

        <p style={{marginTop:15,textAlign:"center"}}>
          Déjà inscrit ? <Link to="/login" style={link}>Connecte-toi</Link>
        </p>
      </div>
    </div>
  );
}

/* =================== STYLES =================== */
const container={
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  minHeight:"100vh",
  background:"linear-gradient(135deg,#4facfe,#00f2fe)"
};

const card={
  width:380,
  background:"#fff",
  padding:"35px 30px",
  borderRadius:12,
  boxShadow:"0 6px 18px rgba(0,0,0,.12)"
};

const field={marginBottom:18,display:"flex",flexDirection:"column",fontSize:14};
const input={padding:10,borderRadius:6,border:"1px solid #ccc",marginTop:5,fontSize:15};

const btn={
  width:"100%",padding:"12px 0",
  background:"#2ecc71",border:"none",
  borderRadius:6,color:"#fff",cursor:"pointer",fontSize:16,
  transition:"0.2s"
};

const errorBox={background:"#fee",color:"#c33",padding:10,borderRadius:6,marginBottom:15,textAlign:"center"};
const link={color:"#2980b9",textDecoration:"none",fontWeight:"bold"};
