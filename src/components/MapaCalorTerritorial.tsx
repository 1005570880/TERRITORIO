"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, TileLayer as LeafletTileLayer } from "leaflet";
import { Layers, MapPin, Satellite } from "lucide-react";

type PuntoCalor = { lat: number; lng: number; intensidad: number };
type Props = { puntos?: PuntoCalor[] };

export default function MapaCalorTerritorial({ puntos = [] }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const heatRef = useRef<{ remove: () => void } | null>(null);
  const baseRef = useRef<LeafletTileLayer | null>(null);
  const [base, setBase] = useState<"osm" | "satelite">("osm");
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let disposed = false;
    let map: LeafletMap | null = null;
    let heat: { addTo: (map: LeafletMap) => void; remove: () => void } | null = null;
    let tile: LeafletTileLayer | null = null;
    (async () => {
      const L = await import("leaflet");
      await import("leaflet.heat");
      if (disposed || !host.current) return;
      map = L.map(host.current, { center: [9.30472, -75.39778], zoom: 13, zoomControl: true });
      tile = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      baseRef.current = tile;
      const heatFactory = (L as unknown as { heatLayer?: (points: [number, number, number][], options: object) => { addTo: (m: LeafletMap) => void; remove: () => void } }).heatLayer;
      if (heatFactory && puntos.length) {
        heat = heatFactory(puntos.map(p => [p.lat, p.lng, Math.max(0, Math.min(1, p.intensidad))]), {
          radius: 28, blur: 20, maxZoom: 17,
          gradient: { 0.2: "#ef4444", 0.5: "#eab308", 0.8: "#22c55e" },
        }).addTo(map);
        heatRef.current = heat;
      }
      setListo(true);
    })();
    return () => {
      disposed = true;
      heat?.remove();
      map?.remove();
      mapRef.current = null;
      baseRef.current = null;
      heatRef.current = null;
    };
  }, [puntos]);

  useEffect(() => {
    if (!mapRef.current || !baseRef.current) return;
    const L = requireLeafletLayer();
    const url = base === "osm"
      ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    const attribution = base === "osm"
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      : "Tiles &copy; Esri";
    baseRef.current.remove();
    baseRef.current = L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(mapRef.current);
  }, [base]);

  return <div className="territory-map">
    <div className="territory-map-controls" role="group" aria-label="Tipo de mapa">
      <button type="button" className={base === "osm" ? "selected" : ""} onClick={() => setBase("osm")}><Layers size={14}/> Mapa</button>
      <button type="button" className={base === "satelite" ? "selected" : ""} onClick={() => setBase("satelite")}><Satellite size={14}/> Satelital</button>
    </div>
    <div ref={host} className="territory-map-canvas" aria-label="Mapa de cobertura territorial"/>
    <div className="territory-map-legend">
      <b><MapPin size={13}/> Cobertura agregada por sector</b>
      <div className="legend-gradient"/>
      <div className="legend-labels"><span>Sin datos</span><span>Baja</span><span>Media</span><span>Alta</span></div>
      {!puntos.length && <small>No hay datos territoriales agregados disponibles. Conecta una fuente autorizada para visualizar la cobertura.</small>}
      {puntos.length > 0 && <small>Visualización agregada. No representa domicilios ni ubicaciones individuales.</small>}
    </div>
    {!listo && <div className="territory-map-loading">Cargando mapa…</div>}
  </div>;
}

function requireLeafletLayer() {
  // La importación del módulo ocurre únicamente en el navegador.
  return (window as unknown as { L?: typeof import("leaflet") }).L!;
}
