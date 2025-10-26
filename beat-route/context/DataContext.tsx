import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  use,
} from "react";
import { getActivities } from "@/lib/mock-db";

export interface Song {
  id: string;
  title: string;
  artists: string[];
  url: string;
  imageUrl: string;
}

export type Tracklist = Song[];

// Base interface with common fields for all activities
interface ActivityBase {
  id: string;
  name: string;
  date: string; // ISO 8601 format
  tracklist: Tracklist;
  averageHeartRate?: number;
  elevationGainInMeters?: number;
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
  // In the future, could add functions like:
  // addActivity: (activity: Activity) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- 4. Create the Provider ---

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMockActivities = async () => {
      setLoading(true);

      // TODO: 1. Replace this mock call with a real Supabase API call.
      const mockData = await getActivities();

      // TODO: 2. When using a real API, need an adapter function here
      // to map the raw API response to app's data types

      setActivities(mockData);
      setLoading(false);
    };

    fetchMockActivities();
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
