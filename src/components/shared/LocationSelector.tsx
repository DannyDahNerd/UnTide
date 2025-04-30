import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Input } from "../ui/input";
import Loader from "./Loader";
import { geocodeAddress } from "@/lib/utils";

// Custom marker icon fix for Leaflet default
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to recenter map when a search result is chosen
const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center]);
  return null;
};

type LocationSelectorProps = {
    onSelect: (coords: { lat: number; lng: number }, label: string) => void;
    initialCoords?: { lat: number; lng: number };
    initialLabel?: string;
};

// LocationSelector component
const LocationSelector = ({
    onSelect,
    initialCoords,
    initialLabel,
  }: LocationSelectorProps) => {
    const [input, setInput] = useState("");
    const [searchResult, setSearchResult] = useState<{
        lat: number;
        lng: number;
        label: string;
      } | null>(initialCoords && initialLabel
        ? { ...initialCoords, label: initialLabel }
        : null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
    setIsLoading(true);
    const result = await geocodeAddress(input);
    setIsLoading(false);

    if (result) {
        setSearchResult(result);
        onSelect({ lat: result.lat, lng: result.lng }, result.label);
    }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
        <div className="flex gap-2">
            <Input
            type="text"
            placeholder="Search for a location..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="shad-input"
            />
            <button type ="button" onClick={handleSearch} 
                className="untide-button_primary px-4 py-2 text-sm font-medium rounded flex items-center justify-center">
                {isLoading ? (
                <div className="flex-center gap-2">
                    <Loader /> Loading...
                </div>
                ): "Search"}
            </button>
            
        </div>

        <div className="w-full aspect-[4/5] md:aspect-[5/2]">
            <MapContainer
            center={searchResult ? [searchResult.lat, searchResult.lng] : [37.7749, -122.4194]}
            zoom={searchResult ? 13 : 10}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {searchResult && (
                <>
                <RecenterMap center={[searchResult.lat, searchResult.lng]} />
                <Marker position={[searchResult.lat, searchResult.lng]} icon={markerIcon} />
                </>
            )}
            </MapContainer>
        </div>

        {searchResult && (
            <p className="text-sm text-cyan-700 mt-2">Selected: {searchResult.label}</p>
        )}
        </div>
    );
};

export default LocationSelector;
