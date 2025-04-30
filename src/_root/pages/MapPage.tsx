import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { Models } from "appwrite";
import MapMarker from "@/components/shared/MapMarker";
import MarkerClusterGroup from 'react-leaflet-cluster';
import { parseISO, startOfToday, isBefore } from "date-fns";

export default function MapPage() {
  const { data, isPending: isPostLoading,} = useGetRecentPosts();
  
  const today = startOfToday();

  const futurePosts = data?.documents.filter((post: Models.Document) => {
    if (!post.date) return false;
    try {
      const eventDate = parseISO(post.date);
      return !isBefore(eventDate, today); // Includes today and future dates
    } catch {
      return false;
    }
  });

  return (
<div className="w-full h-[calc(100dvh-64px)] overflow-hidden">
      <MapContainer
        center={[36.9645, -122.0167]}
        zoom={9}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MarkerClusterGroup>
          {futurePosts?.map((post: Models.Document) => (
            <MapMarker key={post.$id} post={post} />
          ))}
        </MarkerClusterGroup>

        {isPostLoading && !data && <Loader />}
      </MapContainer>
    </div>
  );
}