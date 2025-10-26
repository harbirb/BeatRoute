import { Activity, RunActivity, RideActivity } from "@/context/DataContext";

// --- The full, detailed data, conforming to the new types ---
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "run1",
    type: "run",
    name: "Morning 5k Run",
    date: "2023-10-24T08:00:00Z",
    distanceInMeters: 5000,
    durationInSeconds: 1500, // 25 minutes
    pace: "5'00\"/km",
    elevationGainInMeters: 50,
    averageHeartRate: 145,
    tracklist: [
      {
        id: "song1-1",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        url: "https://example.com/blinding-lights",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-1",
        title: "Levitating",
        artists: ["Dua Lipa"],
        url: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-2",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        url: "https://example.com/blinding-lights",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-2",
        title: "Levitating",
        artists: ["Dua Lipa"],
        url: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-3",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        url: "https://example.com/blinding-lights",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-3",
        title: "Levitating",
        artists: ["Dua Lipa"],
        url: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-4",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        url: "https://example.com/blinding-lights",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-4",
        title: "Levitating",
        artists: ["Dua Lipa"],
        url: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-5",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        url: "https://example.com/blinding-lights",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-5",
        title: "Levitating",
        artists: ["Dua Lipa"],
        url: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-6",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        url: "https://example.com/blinding-lights",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-6",
        title: "Levitating",
        artists: ["Dua Lipa"],
        url: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-7",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        url: "https://example.com/blinding-lights",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-7",
        title: "Levitating",
        artists: ["Dua Lipa"],
        url: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-8",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        url: "https://example.com/blinding-lights",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-8",
        title: "Levitating",
        artists: ["Dua Lipa"],
        url: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
      {
        id: "song1-9",
        title: "Blinding Lights",
        artists: ["The Weeknd"],
        url: "https://example.com/blinding-lights",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
      },
      {
        id: "song2-9",
        title: "Levitating",
        artists: ["Dua Lipa"],
        url: "https://open.spotify.com/track/017PF4Q3l4DBUiWoXk4OWT",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
      },
    ],
  },
  {
    id: "ride1",
    type: "ride",
    name: "City Loop Ride",
    date: "2023-10-23T17:00:00Z",
    distanceInMeters: 20000,
    durationInSeconds: 3600, // 1 hour
    averageSpeedKph: 20,
    elevationGainInMeters: 150,
    tracklist: [
      {
        id: "song3",
        title: "Watermelon Sugar",
        artists: ["Harry Styles"],
        url: "https://example.com/watermelon-sugar",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e02f4c3b0d6f8e8e8e8e8e8e8e8",
      },
      {
        id: "song4",
        title: "Don't Start Now",
        artists: ["Dua Lipa"],
        url: "https://example.com/dont-start-now",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e02c5f5b0d6f8e8e8e8e8e8e8e8",
      },
      {
        id: "song5",
        title: "Circles",
        artists: ["Post Malone"],
        url: "https://example.com/circles",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e02d6f6b0d6f8e8e8e8e8e8e8e8",
      },
    ],
  },
  {
    id: "run2",
    type: "run",
    name: "Rainy Afternoon Jog",
    date: "2023-10-22T15:30:00Z",
    distanceInMeters: 3000,
    durationInSeconds: 960, // 16 minutes
    pace: "5'20\"/km",
    tracklist: [
      {
        id: "song6",
        title: "Shape of You",
        artists: ["Ed Sheeran"],
        url: "https://example.com/shape-of-you",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e02b7e7b0d6f8e8e8e8e8e8e8e8",
      },
      {
        id: "song7",
        title: "Senorita",
        artists: ["Shawn Mendes", "Camila Cabello"],
        url: "https://example.com/senorita",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e02a8d8b0d6f8e8e8e8e8e8e8e8",
      },
    ],
  },
];

// --- API Functions ---

/**
 * Simulates fetching the full list of activities.
 */
export const getActivities = async (): Promise<Activity[]> => {
  // console.log('FETCHING: Full mock activity list...');
  // In a real app, this would be: supabase.from('activities').select('*')
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_ACTIVITIES), 500)
  );
};

/**
 * Simulates fetching the full details for a single activity.
 * In our new pattern, this is less likely to be used if the provider is caching,
 * but it's good to have for the list-detail pattern.
 */
export const getActivityById = async (id: string): Promise<Activity | null> => {
  // console.log(`FETCHING: Full details for activity ID: ${id}...`);
  const activity = MOCK_ACTIVITIES.find((a) => a.id === id) || null;
  return new Promise((resolve) => setTimeout(() => resolve(activity), 200)); // Faster since it's a 'find'
};
