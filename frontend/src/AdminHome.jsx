import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div style={{minHeight:"100vh", background:"#0b0c1a", color:"#fff", padding:"40px", textAlign:"center"}}>
      <h1 style={{fontSize:32}}>🏠 Espace Admin</h1>
      <p>Bienvenue dans l’espace d’administration de RestaurantApp.</p>

      <div style={{marginTop:24, display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap"}}>
        <Link to="/servers" style={btn}>👥 Gérer les serveurs</Link>
        <Link to="/admin/tables" style={btn}>🍽️ Gérer les tables</Link>
        <Link to="/admin/menu" style={btn}>📋 Gérer le menu</Link>
        <Link to="/orders" style={btn}>🧾 Prendre une commande</Link>
      </div>

      <div style={{marginTop:30}}>
        <button
          onClick={()=>{
            fetch("http://localhost/RestaurantApp/backend/api/auth/logout.php",{credentials:"include"});
            window.location.href="/";
          }}
          style={{...btn, background:"#ef4444"}}
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  );
}
const btn = {
  background:"#2563eb", color:"#fff", padding:"12px 16px",
  borderRadius:"10px", textDecoration:"none", display:"inline-block"
};
