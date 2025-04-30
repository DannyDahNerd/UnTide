import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

// 
export const timeAgo = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hrs`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} mins`;
    default:
      return "Just now";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export const buildUpdateUserPayload = (user: any, extraFields = {}) => ({
  userId: user.id || user.$id,
  name: user.name,
  bio: user.bio,
  imageId: user.imageId,
  imageUrl: user.imageUrl,
  file: [], // No new file upload when just following
  followers: user.followers || [],
  following: user.following || [],
  ...extraFields,
});

export async function geocodeAddress(address: string) {
  const params = new URLSearchParams({ q: address, format: "json", limit: "1" });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
  const data = await res.json();
  if (!data || data.length === 0) return null;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    label: data[0].display_name,
  };
}

export function extractCityState(location: string): string {
  const parts = location.split(",").map(part => part.trim());
  if (parts.length >= 3) {
    return `${parts[0]}, ${parts[2]}`; // City, State
  }
  return location;
}

export function formatDate(dateStr: string) { //ignores timezones
  const [year, month, day] = dateStr.split("T")[0].split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day)); // months are 0 indexed

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}