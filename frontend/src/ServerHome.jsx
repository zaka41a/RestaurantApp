import { Link } from "react-router-dom";

export default function ServerHome(){
  return (
    <div style={{minHeight:"100vh", background:"#0b0c1a", color:"#eaeaff", display:"grid", placeItems:"center"}}>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:30, marginBottom:8}}>👨‍🍳 Espace Serveur</h1>
        <p>Actions rapides :</p>
        <div style={{display:"flex", gap:14, justifyContent:"center", marginTop:16, flexWrap:"wrap"}}>
          <Link to="/server/orders" style={btn}>🧾 Nouvelle commande</Link>
          <Link to="/server/tables" style={btn}>🍽️ Tables</Link>
          <Link to="/server/menu" style={btn}>📋 Voir le menu</Link>
        </div>
        <div style={{marginTop:24}}>
          <button onClick={()=>{
              fetch("http://localhost/RestaurantApp/backend/api/auth/logout.php",{credentials:"include"});
              location.href="/";
            }}
            style={{...btn, background:"#ef4444"}}>
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
const btn={background:"#22d3ee", color:"#0b0c1a", padding:"10px 14px", borderRadius:10, textDecoration:"none", fontWeight:700};
