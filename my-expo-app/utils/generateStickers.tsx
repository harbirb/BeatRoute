import { create } from "react-test-renderer";

interface SummaryActivity {
  type: string;
  average_speed: any;
  average_heartrate: any;
  map: any;
  total_elevation_gain: any;
  id: number;
  distance: number;
  moving_time: number;
}

interface Sticker {
  id: string;
  type: "polyline" | "text";
  data: string;
  caption?: string;
}

export default function generateStickers(activityData: any) {
  const stickers: Sticker[] = [];
  stickers.push(...createTextStickers(activityData));
  stickers.push(
    activityData.map.summary_polyline && createPolylineSticker(activityData)
  );
  return stickers;
}

const createPolylineSticker = (activity: SummaryActivity): Sticker => ({
  id: activity.id.toString() + "polyline",
  type: "polyline",
  data: activity.map.summary_polyline,
});

const createTextStickers = (activity: SummaryActivity): Sticker[] => {
  const textStickers: Sticker[] = [];
  if (activity.distance) {
    textStickers.push({
      id: activity.id.toString() + "distance",
      type: "text",
      data: (activity.distance / 1000).toFixed(1) + " km",
      caption: "Distance",
    });
  }
  if (activity.moving_time) {
    textStickers.push({
      id: activity.id.toString() + "moving_time",
      type: "text",
      data: processMovingTime(activity.moving_time),
      caption: "Time",
    });
  }
  if (activity.total_elevation_gain) {
    textStickers.push({
      id: activity.id.toString() + "total_elevation_gain",
      type: "text",
      data: activity.total_elevation_gain.toFixed(0) + " m",
      caption: "Elevation",
    });
  }
  if (activity.average_heartrate) {
    textStickers.push({
      id: activity.id.toString() + "average_heartrate",
      type: "text",
      data: activity.average_heartrate.toFixed(0) + " bpm",
      caption: "Heart Rate",
    });
  }
  if (activity.average_speed) {
    const kmh = activity.average_speed * 3.6;
    const pace = 60 / kmh;
    textStickers.push({
      id: activity.id.toString() + "average_speed",
      type: "text",
      data: processSpeed(activity),
      caption: activity.type === "Run" ? "Pace" : "Speed",
    });
  }
  return textStickers;
};

function processSpeed(activity: SummaryActivity): string {
  const kmh = activity.average_speed * 3.6;
  const pace = 60 / kmh;
  switch (activity.type) {
    case "Run":
      return `${pace.toFixed(0)}:${((pace % 1) * 60).toFixed(0)} /km`;
    case "Ride":
      return `${kmh.toFixed(1)} km/h`;
    case "Swim":
      const swimpace = pace / 10;
      return `${swimpace.toFixed(0)}:${((swimpace % 1) * 60).toFixed(0)} /100m`;
    default:
      return `${kmh.toFixed(1)} km/h`;
  }
}

function processMovingTime(movingTime: number): string {
  const hours = Math.floor(movingTime / 3600);
  const minutes = Math.floor((movingTime % 3600) / 60);
  return `${hours}h ${minutes}m`;
}
