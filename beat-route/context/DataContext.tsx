import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { fetchActivities } from "@/lib/api";
import { StickerStyle } from "@/components/Stickers";

export interface ActivitySong {
  id: string;
  title: string;
  artists: string[];
  spotifyUrl: string;
  albumArtUrl: string;
}

export type Tracklist = ActivitySong[];

// Base interface with common fields for all activities
interface ActivityBase {
  id: string;
  name: string;
  date: string; // ISO 8601 format
  tracklist?: Tracklist;
  averageHeartRate?: number;
  elevationGainInMeters?: number;
  polyline?: string;
}

// Specific interface for a 'run' activity
export interface RunActivity extends ActivityBase {
  type: "run";
  distanceInMeters: number;
  durationInSeconds: number;
  pace: string; // e.g., "8'30\"/km"
}

// Specific interface for a 'ride' activity
export interface RideActivity extends ActivityBase {
  type: "ride";
  distanceInMeters: number;
  durationInSeconds: number;
  averageSpeedKph: number;
}

// The final Activity type is a union of all possible activity types
export type Activity = RunActivity | RideActivity;

interface DataContextType {
  activities: Activity[];
  loading: boolean;
  stickerStyle: StickerStyle;
  setStickerStyle: (style: StickerStyle) => void;
  // In the future, could add functions like:
  // addActivity: (activity: Activity) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultStickerStyle: StickerStyle = {
  color: "#ffffff",
  fontWeight: "normal",
  fontSize: 14,
  strokeWidth: 2,
};

// --- 4. Create the Provider ---

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stickerStyle, setStickerStyle] =
    useState<StickerStyle>(defaultStickerStyle);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchActivities();
        setActivities(data);
      } catch (e) {
        console.error("Failed to load activities", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const value = { activities, loading, stickerStyle, setStickerStyle };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
