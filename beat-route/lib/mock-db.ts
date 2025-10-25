import { Activity, RunActivity, RideActivity } from "@/context/DataContext";

// --- The full, detailed data, conforming to the new types ---
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'run1',
    type: 'run',
    name: 'Morning 5k Run',
    date: '2023-10-24T08:00:00Z',
    distanceInMeters: 5000,
    durationInSeconds: 1500, // 25 minutes
    pace: '5\'00"/km',
    tracklist: [
      { id: 'song1', title: 'Blinding Lights', artist: 'The Weeknd' },
      { id: 'song2', title: 'Levitating', artist: 'Dua Lipa' },
    ],
  },
  {
    id: 'ride1',
    type: 'ride',
    name: 'City Loop Ride',
    date: '2023-10-23T17:00:00Z',
    distanceInMeters: 20000,
    durationInSeconds: 3600, // 1 hour
    averageSpeedKph: 20,
    elevationGainInMeters: 150,
    tracklist: [
      { id: 'song3', title: 'As It Was', artist: 'Harry Styles' },
      { id: 'song4', title: 'Good 4 U', artist: 'Olivia Rodrigo' },
      { id: 'song5', title: 'Bad Habits', artist: 'Ed Sheeran' },
    ],
  },
  {
    id: 'run2',
    type: 'run',
    name: 'Rainy Afternoon Jog',
    date: '2023-10-22T15:30:00Z',
    distanceInMeters: 3000,
    durationInSeconds: 960, // 16 minutes
    pace: '5\'20"/km',
    tracklist: [
      { id: 'song6', title: 'Shivers', artist: 'Ed Sheeran' },
    ],
  },
];

// --- API Functions ---

/**
 * Simulates fetching the full list of activities.
 */
export const getActivities = async (): Promise<Activity[]> => {
  console.log('FETCHING: Full mock activity list...');
  // In a real app, this would be: supabase.from('activities').select('*')
  return new Promise(resolve => setTimeout(() => resolve(MOCK_ACTIVITIES), 500));
};

/**
 * Simulates fetching the full details for a single activity.
 * In our new pattern, this is less likely to be used if the provider is caching,
 * but it's good to have for the list-detail pattern.
 */
export const getActivityById = async (id: string): Promise<Activity | null> => {
  console.log(`FETCHING: Full details for activity ID: ${id}...`);
  const activity = MOCK_ACTIVITIES.find(a => a.id === id) || null;
  return new Promise(resolve => setTimeout(() => resolve(activity), 200)); // Faster since it's a 'find'
};
