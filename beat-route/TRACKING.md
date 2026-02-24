# BeatRoute — GPS Activity Tracking Feature Plan

## Context

BeatRoute currently syncs and visualizes activities imported from Strava. This plan adds a native in-app recording feature — like Strava's record screen — allowing users to track runs, rides, hikes, and walks directly from BeatRoute using the device GPS. The recorded route is stored locally on-device, exportable as a .gpx file, and appears in the home feed alongside Strava-synced activities.

---

## Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| Map library | `react-native-maps` (already installed) | Sufficient for standard/satellite/hybrid styles; no new native dep |
| GPS library | `expo-location` (add explicitly to package.json) | Expo-managed, handles foreground + background; transitive dep already present |
| Background tracking | YES — `expo-task-manager` background task | Strava-like behavior; must register task at module load time |
| Storage | Local only — `expo-file-system` | One JSON file per activity in `documentDirectory/beatroute-activities/` |
| GPX export | YES — `expo-sharing` | Generate GPX XML string, write to cache, share via OS share sheet |
| State management | New hook `useActivityRecording` + local screen state | Keeps recording logic isolated; no new context needed |
| Local activities in home feed | Merged with Supabase activities, badge-differentiated | Consistent UX; local activities show a small "BeatRoute" label |

---

## New Dependencies to Add

```bash
npx expo install expo-location expo-file-system expo-task-manager expo-sharing
```

These are already present as transitive deps but must be explicitly declared in `package.json` so they are locked to the correct SDK 54 versions.

---

## app.json Changes (Required Before Phase 3 Testing)

Add to `app.json` — requires `npx expo prebuild --clean` + rebuild afterward:

```json
{
  "ios": {
    "infoPlist": {
      "NSLocationWhenInUseUsageDescription": "BeatRoute uses your location to track your activity route.",
      "NSLocationAlwaysAndWhenInUseUsageDescription": "BeatRoute tracks your location in the background to record your full route even when the screen is locked.",
      "NSLocationAlwaysUsageDescription": "BeatRoute tracks your location in the background to record your full route even when the screen is locked.",
      "UIBackgroundModes": ["location", "fetch"]
    }
  },
  "android": {
    "permissions": [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_BACKGROUND_LOCATION",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_LOCATION"
    ]
  },
  "plugins": [
    ["expo-location", {
      "locationAlwaysAndWhenInUsePermission": "BeatRoute tracks your location in the background to record your full route even when the screen is locked.",
      "locationWhenInUsePermission": "BeatRoute uses your location to track your activity route.",
      "isAndroidBackgroundLocationEnabled": true,
      "isAndroidForegroundServiceEnabled": true
    }]
  ]
}
```

---

## File Architecture

```
beat-route/
├── app/
│   ├── _layout.tsx              [MODIFY] Register record screen; import background task
│   ├── index.tsx                [MODIFY] Add FAB floating button
│   └── record.tsx               [CREATE] Full recording screen
│
├── hooks/
│   └── useActivityRecording.ts  [CREATE] GPS tracking, timer, stats, state machine
│
├── tasks/
│   └── backgroundLocation.ts    [CREATE] expo-task-manager background GPS task definition
│
├── lib/
│   ├── localActivities.ts       [CREATE] expo-file-system read/write/list/delete
│   ├── gpxExport.ts             [CREATE] GPX XML string generator + expo-sharing export
│   └── activityUtils.ts         [CREATE] Shared getPace / getSpeedKph helpers (moved from api.ts)
│
├── components/
│   └── ActivitySummaryModal.tsx [CREATE] Post-stop save/discard dialog with mini map
│
├── context/
│   └── DataContext.tsx          [MODIFY] Merge local + Supabase activities; add source badge flag
│
└── app.json                     [MODIFY] Permissions + expo-location plugin
```

---

## Data Models

### `Coordinate`
```typescript
interface Coordinate {
  lat: number;
  lng: number;
  alt: number | null;   // meters, from GPS
  timestamp: number;    // ms since epoch
}
```

### `LocalActivity` (stored as JSON on-device)
```typescript
interface LocalActivity {
  id: string;                  // "local-{Date.now()}"
  source: 'local';             // distinguishes from Supabase activities
  type: ActivityType;          // "run" | "ride" | "hike" | "walk"
  name: string;                // user-entered or auto-generated
  startTime: string;           // ISO 8601
  endTime: string;             // ISO 8601
  durationInSeconds: number;
  distanceInMeters: number;
  elevationGainInMeters: number;
  coordinates: Coordinate[];   // full GPS track
  polyline?: string;           // encoded @mapbox/polyline — generated on save
}
```

### Existing `Activity` interface in `DataContext.tsx` — already compatible
The `LocalActivity` maps cleanly to the existing `Activity` interface (same required fields). The `source: 'local'` flag added to `Activity` triggers the home screen badge.

---

## Sequential Implementation Phases

### Phase 1 — Floating Action Button (FAB)
**Goal:** A `+` button in the bottom-right corner of the home screen that navigates to the record screen.

**Files to modify:**
- `app/index.tsx` — add FAB as absolutely-positioned overlay on top of FlatList
- `app/_layout.tsx` — register `record` screen inside `Stack.Protected`

**Key details:**
- Wrap existing `SafeAreaView` content in a `View` with `flex: 1` and `position: 'relative'`
- FAB: `position: 'absolute'`, `bottom: SPACING.large`, `right: SPACING.large`, 56×56, `borderRadius: 28`, `backgroundColor: theme.tint`, elevation/shadow for float effect
- Icon: `<Ionicons name="add" size={28} color="#fff" />` (already used in project)
- Add `contentContainerStyle={{ paddingBottom: 80 }}` to FlatList so last item isn't hidden
- `onPress: () => router.push('/record')`
- Register in `_layout.tsx` as `presentation: 'fullScreenModal'`, `headerShown: false`

**Verify:** FAB appears, taps navigate to blank record screen, list items not clipped.

---

### Phase 2 — Record Screen Shell (Map + Controls, No GPS Yet)
**Goal:** Full-screen map with map-type picker, activity type picker, back-navigation guard, placeholder stats bar, and Start/Pause/Stop buttons.

**Files to create:**
- `app/record.tsx`

**Screen layout:**
```
┌─────────────────────────────────────┐
│ [←]         [STD] [SAT] [HYB]       │ ← top bar (absolute, z=10)
│                                     │
│          MapView (full screen)      │
│          showsUserLocation=true     │
│                                     │
├─────────────────────────────────────┤
│  [Run] [Ride] [Hike] [Walk]         │ ← activity type pills
│                                     │
│  Distance  Duration  Pace  Elev.    │ ← stats bar (placeholder)
│                                     │
│          [  START  ]                │ ← start/stop/pause controls
└─────────────────────────────────────┘
```

**Back navigation guard** using React Navigation's `beforeRemove` event:
- If `isRecording === false` → allow navigation freely
- If `isRecording === true` → `Alert.alert("Discard activity?", ...)` with Keep/Discard options

**Map type picker:** Local `useState<'standard' | 'satellite' | 'hybrid'>('standard')` — three pill buttons mapped to `MapView mapType` prop

**Activity type:** Local `useState<ActivityType>('run')` — four pill buttons (Run, Ride, Hike, Walk)

**Stats bar (Phase 2 = zeros/placeholders):** Four `PropertyValuePair` boxes — Distance, Duration, Pace, Elevation Gain

**Start/Pause/Stop state machine:**
- `idle` → single green "Start" button
- `recording` → "Pause" (yellow) + "Stop" (red) side by side
- `paused` → "Resume" (green) + "Stop" (red) side by side

**Verify:** Map renders, map types switch live, back guard shows alert when recording state is simulated, stats display zeros.

---

### Phase 3 — GPS Location Tracking (Background-capable)
**Goal:** Real-time GPS tracking with live route drawn on map, live stats updating, and background location support.

**app.json changes required** (see above) — run `npx expo prebuild --clean` + rebuild before testing.

**Files to create:**
- `tasks/backgroundLocation.ts`
- `hooks/useActivityRecording.ts`

**Files to modify:**
- `app/_layout.tsx` — add `import '@/tasks/backgroundLocation'` at the very top (before any component code) — this is required by expo-task-manager; the task must be registered synchronously at module load time

#### `tasks/backgroundLocation.ts`
Registers a background task that receives GPS points when app is backgrounded. Uses a module-level callback ref so the foreground hook can subscribe to updates:

```typescript
export const BACKGROUND_LOCATION_TASK = 'background-location-task';
export let backgroundLocationCallback: ((locs: Location.LocationObject[]) => void) | null = null;
export function setBackgroundLocationCallback(cb: typeof backgroundLocationCallback) {
  backgroundLocationCallback = cb;
}

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
  if (data?.locations) backgroundLocationCallback?.(data.locations);
});
```

#### `hooks/useActivityRecording.ts`
Core hook — manages all recording state and exposes a clean API:

**Exposed API:**
```typescript
{
  status: 'idle' | 'recording' | 'paused',
  displayCoordinates: Coordinate[],
  elapsedSeconds: number,
  distanceMeters: number,
  elevationGainMeters: number,
  paceString: string,        // "5'23"/km" for runs, "28.4 km/h" for rides
  startRecording: () => Promise<void>,
  pauseRecording: () => void,
  resumeRecording: () => Promise<void>,
  stopRecording: () => RecordedActivityData,
}
```

**Internals:**
- `coordinatesRef` (useRef) — full GPS track, not in state to avoid re-render on every point
- `elapsedSecondsRef` (useRef) — survives pause/resume cycles
- `distanceMeters` / `elevationGainMeters` (useState) — incremental, updated on each new point
- Foreground: `Location.watchPositionAsync({ accuracy: BestForNavigation, distanceInterval: 5, timeInterval: 3000 })`
- Background: `Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, { ... })` + callback registration
- Deduplication: skip incoming point if its timestamp is within 500ms of the last recorded point (prevents double-counting when both foreground and background fire)
- Haversine distance (pure function, same file): incremental delta added per new point
- Elevation gain: sum of positive altitude deltas between consecutive points

**Permission flow:**
1. Request foreground (`Location.requestForegroundPermissionsAsync()`)
2. Request background (`Location.requestBackgroundPermissionsAsync()`) — if denied, continue with foreground-only + show informational banner

**Cleanup on unmount:** remove foreground subscription, stop background task, clear timer, null the callback ref.

**Stats calculations:**
- **Distance:** Haversine formula, accumulated incrementally
- **Duration:** `setInterval` every 1s, paused when `pauseRecording` is called
- **Pace (runs/hikes/walks):** `(elapsedSeconds / 60) / (distanceMeters / 1000)` → formatted as `M'SS"/km`
- **Speed (rides):** `(distanceMeters / 1000) / (elapsedSeconds / 3600)` → formatted as `X.X km/h`
- **Elevation gain:** sum of `max(0, alt[i] - alt[i-1])` across all consecutive coordinate pairs

**Live route on map** — add to `record.tsx`:
```tsx
{displayCoordinates.length > 1 && (
  <MapPolyline  // react-native-maps Polyline
    coordinates={displayCoordinates.map(c => ({ latitude: c.lat, longitude: c.lng }))}
    strokeColor={theme.tint}
    strokeWidth={4}
    lineCap="round"
  />
)}
```

**Verify:** Start recording, walk/move device. Route polyline appears on map. Background app, move, foreground — route has continued. Pause stops timer and GPS. Stats update correctly.

---

### Phase 4 — Save Activity to Local Storage
**Goal:** After stopping, show a summary modal, let user name the activity, save to device storage, and display in home feed with a "BeatRoute" badge.

**Files to create:**
- `lib/localActivities.ts`
- `lib/gpxExport.ts` *(stub only — fully implemented in Phase 5)*
- `components/ActivitySummaryModal.tsx`

**Files to modify:**
- `context/DataContext.tsx` — merge local activities into feed
- `components/ActivityPreview.tsx` — add source badge

#### `lib/localActivities.ts`
Storage directory: `{documentDirectory}/beatroute-activities/{id}.json`

Key functions:
- `saveLocalActivity(activity: LocalActivity): Promise<void>`
- `loadLocalActivities(): Promise<LocalActivity[]>` — reads all JSON files, sorts newest first
- `deleteLocalActivity(id: string): Promise<void>`

Use `import * as FileSystem from 'expo-file-system/legacy'` for `writeAsStringAsync` / `readAsStringAsync` / `documentDirectory` API.

#### `components/ActivitySummaryModal.tsx`
React Native `Modal` (`animationType="slide"`, full-screen). Shown when user taps Stop.

Contents:
1. Small static `MapView` showing the completed route polyline (uses `fitToCoordinates` via ref in `onMapReady`)
2. Stats summary row: Distance, Duration, Pace/Speed, Elevation Gain — using `PropertyValuePair`
3. `TextInput` for activity name — pre-filled: `"Morning Run"`, `"Afternoon Ride"` etc. based on hour-of-day + type
4. "Save" button → calls `saveLocalActivity`, triggers `DataContext.refresh()`, navigates back
5. "Discard" button → navigates back without saving

#### `DataContext.tsx` changes
Extend `Activity` interface with optional `source?: 'strava' | 'local'` field.

In `loadData` and `refresh`, merge both sources:
```typescript
const [supabaseData, localData] = await Promise.all([
  fetchActivities(),
  loadLocalActivities(),
]);
const mappedLocal: Activity[] = localData.map(la => ({ ...la, source: 'local' }));
const merged = [...supabaseData, ...mappedLocal]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
setActivities(merged);
```

#### `ActivityPreview.tsx` badge
When `item.source === 'local'`, render a small pill label "BeatRoute" next to the activity name (or in a corner of the card).

**Verify:** Complete a recording, save as "Test Run". Home screen shows "Test Run" with BeatRoute badge at the top. Kill and reopen app — activity persists. Strava activities still appear below.

---

### Phase 5 — GPX Export
**Goal:** Export recorded route as a standard `.gpx` file via the OS share sheet.

**Files to create/complete:**
- `lib/gpxExport.ts`

**Files to modify:**
- `lib/localActivities.ts` — add `exportActivityAsGpx` function
- `components/ActivitySummaryModal.tsx` — add Export button after save

#### `lib/gpxExport.ts`
Pure function — generates valid GPX 1.1 XML string from coordinates:

```typescript
export function generateGpxString(coordinates: Coordinate[], options: {
  name: string;
  type: 'running' | 'cycling' | 'hiking' | 'walking' | 'other';
  startTime: string;
}): string { ... }
```

Each `<trkpt>` includes `lat`, `lon`, optional `<ele>` (if altitude available), and `<time>` (ISO from timestamp).

#### Export flow in `localActivities.ts`
```typescript
export async function exportActivityAsGpx(activity: LocalActivity): Promise<void> {
  const gpxString = generateGpxString(activity.coordinates, { ... });
  const filePath = `${FileSystem.cacheDirectory}${activity.id}.gpx`;
  await FileSystem.writeAsStringAsync(filePath, gpxString, { encoding: 'utf8' });
  await Sharing.shareAsync(filePath, {
    mimeType: 'application/gpx+xml',
    UTI: 'com.topografix.gpx',
  });
}
```

#### Export button placement
Primary: In `ActivitySummaryModal` after saving — "Export GPX" button calls `exportActivityAsGpx`.

Future enhancement: Add an Export button to the activity detail screen for previously saved local activities (requires loading the full coordinate array from the JSON file by activity ID).

**Verify:** Save a recording, tap "Export GPX". iOS share sheet appears with a `.gpx` file. Import the file into Strava or open in a GPX viewer — route, timestamps, and elevation are correct.

---

## Technical Gotchas

1. **Background task registration**: `import '@/tasks/backgroundLocation'` must be at the top of `app/_layout.tsx` before any component definitions. expo-task-manager requires synchronous module-load-time registration. A lazy import or import inside a component will cause a "Task not defined" crash.

2. **`expo-file-system` import**: Use `import * as FileSystem from 'expo-file-system/legacy'` to access `writeAsStringAsync` / `readAsStringAsync` / `documentDirectory`. The newer non-legacy API uses a class-based `File`/`Directory` pattern that is incompatible with the procedural approach planned here.

3. **Rebuild after `app.json` changes**: The project has native `ios/` and `android/` directories. Expo config plugin changes only apply after `npx expo prebuild --clean`. Run this before testing Phase 3 GPS features. Skipping this step means permissions and background modes won't be registered with iOS/Android.

4. **Foreground + background deduplication**: Both `watchPositionAsync` (foreground) and the background task can fire simultaneously when the app is active. Use a `lastTimestamp` ref; if the incoming coordinate's timestamp is within 500ms of the last one, discard it.

5. **Android background location UX**: On Android 11+, `ACCESS_BACKGROUND_LOCATION` requires the user to manually enable "Allow all the time" in Settings — the system permission dialog only offers "Allow while using app." Handle gracefully: if background permission is denied, fall back to foreground-only tracking with a visible banner informing the user.

6. **`@mapbox/polyline` argument order**: `polyline.encode()` expects `[lat, lng]` tuples (not `{lat, lng}` objects). Use `coordinates.map(c => [c.lat, c.lng])` when encoding on save.

7. **`MapView.fitToCoordinates` timing**: Call this in the `onMapReady` callback (or via a `setTimeout` of ~200ms) when the summary modal map renders. Calling it immediately on mount will silently no-op before the native map is ready.

---

## End-to-End Verification Checklist

- [ ] FAB appears on home screen, bottom-right, above list content
- [ ] Tapping FAB navigates to record screen
- [ ] Map renders full-screen with user location dot
- [ ] Map type pills switch between Standard, Satellite, Hybrid
- [ ] Activity type pills work (Run, Ride, Hike, Walk)
- [ ] Back button when idle → dismisses freely
- [ ] Back button when recording → shows "Discard activity?" alert
- [ ] Tapping Start → stats begin counting (distance, time, pace, elevation)
- [ ] Route polyline draws on map as user moves
- [ ] Background app, move, foreground → polyline has continued
- [ ] Pause stops timer and GPS; Resume continues both
- [ ] Stop shows ActivitySummaryModal with mini map and stats
- [ ] Save writes activity to device storage and home screen refreshes
- [ ] BeatRoute badge visible on locally recorded activities in home feed
- [ ] Kill and reopen app → local activities still appear
- [ ] Export GPX → share sheet opens with valid .gpx file
- [ ] Import .gpx into external viewer → correct route and timestamps
