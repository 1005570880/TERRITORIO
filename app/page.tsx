"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, ChevronDown, ChevronRight, CircleHelp, Download, Filter, LayoutDashboard, Map, MapPin, Menu, MoreHorizontal, Plus, Search, Settings2, ShieldCheck, Users, UserRound, X } from "lucide-react";

type Person = { name: string; role: "Líder" | "Participante"; sector: string; initials: string; color: string; status: string };
const people: Person[] = [
  { name: "María Fernanda Pérez", role: "Líder", sector: "San Luis", initials: "MP", color: "rose", status: "Activo" },
  { name: "Carlos Andrés Gómez", role: "Participante", sector: "La Palma", initials: "CG", color: "blue", status: "Activo" },
  { name: "Luisa Fernanda Díaz", role: "Líder", sector: "Centro", initials: "LD", color: "violet", status: "Activo" },
  { name: "Jorge Eliécer Martínez", role: "Participante", sector: "San Luis", initials: "JM", color: "amber", status: "Pendiente" },
  { name: "Andrea Carolina Ruiz", role: "Participante", sector: "La Palma", initials: "AR", color: "green", status: "Activo" },
];
const activities = [
  { title: "Jornada de limpieza comunitaria", place: "Parque San Luis", date: "Hoy, 8:30 a. m.", people: 28, type: "Comunidad", color: "green" },
  { title: "Encuentro de líderes territoriales", place: "Casa Comunal · La Palma", date: "Mañana, 4:00 p. m.", people: 16, type: "Reunión", color: "blue" },
  { title: "Mesa de participación ciudadana", place: "Salón múltiple · Centro", date: "Viernes, 9:00 a. m.", people: 42, type: "Participación", color: "violet" },
];
export default function Home() {
  const [section, setSection] = useState("Resumen");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [role, setRole] = useState<"Líder" | "Participante">("Líder");
  const [name, setName] = useState("");
  const [sector, setSector] = useState("San Luis");
  const [added, setAdded] = useState<Person[]>([]);
  const [notice, setNotice] = useState("");
  const allPeople = useMemo(() => [...added, ...people], [added]);
  const filtered = allPeople.filter(p => (p.name + p.sector + p.role).toLowerCase().includes(query.toLowerCase()));
  const nav = [{ label: "Resumen", icon: LayoutDashboard }, { label: "Personas", icon: Users }, { label: "Territorio", icon: Map }, { label: "Actividades", icon: CalendarDays }];
  function addPerson(e: React.FormEvent) { e.preventDefault(); if (!name.trim()) return; setAdded([{ name: name.trim(), role, sector, initials: name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase(), color: role === "Líder" ? "rose" : "blue", status: "Activo" }, ...added]); setName(""); setShowForm(false); setSection("Personas"); setNotice("Registro agregado a esta vista de demostración."); }
  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">T</div><div><strong>TERRITORIO</strong><span>GESTIÓN COMUNITARIA</span></div></div>
      <div className="workspace"><div className="workspace-icon">S</div><div><b>Mi organización</b><small>Espacio de trabajo</small></div><ChevronDown size={15}/></div>
      <div className="nav-label">MENÚ PRINCIPAL</div>
      <nav>{nav.map(item => <button key={item.label} onClick={()=>setSection(item.label)} className={section===item.label?"active":""}><item.icon size={18}/>{item.label}{item.label==="Personas"&&<span className="nav-count">{allPeople.length}</span>}</button>)}</nav>
      <div className="nav-label second">GESTIÓN</div><nav><button onClick={()=>setSection("Configuración")} className={section==="Configuración"?"active":""}><Settings2 size={18}/>Configuración</button></nav>
      <div className="sidebar-bottom"><div className="help"><CircleHelp size={17}/><div><b>¿Necesitas ayuda?</b><small>Consulta la guía de uso</small></div><ChevronRight size={15}/></div><div className="profile"><div className="avatar dark">JA</div><div><b>Administrador</b><small>Cuenta de organización</small></div><MoreHorizontal size={18}/></div></div>
    </aside>
    <section className="content">
      <header className="topbar"><div className="crumb"><span>Mi organización</span><ChevronRight size={14}/><b>{section}</b></div><div className="top-actions"><span className="secure"><ShieldCheck size={14}/> Espacio privado</span><button className="icon-button" aria-label="Notificaciones"><Bell size={18}/><i/></button><div className="avatar dark small">JA</div></div></header>
      <div className="page">
        <div className="welcome"><div><div className="eyebrow">MIÉRCOLES, 30 DE SEPTIEMBRE DE 2026</div><h1>{section==="Resumen"?"Buenos días, Administrador":section}</h1><p>{section==="Resumen"?"Aquí tienes un resumen de lo que sucede en tu territorio.":"Administra la información de tu organización en un solo lugar."}</p></div><button className="primary" onClick={()=>setShowForm(true)}><Plus size={17}/> Registrar persona</button></div>
        {notice&&<div className="notice">{notice}<button onClick={()=>setNotice("")}><X size={14}/></button></div>}
        {section==="Resumen"&&<>
          <div className="stats">
            <div className="stat"><div className="stat-top"><span>Personas registradas</span><span className="stat-icon purple"><Users size={18}/></span></div><strong>{allPeople.length+124}</strong><div className="stat-foot"><span className="trend"><ArrowUpRight size={14}/> 12.8%</span><span>vs. mes anterior</span></div></div>
            <div className="stat"><div className="stat-top"><span>Líderes comunitarios</span><span className="stat-icon pink"><UserRound size={18}/></span></div><strong>{allPeople.filter(p=>p.role==="Líder").length+18}</strong><div className="stat-foot"><span className="trend"><ArrowUpRight size={14}/> 4.2%</span><span>vs. mes anterior</span></div></div>
            <div className="stat"><div className="stat-top"><span>Sectores activos</span><span className="stat-icon blue"><MapPin size={18}/></span></div><strong>12</strong><div className="stat-foot"><span className="muted">En 3 comunas</span></div></div>
            <div className="stat"><div className="stat-top"><span>Actividades del mes</span><span className="stat-icon green"><Activity size={18}/></span></div><strong>08</strong><div className="stat-foot"><span className="trend"><ArrowUpRight size={14}/> 2 nuevas</span><span>esta semana</span></div></div>
          </div>
          <div className="grid-main"><div className="panel"><div className="panel-head"><div><h2>Personas por sector</h2><p>Distribución de registros en el territorio</p></div><button className="subtle">Este mes <ChevronDown size={14}/></button></div><div className="bars"><div className="bar-row"><span>San Luis</span><div className="bar-track"><i style={{width:"78%"}}/></div><b>386</b></div><div className="bar-row"><span>La Palma</span><div className="bar-track"><i style={{width:"62%"}}/></div><b>302</b></div><div className="bar-row"><span>Centro</span><div className="bar-track"><i style={{width:"48%"}}/></div><b>231</b></div><div className="bar-row"><span>El Progreso</span><div className="bar-track"><i style={{width:"32%"}}/></div><b>154</b></div><div className="bar-row"><span>Villa Nueva</span><div className="bar-track"><i style={{width:"21%"}}/></div><b>101</b></div></div><div className="panel-foot">Ver distribución completa <ChevronRight size={15}/></div></div>
          <div className="panel activity-panel"><div className="panel-head"><div><h2>Próximas actividades</h2><p>Agenda de tu organización</p></div><button className="dots"><MoreHorizontal size={18}/></button></div>{activities.map((a,i)=><div className="activity" key={a.title}><div className={"activity-date "+a.color}><b>{i===0?"30":i===1?"01":"02"}</b><small>{i===0?"SEP":"OCT"}</small></div><div className="activity-info"><b>{a.title}</b><small><MapPin size={12}/>{a.place}</small><small><Users size={12}/>{a.people} participantes</small></div></div>)}<button className="panel-foot full">Ver calendario <ChevronRight size={15}/></button></div></div>
          <div className="panel people-panel"><div className="panel-head"><div><h2>Personas recientes</h2><p>Últimos registros en tu organización</p></div><button className="text-button" onClick={()=>setSection("Personas")}>Ver todas <ChevronRight size={15}/></button></div><PeopleTable people={allPeople.slice(0,4)}/></div>
        </>}
        {section==="Personas"&&<div className="panel people-panel"><div className="panel-head"><div><h2>Directorio de personas</h2><p>Consulta y administra los registros de tu organización.</p></div><button className="primary" onClick={()=>setShowForm(true)}><Plus size={16}/> Nueva persona</button></div><div className="table-tools"><div className="search"><Search size={16}/><input placeholder="Buscar por nombre, sector o tipo..." value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="subtle"><Filter size={15}/> Filtrar</button><button className="subtle"><Download size={15}/> Exportar</button></div><PeopleTable people={filtered}/></div>}
        {section==="Territorio"&&<div className="panel map-panel"><div className="panel-head"><div><h2>Mapa territorial</h2><p>Visualiza los sectores y puntos de actividad registrados.</p></div><button className="subtle"><MapPin size={15}/> Sectores</button></div><div className="map-placeholder" style={{padding:0,overflow:"hidden",height:520}}><iframe title="Mapa real de Sincelejo - OpenStreetMap" src="https://www.openstreetmap.org/export/embed.html?bbox=-75.42%2C9.27%2C-75.35%2C9.33&layer=mapnik&marker=9.3047%2C-75.3978" style={{border:0,width:"100%",height:"100%",display:"block"}} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><div className="map-credit" style={{bottom:8,right:10,background:"rgba(255,255,255,.92)",padding:"5px 8px",borderRadius:6}}>© OpenStreetMap contributors</div></div></div>}
        {section==="Actividades"&&<div className="panel"><div className="panel-head"><div><h2>Agenda de actividades</h2><p>Organiza encuentros y acciones comunitarias.</p></div><button className="primary"><Plus size={16}/> Nueva actividad</button></div>{activities.map(a=><div className="activity wide" key={a.title}><div className={"activity-date "+a.color}><CalendarDays size={20}/></div><div className="activity-info"><b>{a.title}</b><small><MapPin size={13}/>{a.place}</small><small>{a.date} · {a.people} participantes</small></div><span className="tag">{a.type}</span></div>)}</div>}
        {section==="Configuración"&&<div className="panel settings"><h2>Configuración de la organización</h2><p>Los ajustes de cuenta, roles y privacidad estarán disponibles cuando se conecte la autenticación.</p><div className="setting-row"><ShieldCheck size={19}/><div><b>Privacidad y protección de datos</b><small>Consentimiento, acceso y tratamiento de información personal.</small></div><span className="tag">Pendiente</span></div></div>}
        <footer>© 2026 TERRITORIO <span>Gestión comunitaria con responsabilidad y transparencia.</span></footer>
      </div>
    </section>
    {showForm&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><form className="modal" onSubmit={addPerson}><div className="modal-head"><div><h2>Registrar persona</h2><p>Agrega un registro al directorio de tu organización.</p></div><button type="button" className="icon-button" onClick={()=>setShowForm(false)}><X size={18}/></button></div><label>Nombre completo<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Ej. María Fernanda Pérez"/></label><label>Tipo de registro<select value={role} onChange={e=>setRole(e.target.value as "Líder"|"Participante")}><option>Líder</option><option>Participante</option></select></label><label>Sector<select value={sector} onChange={e=>setSector(e.target.value)}><option>San Luis</option><option>La Palma</option><option>Centro</option><option>El Progreso</option><option>Villa Nueva</option></select></label><div className="consent">Al continuar, confirma que cuentas con autorización para registrar estos datos. Esta vista es una demostración y no almacena información en un servidor.</div><div className="modal-actions"><button type="button" className="subtle" onClick={()=>setShowForm(false)}>Cancelar</button><button type="submit" className="primary">Agregar persona <ChevronRight size={16}/></button></div></form></div>}
  </main>;
}
function PeopleTable({people}:{people:Person[]}) { return <div className="table-wrap"><table><thead><tr><th>PERSONA</th><th>TIPO</th><th>SECTOR</th><th>ESTADO</th><th></th></tr></thead><tbody>{people.map((p,i)=><tr key={p.name+i}><td><div className="person"><div className={"avatar "+p.color}>{p.initials}</div><b>{p.name}</b></div></td><td><span className={"role "+(p.role==="Líder"?"leader":"participant")}><i/>{p.role}</span></td><td>{p.sector}</td><td><span className={"status "+(p.status==="Activo"?"on":"pending")}>{p.status}</span></td><td><button className="dots"><MoreHorizontal size={17}/></button></td></tr>)}</tbody></table>{people.length===0&&<div className="empty">No se encontraron registros.</div>}</div>}
