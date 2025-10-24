
// This file acts as a mock database for our activities.

export interface Activity {
  id: string;
  name: string;
  artist: string;
  songCount: number;
  tracklist: { song: string; artist: string }[];
}

// --- The full, detailed data ---
const ACTIVITIES_DB: Activity[] = [
  {
    id: '1',
    name: 'Boiler Room: London',
    artist: 'Fred Again..',
    songCount: 12,
    tracklist: [
      { song: 'Marea (We’ve Lost Dancing)', artist: 'Fred Again..' },
      { song: 'Billie (Loving Arms)', artist: 'Fred Again..' },
      { song: 'Kammy (Like I Do)', artist: 'Fred Again..' },
      // ... more songs
    ],
  },
  {
    id: '2',
    name: 'EDC Las Vegas 2023',
    artist: 'John Summit',
    songCount: 18,
    tracklist: [
      { song: 'Where You Are', artist: 'John Summit' },
      { song: 'La Danza', artist: 'John Summit' },
      { song: 'What A Life', artist: 'John Summit' },
      // ... more songs
    ],
  },
  {
    id: '3',
    name: 'Live at Red Rocks',
    artist: 'Odesza',
    songCount: 22,
    tracklist: [
      { song: 'A Moment Apart', artist: 'Odesza' },
      { song: 'Bloom', artist: 'Odesza' },
      { song: 'Say My Name', artist: 'Odesza' },
      // ... more songs
    ],
  },
];

// --- API Functions ---

/**
 * Simulates fetching the lightweight list of activities for the home screen.
 * Note: It omits the heavy `tracklist` field.
 */
export const getActivities = async () => {
  console.log('FETCHING: Lightweight activity list...');
  // In a real app, this would be: supabase.from('activities').select('id, name, artist, songCount')
  const lightweightActivities = ACTIVITIES_DB.map(({ id, name, artist, songCount }) => ({
    id,
    name,
    artist,
    songCount,
  }));
  return new Promise(resolve => setTimeout(() => resolve(lightweightActivities), 500));
};

/**
 * Simulates fetching the full details for a single activity.
 */
export const getActivityById = async (id: string) => {
  console.log(`FETCHING: Full details for activity ID: ${id}...`);
  // In a real app, this would be: supabase.from('activities').select('*').eq('id', id).single()
  const activity = ACTIVITIES_DB.find(a => a.id === id);
  return new Promise(resolve => setTimeout(() => resolve(activity || null), 800));
};
