import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";

const API = "http://localhost/RestaurantApp/backend/api";
const IMG_BASE = "http://localhost/RestaurantApp/backend/";

export default function MenuPage(){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({category_id:1, name:"", price:"", image_path:"", description:""});
  const [file,setFile] = useState(null);

  async function load(){
    const r=await fetch(`${API}/menu.php`,{credentials:"include"});
    setItems(await r.json());
  }
  useEffect(()=>{load();},[]);

  async function add(e){
    e.preventDefault();

    if (file) {
      const fd = new FormData();
      fd.append("category_id", form.category_id);
      fd.append("name", form.name);
      fd.append("price", form.price);
      fd.append("description", form.description);
      fd.append("image", file);

      const r = await fetch(`${API}/menu.php`, { method:"POST", credentials:"include", body: fd });
      const data = await r.json().catch(()=>({}));
      if(!r.ok) return alert(data.error || "Upload échoué");
    } else {
      const r=await fetch(`${API}/menu.php`,{
        method:"POST", credentials:"include",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(form)
      });
      const data = await r.json().catch(()=>({}));
      if(!r.ok){ return alert(data.error||"Erreur"); }
    }

    setForm({category_id:1, name:"", price:"", image_path:"", description:""});
    setFile(null);
    await load();
  }

  async function del(id){
    if(!confirm("Supprimer ce plat ?")) return;
    const r=await fetch(`${API}/menu.php?id=${id}`,{method:"DELETE", credentials:"include"});
    if(r.ok) load();
  }

  async function logout(){
    await fetch(`${API}/auth/logout.php`,{credentials:"include"});
    location.href="/";
  }

  return (
    <div style={{minHeight:"100vh", background:"#0b0c1a", color:"#eaeaff"}}>
      <TopBar title="Gestion du menu" onLogout={logout} />
      <main style={{maxWidth:1100, margin:"0 auto", padding:24}}>
        <form onSubmit={add} style={{display:"grid", gap:10, background:"#141529",
          border:"1px solid #ffffff25", padding:16, borderRadius:14}}>
          <div style={{display:"grid", gridTemplateColumns:"220px 1fr 1fr 1fr", gap:10}}>
            <select value={form.category_id} onChange={e=>setForm({...form, category_id:+e.target.value})} style={input}>
              <option value={1}>Entrées</option>
              <option value={2}>Pizzas</option>
              <option value={3}>Burgers</option>
              <option value={4}>Pâtes</option>
              <option value={5}>Salades</option>
              <option value={6}>Desserts</option>
              <option value={7}>Boissons</option>
            </select>
            <input placeholder="Nom" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={input}/>
            <input placeholder="Prix" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} style={input}/>
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} style={input}/>
          </div>
          <textarea placeholder="Description (facultatif)" value={form.description}
            onChange={e=>setForm({...form, description:e.target.value})}
            style={{...input, minHeight:90}} />
          <button style={{background:"#10b981", color:"#0b0c1a", border:0, borderRadius:10, padding:"10px 16px", fontWeight:700}}>
            Ajouter
          </button>
        </form>

        <div style={{marginTop:18, overflowX:"auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead>
              <tr><th style={th}>#</th><th style={th}>Image</th><th style={th}>Cat.</th><th style={th}>Nom</th><th style={th}>Prix</th><th style={th}></th></tr>
            </thead>
            <tbody>
              {items.map(i=>(
                <tr key={i.id} style={{borderTop:"1px solid #ffffff22"}}>
                  <td style={td}>{i.id}</td>
                  <td style={td}>
                    {i.image_path
                      ? <img src={`${IMG_BASE}${i.image_path}`} alt={i.name} width={48} height={48}
                             style={{objectFit:"cover", borderRadius:8, border:"1px solid #ffffff22"}}/>
                      : "—"}
                  </td>
                  <td style={td}>{i.category}</td>
                  <td style={td}>{i.name}</td>
                  <td style={td}>{(+i.price).toFixed(2)} €</td>
                  <td style={td}>
                    <button onClick={()=>del(i.id)} style={{background:"#ef4444", color:"#fff", border:0, borderRadius:8, padding:"6px 10px"}}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {items.length===0 && <tr><td style={td} colSpan={6}>Aucun plat.</td></tr>}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
const input = {background:"#0e1022", border:"1px solid #ffffff25", color:"#eaeaff", padding:"10px 12px", borderRadius:10};
const th = { textAlign:"left", padding:"10px 8px" };
const td = { padding:"10px 8px" };
