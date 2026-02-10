import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { fetchActivities } from "@/lib/api";

export interface ActivitySong {
  id: string;
  title: string;
  artists: string[];
  spotifyUrl: string;
  albumArtUrl: string;
}

export type Tracklist = ActivitySong[];

export type ActivityType = "run" | "ride" | "hike" | "walk" | "other";

export interface Activity {
  // Required (Common to ALL)
  id: string;
  type: ActivityType;
  name: string;
  date: string; // ISO 8601 format
  durationInSeconds: number;

  // Optional (Specific to some)
  distanceInMeters?: number;
  elevationGainInMeters?: number;
  averageHeartRate?: number;
  averageSpeedKph?: number;
  pace?: string;
  polyline?: string;
}

interface DataContextType {
  activities: Activity[];
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

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

  const value = { activities, loading };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
