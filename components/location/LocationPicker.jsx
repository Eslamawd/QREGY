"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Navigation, Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { useLanguage } from "@/context/LanguageContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapCenterUpdater({ coords }) {
  const map = useMap();

  useEffect(() => {
    map.setView([coords.lat, coords.lng], map.getZoom(), { animate: true });
  }, [coords, map]);

  return null;
}

function MapEvents({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

const DEFAULT_COORDS = {
  lat: 30.0444,
  lng: 31.2357,
};

export default function LocationPicker({ value, onChange }) {
  const { lang } = useLanguage();
  const [coords, setCoords] = useState({
    lat: value?.lat || DEFAULT_COORDS.lat,
    lng: value?.lng || DEFAULT_COORDS.lng,
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (value?.lat && value?.lng) {
      setCoords({ lat: value.lat, lng: value.lng });
    }
  }, [value]);

  const resolveAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${lang}`,
      );
      const data = await response.json();
      return (
        data.display_name ||
        (lang === "ar" ? "موقع غير معروف" : "Unknown location")
      );
    } catch {
      return lang === "ar" ? "موقعك الحالي" : "Your current location";
    }
  };

  const updateLocation = async (lat, lng, addressOverride) => {
    const address = addressOverride || (await resolveAddress(lat, lng));
    const nextLocation = { lat, lng, address, isSet: true };

    setCoords({ lat, lng });
    onChange?.(nextLocation);
    toast.success(lang === "ar" ? "تم تحديث الموقع" : "Location updated");
  };

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      toast.error(
        lang === "ar"
          ? "المتصفح لا يدعم تحديد الموقع"
          : "Geolocation is not supported by your browser",
      );
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await updateLocation(
          position.coords.latitude,
          position.coords.longitude,
        );
        setLoading(false);
      },
      () => {
        toast.error(
          lang === "ar"
            ? "فعّل الـ GPS أو اسمح بالموقع"
            : "Please enable GPS or allow location access",
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&accept-language=${lang}&limit=5`,
        );
        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch {
        setSearchResults([]);
      }
    }, 350);
  };

  const selectSearchResult = (result) => {
    const lat = Number.parseFloat(result.lat);
    const lng = Number.parseFloat(result.lon);
    updateLocation(lat, lng, result.display_name);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder={
            lang === "ar"
              ? "ابحث عن عنوان أو منطقة..."
              : "Search for an address or area..."
          }
          className="pl-10"
        />

        {searchResults.length > 0 && (
          <ul className="absolute z-[999] mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-white/10 bg-background shadow-xl">
            {searchResults.map((result) => (
              <li
                key={result.place_id}
                onClick={() => selectSearchResult(result)}
                className="cursor-pointer border-b border-white/5 px-4 py-3 text-sm hover:bg-accent/20"
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button
        type="button"
        onClick={handleAutoLocate}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2"
      >
        <Navigation className="h-4 w-4" />
        {loading
          ? lang === "ar"
            ? "جارٍ تحديد موقعك..."
            : "Locating..."
          : lang === "ar"
            ? "استخدم موقعي الحالي"
            : "Use my current location"}
      </Button>

      <div className="overflow-hidden rounded-3xl border border-white/10">
        <div className="h-[320px] w-full">
          <MapContainer
            center={[coords.lat, coords.lng]}
            zoom={15}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[coords.lat, coords.lng]}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const nextCoords = event.target.getLatLng();
                  updateLocation(nextCoords.lat, nextCoords.lng);
                },
              }}
            />
            <MapCenterUpdater coords={coords} />
            <MapEvents onSelect={updateLocation} />
          </MapContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-background/60 p-4 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 text-primary" />
          <div className="space-y-1">
            <p className="font-semibold">
              {lang === "ar" ? "العنوان المختار" : "Selected address"}
            </p>
            <p className="text-muted-foreground">
              {value?.address ||
                (lang === "ar"
                  ? "لم يتم اختيار موقع بعد"
                  : "No location selected yet")}
            </p>
            <p className="text-xs text-muted-foreground">
              {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
