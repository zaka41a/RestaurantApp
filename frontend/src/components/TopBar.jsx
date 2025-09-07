// src/components/TopBar.jsx
import { useNavigate } from "react-router-dom";

export default function TopBar({ title, onLogout, right, backTo }) {
  const nav = useNavigate();
  return (
    <header style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background:"#0f1224", borderBottom:"1px solid #ffffff22", padding:"10px 14px", color:"#eaeaff"
    }}>
      <div style={{display:"flex", gap:10, alignItems:"center"}}>
        <button
          onClick={()=> backTo ? nav(backTo) : nav(-1)}
          style={{background:"#1f2937", border:"1px solid #ffffff33", color:"#eaeaff",
          padding:"6px 10px", borderRadius:8}}
        >
          ← Retour
        </button>
        <h1 style={{fontSize:20, margin:0}}>{title}</h1>
      </div>
      <div style={{display:"flex", alignItems:"center", gap:10}}>
        {right}
        <button onClick={onLogout}
          style={{background:"#ef4444", border:"none", color:"#fff", padding:"8px 12px", borderRadius:8}}>
          Déconnexion
        </button>
      </div>
    </header>
  );
}
