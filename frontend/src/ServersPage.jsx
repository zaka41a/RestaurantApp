import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "./components/TopBar";

export default function ServersPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ full_name:"", email:"", phone:"", password:"" });
  const [loading, setLoading] = useState(false);

  async function logout(){
    await fetch("http://localhost/RestaurantApp/backend/api/auth/logout.php",{credentials:"include"});
    location.href="/";
  }
  async function load(){ const r=await fetch("http://localhost/RestaurantApp/backend/api/admin/servers.php",{credentials:"include"}); setList(await r.json()); }
  useEffect(()=>{ load(); },[]);

  async function addServer(e){
    e.preventDefault(); setLoading(true);
    const r=await fetch("http://localhost/RestaurantApp/backend/api/admin/servers.php",{
      method:"POST", credentials:"include", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form)
    });
    setLoading(false);
    if(r.ok){ setForm({full_name:"",email:"",phone:"",password:""}); load(); }
    else { const err=await r.json().catch(()=>({})); alert(err.error||"Erreur"); }
  }
  async function remove(id){
    if(!confirm("Supprimer ce serveur ?")) return;
    const r=await fetch(`http://localhost/RestaurantApp/backend/api/admin/servers.php?id=${id}`,{method:"DELETE",credentials:"include"});
    if(r.ok) load();
  }

  const toTablesBtn = (
    <Link to="/admin/tables" style={{background:"#2563eb", color:"#fff", borderRadius:8, padding:"8px 12px", textDecoration:"none"}}>
      Voir les tables
    </Link>
  );

  return (
    <div style={{minHeight:"100vh", background:"#0b0c1a", color:"#eaeaff"}}>
<TopBar title="Gestion des serveurs" onLogout={logout} backTo="/admin" />
      <div style={{maxWidth:900, margin:"0 auto", padding:"28px 16px"}}>
        <form onSubmit={addServer}
          style={{display:"grid", gap:10, background:"#141529", borderRadius:12, padding:16, border:"1px solid #ffffff22"}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
            <input required placeholder="Nom complet" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} style={input}/>
            <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} style={input}/>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
            <input placeholder="Téléphone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} style={input}/>
            <input placeholder="Mot de passe (défaut: server123)" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} style={input}/>
          </div>
          <button disabled={loading} style={{background:"#10b981", color:"#0b0c1a", padding:"10px 16px", borderRadius:10, border:0, fontWeight:700}}>
            {loading ? "Ajout..." : "Ajouter un serveur"}
          </button>
        </form>

        <div style={{marginTop:18, overflowX:"auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead><tr style={{color:"#9aa0ff"}}><th style={th}>ID</th><th style={th}>Nom</th><th style={th}>Email</th><th style={th}>Téléphone</th><th style={th}>Créé</th><th style={th}></th></tr></thead>
            <tbody>
              {list.map(s=>(
                <tr key={s.id} style={{borderTop:"1px solid #ffffff22"}}>
                  <td style={td}>{s.id}</td><td style={td}>{s.full_name}</td><td style={td}>{s.email}</td><td style={td}>{s.phone||"-"}</td>
                  <td style={td}>{s.created_at?.slice(0,19).replace("T"," ")}</td>
                  <td style={td}><button onClick={()=>remove(s.id)} style={{background:"#ef4444", color:"#fff", border:0, borderRadius:8, padding:"6px 10px"}}>Supprimer</button></td>
                </tr>
              ))}
              {list.length===0 && <tr><td style={td} colSpan={6}>Aucun serveur pour le moment.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
const input={background:"#0e1022", border:"1px solid #ffffff22", color:"#eaeaff", padding:"10px 12px", borderRadius:10};
const th={textAlign:"left", padding:"10px 8px"}; const td={padding:"10px 8px"};
