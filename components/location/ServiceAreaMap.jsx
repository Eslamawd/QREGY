"use client";

import { Circle, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitView({ lat, lng, radiusKm }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 14, { animate: false });
  }, [lat, lng, map]);

  useEffect(() => {
    const radiusMeters = (Number(radiusKm) || 1) * 1000;
    map.fitBounds(
      [
        [lat - 0.02, lng - 0.02],
        [lat + 0.02, lng + 0.02],
      ],
      { padding: [20, 20] },
    );
    if (radiusMeters > 2500) {
      map.setZoom(12);
    }
  }, [lat, lng, radiusKm, map]);

  return null;
}

export default function ServiceAreaMap({ lat, lng, radiusKm = 10 }) {
  if (!lat || !lng) {
    return null;
  }

  return (
    <div className="h-[280px] w-full overflow-hidden rounded-2xl border border-white/10">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
        <Circle
          center={[lat, lng]}
          radius={(Number(radiusKm) || 10) * 1000}
          pathOptions={{
            color: "#22d3ee",
            fillColor: "#06b6d4",
            fillOpacity: 0.12,
          }}
        />
        <FitView lat={lat} lng={lng} radiusKm={radiusKm} />
      </MapContainer>
    </div>
  );
}
