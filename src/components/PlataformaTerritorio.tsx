"use client";

import { useMemo, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import {
  Activity, AlertCircle, BarChart3, Building2, CalendarDays, CheckCircle2,
  ChevronRight, ClipboardList, FileCheck2, LayoutDashboard, Map, Plus,
  Search, ShieldCheck, Users, X, Clock3, MapPin, ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MapaCalorTerritorial = dynamic(
  () => import("./MapaCalorTerritorial"),
  { ssr: false, loading: () => <div className="territory-map-loading">Cargando mapa…</div> },
);

type Section = "Resumen" | "Territorio" | "Organizaciones" | "Solicitudes" | "Agenda" | "Tareas" | "Observación" | "Analítica";
type RequestItem = { id: number; title: string; sector: string; category: string; status: "Recibida" | "En gestión" | "Resuelta"; date: string };
type TaskItem = { id: number; title: string; owner: string; due: string; status: "Pendiente" | "En curso" | "Completada" };
type EventItem = { id: number; title: string; place: string; date: string; time: string; category: string };
type Organization = { id: number; name: string; kind: string; sector: string; contact: string };

const nav: { label: Section; icon: LucideIcon; group: string }[] = [
  { label: "Resumen", icon: LayoutDashboard, group: "GENERAL" },
  { label: "Territorio", icon: Map, group: "GENERAL" },
  { label: "Organizaciones", icon: Building2, group: "COMUNIDAD" },
  { label: "Solicitudes", icon: ClipboardList, group: "COMUNIDAD" },
  { label: "Agenda", icon: CalendarDays, group: "OPERACIÓN" },
  { label: "Tareas", icon: CheckCircle2, group: "OPERACIÓN" },
  { label: "Observación", icon: FileCheck2, group: "CONTROL" },
  { label: "Analítica", icon: BarChart3, group: "CONTROL" },
];

const initialRequests: RequestItem[] = [
  { id: 1, title: "Reparación de luminarias del parque", sector: "San Luis", category: "Espacio público", status: "En gestión", date: "02 nov 2026" },
  { id: 2, title: "Recolección de residuos en zona común", sector: "La Palma", category: "Servicios públicos", status: "Recibida", date: "01 nov 2026" },
  { id: 3, title: "Adecuación de cancha comunitaria", sector: "Centro", category: "Infraestructura", status: "Resuelta", date: "29 oct 2026" },
];
const initialTasks: TaskItem[] = [
  { id: 1, title: "Verificar estado de luminarias", owner: "Equipo territorial", due: "04 nov 2026", status: "En curso" },
  { id: 2, title: "Solicitar visita de servicios públicos", owner: "Coordinación", due: "05 nov 2026", status: "Pendiente" },
  { id: 3, title: "Consolidar acta de reunión", owner: "Secretaría técnica", due: "06 nov 2026", status: "Completada" },
];
const initialEvents: EventItem[] = [
  { id: 1, title: "Mesa de participación ciudadana", place: "Casa comunal · San Luis", date: "2026-11-04", time: "09:00", category: "Participación" },
  { id: 2, title: "Jornada de recuperación del parque", place: "Parque La Palma", date: "2026-11-06", time: "08:30", category: "Comunidad" },
  { id: 3, title: "Reunión de seguimiento", place: "Salón comunal · Centro", date: "2026-11-08", time: "16:00", category: "Gestión" },
];
const initialOrganizations: Organization[] = [
  { id: 1, name: "Junta de Acción Comunal San Luis", kind: "Organización comunitaria", sector: "San Luis", contact: "Contacto institucional autorizado" },
  { id: 2, name: "Asociación Cultural La Palma", kind: "Organización cultural", sector: "La Palma", contact: "Canal institucional" },
  { id: 3, name: "Red Ambiental del Centro", kind: "Organización ambiental", sector: "Centro", contact: "Canal institucional" },
];

function dateLabel(value: string) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value + "T12:00:00"));
}

export default function PlataformaTerritorio() {
  const [section, setSection] = useState<Section>("Resumen");
  const [requests, setRequests] = useState(initialRequests);
  const [tasks, setTasks] = useState(initialTasks);
  const [events, setEvents] = useState(initialEvents);
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"request" | "task" | "event" | "organization" | "observation" | null>(null);
  const [notice, setNotice] = useState("");
  const [requestTitle, setRequestTitle] = useState("");
  const [requestSector, setRequestSector] = useState("San Luis");
  const [requestCategory, setRequestCategory] = useState("Espacio público");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskOwner, setTaskOwner] = useState("Equipo territorial");
  const [taskDue, setTaskDue] = useState("2026-11-06");
  const [eventTitle, setEventTitle] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventDate, setEventDate] = useState("2026-11-10");
  const [eventTime, setEventTime] = useState("09:00");
  const [orgName, setOrgName] = useState("");
  const [orgSector, setOrgSector] = useState("San Luis");
  const [observation, setObservation] = useState({ municipality: "Sincelejo", place: "", table: "", form: "E-14", note: "" });

  const filteredOrganizations = useMemo(() => organizations.filter((item) =>
    (item.name + " " + item.kind + " " + item.sector).toLowerCase().includes(search.toLowerCase())
  ), [organizations, search]);
  const filteredRequests = useMemo(() => requests.filter((item) =>
    (item.title + " " + item.sector + " " + item.category + " " + item.status).toLowerCase().includes(search.toLowerCase())
  ), [requests, search]);

  function submitRequest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRequests([{ id: Date.now(), title: requestTitle.trim(), sector: requestSector, category: requestCategory, status: "Recibida", date: "02 nov 2026" }, ...requests]);
    setRequestTitle(""); setModal(null); setSection("Solicitudes"); setNotice("Solicitud agregada a la demostración local.");
  }
  function submitTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTasks([{ id: Date.now(), title: taskTitle.trim(), owner: taskOwner, due: dateLabel(taskDue), status: "Pendiente" }, ...tasks]);
    setTaskTitle(""); setModal(null); setSection("Tareas"); setNotice("Tarea agregada a la demostración local.");
  }
  function submitEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEvents([{ id: Date.now(), title: eventTitle.trim(), place: eventPlace.trim(), date: eventDate, time: eventTime, category: "Comunidad" }, ...events]);
    setEventTitle(""); setEventPlace(""); setModal(null); setSection("Agenda"); setNotice("Actividad agregada a la demostración local.");
  }
  function submitOrganization(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOrganizations([{ id: Date.now(), name: orgName.trim(), kind: "Organización comunitaria", sector: orgSector, contact: "Pendiente de autorización de contacto" }, ...organizations]);
    setOrgName(""); setModal(null); setSection("Organizaciones"); setNotice("Organización agregada a la demostración local.");
  }
  function submitObservation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setModal(null); setNotice("Ficha documental registrada solo como demostración. No se ha enviado ni almacenado en un servidor.");
    setObservation({ municipality: "Sincelejo", place: "", table: "", form: "E-14", note: "" });
  }
  function updateRequest(id: number, status: RequestItem["status"]) {
    setRequests(requests.map(item => item.id === id ? { ...item, status } : item));
  }
  function updateTask(id: number, status: TaskItem["status"]) {
    setTasks(tasks.map(item => item.id === id ? { ...item, status } : item));
  }
  function openModal(value: NonNullable<typeof modal>) { setNotice(""); setModal(value); }

  return <main className="territorio-app">
    <aside className="territorio-sidebar">
      <div className="territorio-brand"><div className="territorio-brand-mark">T</div><div><b>TERRITORIO</b><small>GESTIÓN CIUDADANA</small></div></div>
      <div className="territorio-workspace"><span>O</span><div><b>Mi organización</b><small>Espacio de trabajo</small></div></div>
      {["GENERAL", "COMUNIDAD", "OPERACIÓN", "CONTROL"].map(group => <div className="territorio-nav-group" key={group}>
        <small>{group}</small>
        {nav.filter(item => item.group === group).map(item => <button key={item.label} onClick={() => { setSection(item.label); setSearch(""); }} className={section === item.label ? "active" : ""}><item.icon size={17}/>{item.label}{item.label === "Solicitudes" && <span className="territorio-nav-count">{requests.length}</span>}</button>)}
      </div>)}
      <div className="territorio-sidebar-foot"><ShieldCheck size={16}/><span>Gestión responsable de datos</span></div>
    </aside>

    <section className="territorio-main">
      <header className="territorio-topbar"><div><span>Mi organización</span><ChevronRight size={14}/><b>{section}</b></div><span className="territorio-private"><ShieldCheck size={14}/> Entorno de demostración</span></header>
      <div className="territorio-page">
        <div className="territorio-heading"><div><span className="territorio-eyebrow">PLATAFORMA DE GESTIÓN TERRITORIAL</span><h1>{section === "Resumen" ? "Resumen general" : section}</h1><p>{section === "Resumen" ? "Información operativa y participación ciudadana en un solo lugar." : descriptions[section]}</p></div>
          <div className="territorio-heading-actions">
            {section === "Solicitudes" && <button className="territorio-button" onClick={() => openModal("request")}><Plus size={16}/> Nueva solicitud</button>}
            {section === "Tareas" && <button className="territorio-button" onClick={() => openModal("task")}><Plus size={16}/> Nueva tarea</button>}
            {section === "Agenda" && <button className="territorio-button" onClick={() => openModal("event")}><Plus size={16}/> Nueva actividad</button>}
            {section === "Organizaciones" && <button className="territorio-button" onClick={() => openModal("organization")}><Plus size={16}/> Añadir organización</button>}
            {section === "Observación" && <button className="territorio-button" onClick={() => openModal("observation")}><Plus size={16}/> Nueva ficha</button>}
          </div>
        </div>
        {notice && <div className="territorio-notice"><CheckCircle2 size={16}/>{notice}<button onClick={() => setNotice("")} aria-label="Cerrar aviso"><X size={15}/></button></div>}

        {section === "Resumen" && <Dashboard requests={requests} tasks={tasks} events={events} setSection={setSection}/>}
        {section === "Territorio" && <div className="territorio-panel"><div className="territorio-panel-head"><div><h2>Cobertura territorial agregada</h2><p>Cartografía de referencia. No representa domicilios ni ubicaciones personales.</p></div><span className="territorio-chip">Sincelejo · Sucre</span></div><MapaCalorTerritorial puntos={[]}/><div className="territorio-map-note"><MapPin size={15}/> Los datos geográficos se habilitarán cuando exista una fuente autorizada y agregada por sector.</div></div>}
        {section === "Organizaciones" && <div className="territorio-panel"><div className="territorio-panel-head"><div><h2>Directorio institucional y comunitario</h2><p>Organizaciones, entidades y colectivos con canales de contacto autorizados.</p></div></div><div className="territorio-toolbar"><div className="territorio-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar organización, tipo o sector"/></div></div><div className="territorio-table-wrap"><table><thead><tr><th>ORGANIZACIÓN</th><th>TIPO</th><th>SECTOR</th><th>CONTACTO</th></tr></thead><tbody>{filteredOrganizations.map(item=><tr key={item.id}><td><b>{item.name}</b></td><td>{item.kind}</td><td>{item.sector}</td><td>{item.contact}</td></tr>)}</tbody></table>{filteredOrganizations.length===0&&<Empty text="No hay organizaciones que coincidan con la búsqueda."/>}</div></div>}
        {section === "Solicitudes" && <div className="territorio-panel"><div className="territorio-panel-head"><div><h2>Solicitudes ciudadanas</h2><p>Registro y seguimiento de necesidades reportadas por la comunidad.</p></div><span className="territorio-chip">{requests.length} registros</span></div><div className="territorio-toolbar"><div className="territorio-search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por asunto, sector o estado"/></div></div><div className="territorio-table-wrap"><table><thead><tr><th>ASUNTO</th><th>SECTOR</th><th>CATEGORÍA</th><th>FECHA</th><th>ESTADO</th><th>ACTUALIZAR</th></tr></thead><tbody>{filteredRequests.map(item=><tr key={item.id}><td><b>{item.title}</b></td><td>{item.sector}</td><td>{item.category}</td><td>{item.date}</td><td><Status value={item.status}/></td><td><select className="territorio-inline-select" value={item.status} onChange={e=>updateRequest(item.id,e.target.value as RequestItem["status"])}><option>Recibida</option><option>En gestión</option><option>Resuelta</option></select></td></tr>)}</tbody></table>{filteredRequests.length===0&&<Empty text="No hay solicitudes que coincidan con la búsqueda."/>}</div></div>}
        {section === "Agenda" && <div className="territorio-panel"><div className="territorio-panel-head"><div><h2>Agenda comunitaria</h2><p>Actividades, reuniones y espacios de participación.</p></div><span className="territorio-chip">{events.length} actividades</span></div><div className="territorio-event-list">{events.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(item=><article className="territorio-event" key={item.id}><div className="territorio-event-date"><b>{new Date(item.date+"T12:00:00").getDate()}</b><small>{new Intl.DateTimeFormat("es-CO",{month:"short"}).format(new Date(item.date+"T12:00:00")).toUpperCase()}</small></div><div className="territorio-event-info"><b>{item.title}</b><span><MapPin size={13}/>{item.place}</span><span><Clock3 size={13}/>{dateLabel(item.date)} · {item.time}</span></div><span className="territorio-chip">{item.category}</span></article>)}</div></div>}
        {section === "Tareas" && <div className="territorio-panel"><div className="territorio-panel-head"><div><h2>Seguimiento de compromisos</h2><p>Responsables, fechas límite y estado de ejecución.</p></div><span className="territorio-chip">{tasks.length} tareas</span></div><div className="territorio-task-list">{tasks.map(item=><article className="territorio-task" key={item.id}><div className="territorio-task-icon"><ClipboardList size={18}/></div><div className="territorio-task-info"><b>{item.title}</b><span>{item.owner} · Fecha límite: {item.due}</span></div><select className="territorio-inline-select" value={item.status} onChange={e=>updateTask(item.id,e.target.value as TaskItem["status"])}><option>Pendiente</option><option>En curso</option><option>Completada</option></select></article>)}</div></div>}
        {section === "Observación" && <ObservationPanel/>}
        {section === "Analítica" && <Analytics requests={requests} tasks={tasks} events={events} organizations={organizations}/>}
        <footer className="territorio-footer"><span>© 2026 TERRITORIO</span><span>Participación, trazabilidad y gestión pública responsable.</span></footer>
      </div>
    </section>

    {modal && <div className="territorio-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(null);}}><form className="territorio-modal" onSubmit={modal==="request"?submitRequest:modal==="task"?submitTask:modal==="event"?submitEvent:modal==="organization"?submitOrganization:submitObservation}>
      <div className="territorio-modal-head"><div><span className="territorio-eyebrow">NUEVO REGISTRO</span><h2>{{request:"Solicitud ciudadana",task:"Tarea operativa",event:"Actividad de agenda",organization:"Organización",observation:"Ficha de observación documental"}[modal]}</h2></div><button type="button" className="territorio-close" onClick={()=>setModal(null)} aria-label="Cerrar"><X size={18}/></button></div>
      {modal === "request" && <><label>Asunto<input required maxLength={140} value={requestTitle} onChange={e=>setRequestTitle(e.target.value)} placeholder="Describe brevemente la necesidad"/></label><label>Sector<select value={requestSector} onChange={e=>setRequestSector(e.target.value)}><option>San Luis</option><option>La Palma</option><option>Centro</option><option>El Progreso</option><option>Villa Nueva</option></select></label><label>Categoría<select value={requestCategory} onChange={e=>setRequestCategory(e.target.value)}><option>Espacio público</option><option>Servicios públicos</option><option>Infraestructura</option><option>Ambiente</option><option>Movilidad</option><option>Otro</option></select></label></>}
      {modal === "task" && <><label>Descripción<input required maxLength={140} value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} placeholder="Compromiso o acción por realizar"/></label><label>Responsable<input required value={taskOwner} onChange={e=>setTaskOwner(e.target.value)} maxLength={80}/></label><label>Fecha límite<input required type="date" value={taskDue} onChange={e=>setTaskDue(e.target.value)}/></label></>}
      {modal === "event" && <><label>Nombre de la actividad<input required value={eventTitle} onChange={e=>setEventTitle(e.target.value)} maxLength={120}/></label><label>Lugar<input required value={eventPlace} onChange={e=>setEventPlace(e.target.value)} maxLength={120}/></label><div className="territorio-form-grid"><label>Fecha<input required type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)}/></label><label>Hora<input required type="time" value={eventTime} onChange={e=>setEventTime(e.target.value)}/></label></div></>}
      {modal === "organization" && <><label>Nombre de la organización<input required value={orgName} onChange={e=>setOrgName(e.target.value)} maxLength={120}/></label><label>Sector<select value={orgSector} onChange={e=>setOrgSector(e.target.value)}><option>San Luis</option><option>La Palma</option><option>Centro</option><option>El Progreso</option><option>Villa Nueva</option></select></label></>}
      {modal === "observation" && <><label>Municipio<input required value={observation.municipality} onChange={e=>setObservation({...observation,municipality:e.target.value})}/></label><label>Puesto de votación<input required value={observation.place} onChange={e=>setObservation({...observation,place:e.target.value})} placeholder="Nombre oficial del puesto"/></label><div className="territorio-form-grid"><label>Mesa<input required value={observation.table} onChange={e=>setObservation({...observation,table:e.target.value})} placeholder="Ej. 001"/></label><label>Formulario<select value={observation.form} onChange={e=>setObservation({...observation,form:e.target.value})}><option>E-14</option><option>E-24</option><option>Otro soporte</option></select></label></div><label>Nota de verificación documental<textarea value={observation.note} onChange={e=>setObservation({...observation,note:e.target.value})} rows={3} placeholder="Describe la novedad documental, sin datos personales."/></label><p className="territorio-form-note">Este módulo se limita a la trazabilidad de documentos y resultados oficiales agregados. No registra preferencias ni perfiles de electores.</p></>}
      <div className="territorio-modal-actions"><button type="button" className="territorio-button-secondary" onClick={()=>setModal(null)}>Cancelar</button><button type="submit" className="territorio-button">Guardar registro <ChevronRight size={15}/></button></div>
    </form></div>}
  </main>;
}

const descriptions: Record<Section,string> = {
  Resumen:"Indicadores de gestión, actividad y seguimiento.",
  Territorio:"Visualización geográfica de información agregada por sector.",
  Organizaciones:"Directorio de entidades, colectivos y organizaciones comunitarias.",
  Solicitudes:"Atención y seguimiento de necesidades ciudadanas.",
  Agenda:"Programación de reuniones, jornadas y espacios comunitarios.",
  Tareas:"Control de compromisos, responsables y fechas límite.",
  Observación:"Registro documental y verificación de resultados oficiales.",
  Analítica:"Indicadores operativos agregados para apoyar decisiones de gestión.",
};

function Dashboard({requests,tasks,events,setSection}:{requests:RequestItem[];tasks:TaskItem[];events:EventItem[];setSection:(section:Section)=>void}) {
  const resolved = requests.filter(item=>item.status==="Resuelta").length;
  const completed = tasks.filter(item=>item.status==="Completada").length;
  const cards = [
    {label:"Solicitudes registradas",value:requests.length,detail:"Necesidades reportadas",icon:ClipboardList,color:"violet"},
    {label:"Solicitudes resueltas",value:resolved,detail:requests.length?Math.round(resolved/requests.length*100)+"% del total":"Sin registros",icon:CheckCircle2,color:"green"},
    {label:"Compromisos activos",value:tasks.filter(item=>item.status!=="Completada").length,detail:completed+" completados",icon:Activity,color:"blue"},
    {label:"Actividades programadas",value:events.length,detail:"En agenda comunitaria",icon:CalendarDays,color:"amber"},
  ];
  return <>
    <div className="territorio-stats">{cards.map(card=><article className="territorio-stat" key={card.label}><div className="territorio-stat-top"><span>{card.label}</span><i className={card.color}><card.icon size={18}/></i></div><strong>{card.value}</strong><small>{card.detail}</small></article>)}</div>
    <div className="territorio-dashboard-grid"><section className="territorio-panel"><div className="territorio-panel-head"><div><h2>Estado de solicitudes</h2><p>Seguimiento de los reportes comunitarios</p></div><button className="territorio-link" onClick={()=>setSection("Solicitudes")}>Ver solicitudes <ChevronRight size={14}/></button></div><div className="territorio-status-bars">{(["Recibida","En gestión","Resuelta"] as const).map((status)=>{const count=requests.filter(item=>item.status===status).length;const pct=requests.length?count/requests.length*100:0;return <div className="territorio-status-row" key={status}><span>{status}</span><div><i style={{width:pct+"%"}}/></div><b>{count}</b></div>;})}</div></section>
      <section className="territorio-panel"><div className="territorio-panel-head"><div><h2>Próximas actividades</h2><p>Agenda de la organización</p></div><button className="territorio-link" onClick={()=>setSection("Agenda")}>Ver agenda <ChevronRight size={14}/></button></div>{events.slice(0,3).map(event=><div className="territorio-mini-event" key={event.id}><div><b>{new Date(event.date+"T12:00:00").getDate()}</b><small>{new Intl.DateTimeFormat("es-CO",{month:"short"}).format(new Date(event.date+"T12:00:00"))}</small></div><section><b>{event.title}</b><small><MapPin size={12}/>{event.place}</small></section></div>)}</section></div>
    <section className="territorio-panel territorio-dashboard-bottom"><div className="territorio-panel-head"><div><h2>Gestión y control</h2><p>Accesos rápidos a los módulos operativos</p></div></div><div className="territorio-quick-links"><button onClick={()=>setSection("Organizaciones")}><Building2 size={18}/>Directorio de organizaciones<ArrowUpRight size={14}/></button><button onClick={()=>setSection("Tareas")}><CheckCircle2 size={18}/>Seguimiento de tareas<ArrowUpRight size={14}/></button><button onClick={()=>setSection("Observación")}><FileCheck2 size={18}/>Observación documental<ArrowUpRight size={14}/></button><button onClick={()=>setSection("Analítica")}><BarChart3 size={18}/>Analítica agregada<ArrowUpRight size={14}/></button></div></section>
  </>;
}

function ObservationPanel() {
  return <div className="territorio-panel"><div className="territorio-panel-head"><div><h2>Observación documental electoral</h2><p>Herramienta de trazabilidad para soportes y resultados oficiales agregados.</p></div><span className="territorio-chip">Módulo documental</span></div><div className="territorio-info-banner"><ShieldCheck size={19}/><div><b>Alcance y salvaguardas</b><p>Registra puesto, mesa, tipo de formulario y novedades verificables. No recopila datos de electores, preferencias, intención de voto ni información individual de participación.</p></div></div><div className="territorio-observation-grid"><article><FileCheck2 size={20}/><b>Identificación del soporte</b><p>Referencia del formulario y ubicación oficial de la mesa.</p></article><article><Search size={20}/><b>Verificación</b><p>Documentación de diferencias y observaciones contrastables.</p></article><article><ClipboardList size={20}/><b>Trazabilidad</b><p>Registro de novedades para revisión y auditoría documental.</p></article></div><div className="territorio-empty-state"><AlertCircle size={19}/><span>No hay fichas documentales registradas en esta sesión de demostración.</span></div></div>;
}

function Analytics({requests,tasks,events,organizations}:{requests:RequestItem[];tasks:TaskItem[];events:EventItem[];organizations:Organization[]}) {
  const categories = ["Espacio público","Servicios públicos","Infraestructura","Ambiente","Movilidad","Otro"];
  return <div className="territorio-analytics-grid"><section className="territorio-panel"><div className="territorio-panel-head"><div><h2>Solicitudes por categoría</h2><p>Distribución de necesidades registradas</p></div></div>{categories.map(category=>{const count=requests.filter(item=>item.category===category).length;return <div className="territorio-status-row" key={category}><span>{category}</span><div><i style={{width:(requests.length?count/requests.length*100:0)+"%"}}/></div><b>{count}</b></div>;})}</section><section className="territorio-panel"><div className="territorio-panel-head"><div><h2>Indicadores operativos</h2><p>Resumen de la sesión</p></div></div><div className="territorio-kpi-list"><div><span>Organizaciones en directorio</span><b>{organizations.length}</b></div><div><span>Actividades en agenda</span><b>{events.length}</b></div><div><span>Tareas pendientes</span><b>{tasks.filter(item=>item.status==="Pendiente").length}</b></div><div><span>Tareas completadas</span><b>{tasks.filter(item=>item.status==="Completada").length}</b></div><div><span>Solicitudes en gestión</span><b>{requests.filter(item=>item.status==="En gestión").length}</b></div></div></section><p className="territorio-analytics-note">Los indicadores se calculan con datos ilustrativos de esta sesión. No constituyen estadísticas oficiales ni representan personas o preferencias políticas.</p></div>;
}

function Status({value}:{value:RequestItem["status"]}) {
  return <span className={"territorio-status-pill "+(value==="Resuelta"?"done":value==="En gestión"?"progress":"new")}>{value}</span>;
}
function Empty({text}:{text:string}) { return <div className="territorio-empty-state">{text}</div>; }
