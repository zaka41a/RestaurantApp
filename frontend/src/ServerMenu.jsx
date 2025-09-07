// src/ServerMenu.jsx
import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";

const API = "http://localhost/RestaurantApp/backend/api";
const IMG_BASE = "http://localhost/RestaurantApp/backend/";

export default function ServerMenu(){
  const [items,setItems]=useState([]);

  useEffect(()=>{
    fetch(`${API}/menu.php`,{credentials:"include"})
      .then(r=>r.json()).then(setItems).catch(()=>setItems([]));
  },[]);

  async function logout(){
    await fetch(`${API}/auth/logout.php`,{credentials:"include"});
    location.href="/";
  }

  return (
    <div style={{minHeight:"100vh", background:"#0b0c1a", color:"#eaeaff"}}>
      <TopBar title="Menu (Serveur)" onLogout={logout} backTo="/server" />
      <main style={{maxWidth:1000, margin:"0 auto", padding:24}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px,1fr))", gap:16}}>
          {items.map(m=>(
            <div key={m.id} style={{background:"#141529", border:"1px solid #ffffff25", borderRadius:12, overflow:"hidden"}}>
              {m.image_path
                ? <img src={`${IMG_BASE}${m.image_path}`} alt={m.name} style={{width:"100%", height:150, objectFit:"cover"}}/>
                : <div style={{height:150, display:"grid", placeItems:"center", color:"#94a3b8"}}>—</div>}
              <div style={{padding:12}}>
                <div style={{opacity:.7, fontSize:12, marginBottom:4}}>{m.category}</div>
                <div style={{fontWeight:700}}>{m.name}</div>
                <div style={{opacity:.8, marginTop:4, fontSize:13}}>
                  {m.description || <span style={{opacity:.6}}>Aucune description</span>}
                </div>
                <div style={{marginTop:8, fontWeight:700}}>{(+m.price).toFixed(2)} €</div>
              </div>
            </div>
          ))}
          {items.length===0 && <div style={{opacity:.7}}>Aucun plat.</div>}
        </div>
      </main>
    </div>
  );
}
