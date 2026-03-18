# React Concepts Guide — For This Project

> You're new to React. This guide explains the key concepts used in this project and then walks you through the step-by-step order to build it.

---

## Part 1: Key React Concepts

---

### 1. What is React?

React is a JavaScript library for building user interfaces. Instead of writing HTML pages, you write **components** — small, reusable building blocks that each handle one piece of the UI.

**Example**: In this project, `SongCard` is a component. It knows how to display one song. The Feed page uses it over and over, once for each song.

---

### 2. Components

A component is just a **function that returns HTML-like code** (called JSX).

```tsx
// A simple component
function SongCard() {
  return (
    <div className="bg-card rounded-xl p-4">
      <h2 className="text-txt-primary">Song Title</h2>
      <p className="text-txt-secondary">Artist Name</p>
    </div>
  );
}
```

**Rules:**
- Component names start with a capital letter (`SongCard`, not `songCard`)
- Every component must return JSX (the HTML-like code)
- A component can use other components inside it

---

### 3. JSX

JSX looks like HTML but it's actually JavaScript. A few things to know:

| HTML | JSX |
|------|-----|
| `class="..."` | `className="..."` |
| `for="..."` | `htmlFor="..."` |
| `<img>` | `<img />` (must be self-closed) |
| JavaScript goes in `{}` | `<p>{artist.name}</p>` |

```tsx
// Using a variable inside JSX
const title = "Hogyha megkérdezed";

return <h2>{title}</h2>;  // renders: Hogyha megkérdezed
```

---

### 4. Props — Passing Data Into Components

Props are like arguments to a function. They let you pass data **into** a component from outside.

```tsx
// Define what props the component accepts
type SongCardProps = {
  title: string;
  artist: string;
  albumArt: string;
};

// Use props inside the component
function SongCard({ title, artist, albumArt }: SongCardProps) {
  return (
    <div className="bg-card rounded-xl p-4">
      <img src={albumArt} alt={title} />
      <h2 className="text-txt-primary">{title}</h2>
      <p className="text-txt-secondary">{artist}</p>
    </div>
  );
}

// Use the component and pass props
<SongCard
  title="Hogyha megkérdezed"
  artist="AWS"
  albumArt="https://..."
/>
```

Think of it like: the Feed page **gives** the SongCard the song data, and the SongCard **displays** it.

---

### 5. State — Data That Changes

State is data that **can change** and when it changes, React **re-renders** the component automatically.

You create state with the `useState` hook:

```tsx
import { useState } from 'react';

function SongCard() {
  // isPlaying is the current value, setIsPlaying is how you change it
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
```

**Key rule**: Never change state directly (like `isPlaying = true`). Always use the setter function (`setIsPlaying(true)`).

---

### 6. useEffect — Running Code at the Right Time

`useEffect` runs code **after** a component renders. Used for:
- Fetching data from an API
- Setting up an audio player
- Syncing with localStorage

```tsx
import { useEffect, useState } from 'react';

function ArtistProfilePage({ artistId }: { artistId: string }) {
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    // This runs after the component first appears on screen
    fetch(`/api/artists/${artistId}`)
      .then(res => res.json())
      .then(data => setArtist(data));
  }, [artistId]); // Re-runs if artistId changes

  if (!artist) return <p>Loading...</p>;

  return <h1>{artist.name}</h1>;
}
```

The `[]` at the end is the **dependency array**:
- `[]` = run once when component appears
- `[artistId]` = run again when `artistId` changes
- No array = run every single render (usually wrong)

---

### 7. React Router — Multiple Pages

React is a single-page app by default, but React Router lets you create the illusion of multiple pages.

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<FeedPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/artist/:id"  element={<ArtistProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

To **navigate** between pages:
```tsx
import { Link, useNavigate } from 'react-router-dom';

// As a link (like an anchor tag)
<Link to="/login">Login</Link>

// Programmatically (after form submit)
const navigate = useNavigate();
navigate('/feed');
```

To **read the `:id` from the URL**:
```tsx
import { useParams } from 'react-router-dom';

function ArtistProfilePage() {
  const { id } = useParams(); // gets the :id from /artist/:id
}
```

---

### 8. Context API — Sharing Data Across the App

Some data (like "is the user logged in?") needs to be available **everywhere** in the app. React Context solves this without passing props down through every component.

**Step 1: Create the context**
```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
```

**Step 2: Create the Provider (wraps your app)**
```tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Step 3: Use it anywhere**
```tsx
export function useAuth() {
  return useContext(AuthContext)!;
}

// In any component:
function Navbar() {
  const { user, logout } = useAuth();
  return <button onClick={logout}>{user ? 'Logout' : 'Login'}</button>;
}
```

---

### 9. Custom Hooks — Reusable Logic

A custom hook is a function that starts with `use` and contains React logic. It lets you reuse the same logic across multiple components.

```tsx
// src/hooks/useArtist.ts
import { useState, useEffect } from 'react';

export function useArtist(artistId: string) {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/artists/${artistId}`)
      .then(res => res.json())
      .then(data => { setArtist(data); setLoading(false); })
      .catch(err => { setError(err); setLoading(false); });
  }, [artistId]);

  return { artist, loading, error };
}

// Use it in a component:
function ArtistProfilePage() {
  const { id } = useParams();
  const { artist, loading, error } = useArtist(id!);

  if (loading) return <SkeletonCard />;
  if (error)   return <p>Error loading artist</p>;
  return <h1>{artist.name}</h1>;
}
```

---

### 10. React Query — Server State Made Easy

React Query is a library that handles fetching, caching, and updating server data. It replaces the `useState` + `useEffect` pattern for API calls.

```tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define a fetcher function
const fetchFeed = () => axios.get('/api/feed').then(res => res.data);

// Use it in a component
function FeedPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['feed'],       // unique cache key
    queryFn: fetchFeed,       // the function that fetches data
  });

  if (isLoading) return <SkeletonFeed />;
  if (isError)   return <p>Failed to load feed</p>;

  return (
    <div>
      {data.map(post => <SongCard key={post.id} {...post} />)}
    </div>
  );
}
```

**Why use React Query instead of useEffect?**
- Automatic caching (data is remembered, no re-fetch on re-visit)
- Loading and error states built-in
- Refetch on window focus
- Optimistic updates for comments/follows

---

### 11. TypeScript with React

TypeScript adds **types** to JavaScript so you catch mistakes before running the code. In this project, everything is `.tsx` (TypeScript + JSX).

```tsx
// Define the shape of your data
type Song = {
  id: number;
  title: string;
  artist: string;
  previewUrl: string;
  albumArt: string;
};

// Type the props of a component
type SongCardProps = {
  song: Song;
  onPlay: (id: number) => void;
};

function SongCard({ song, onPlay }: SongCardProps) {
  return (
    <div onClick={() => onPlay(song.id)}>
      <h2>{song.title}</h2>
    </div>
  );
}
```

TypeScript will warn you if you forget a required prop, pass the wrong type, or misuse a variable.

---

### 12. Tailwind CSS with React

Tailwind is a utility-first CSS library. Instead of writing a `.css` file, you add small class names directly to your JSX.

```tsx
// Without Tailwind (you'd need a separate CSS file)
<div class="song-card">...</div>

// With Tailwind (everything inline)
<div className="bg-card rounded-xl p-4 shadow hover:scale-[1.02] transition-transform duration-200">
  ...
</div>
```

**Common classes used in this project:**
| Class | What it does |
|-------|-------------|
| `bg-card` | Sets background to `#181818` (configured in tailwind.config.js) |
| `text-txt-primary` | White text |
| `text-txt-secondary` | Grey text |
| `text-accent` | Green accent color |
| `rounded-xl` | Rounded corners |
| `p-4` | Padding: 1rem on all sides |
| `flex`, `flex-col` | Flexbox layout |
| `gap-4` | Gap between flex/grid children |
| `hover:scale-[1.02]` | Scale up slightly on hover |
| `transition-transform duration-200` | Smooth animation |

---

## Part 2: Project Folder Structure Explained

```
src/
├── components/          # Reusable UI pieces (used in multiple pages)
│   ├── SongCard.tsx
│   ├── ArtistCard.tsx
│   ├── ConcertCard.tsx
│   ├── CommentSection.tsx
│   ├── Navbar.tsx
│   └── SkeletonCard.tsx
│
├── pages/               # Full pages (one per route)
│   ├── FeedPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ArtistProfilePage.tsx
│   └── ConcertsPage.tsx
│
├── api/                 # Functions that make HTTP requests
│   ├── auth.ts          # login(), register()
│   ├── artists.ts       # getArtist(), followArtist()
│   ├── feed.ts          # getFeed(), getFollowingFeed()
│   └── songs.ts         # getSong(), createSongPost()
│
├── hooks/               # Custom hooks (reusable logic)
│   ├── useAuth.ts
│   ├── useFeed.ts
│   └── useArtist.ts
│
├── contexts/            # Global state providers
│   └── AuthContext.tsx
│
├── types/               # TypeScript type definitions
│   └── index.ts         # Song, Artist, Concert, User types
│
├── App.tsx              # Root component: sets up Router + Providers
└── main.tsx             # Entry point: mounts App into index.html
```

---

## Part 3: Step-by-Step Build Order

Follow this order — each step builds on the previous one.

---

### Step 1 — Project Setup (Epic 1)
1. Create the Vite + React + TypeScript project
2. Configure Tailwind with your dark color palette
3. Set up the folder structure
4. Create a simple `App.tsx` that shows a dark page

**Goal**: See a black screen in the browser. That's your design system working.

---

### Step 2 — Design System Tokens
1. Set up `tailwind.config.js` with all your custom colors (`bg-app`, `bg-card`, `accent`, etc.)
2. Write global styles in `index.css` (body background, font)
3. Create a basic `Navbar.tsx` component with your logo

**Goal**: You can use `className="bg-card text-txt-primary"` and it works.

---

### Step 3 — Routing
1. Install `react-router-dom`
2. Add `<BrowserRouter>` and `<Routes>` to `App.tsx`
3. Create empty placeholder page components: `FeedPage`, `LoginPage`, `RegisterPage`
4. Add routes for `/`, `/login`, `/register`

**Goal**: Navigating to `/login` in the browser shows the LoginPage.

---

### Step 4 — Auth Context
1. Create `AuthContext.tsx` with `user`, `login()`, `logout()`
2. Wrap `App.tsx` with `<AuthProvider>`
3. Create the `useAuth()` hook
4. Create `PrivateRoute` component

**Goal**: Any component can call `useAuth()` to check if user is logged in.

---

### Step 5 — Login & Register Pages (Epic 2)
1. Build `RegisterPage` with dark form
2. Build `LoginPage` with dark form
3. Connect to backend API using Axios
4. On login success: call `useAuth().login()`, store token, redirect to feed
5. Add loading state and error state to both forms

**Goal**: You can create an account and log in. JWT token is stored in localStorage.

---

### Step 6 — API Layer
1. Create `src/api/auth.ts` with `register()` and `login()` functions using Axios
2. Set up Axios to attach JWT token to all requests automatically (Axios interceptor):
   ```ts
   axios.interceptors.request.use(config => {
     const token = localStorage.getItem('token');
     if (token) config.headers.Authorization = `Bearer ${token}`;
     return config;
   });
   ```

**Goal**: All API calls automatically send the auth token.

---

### Step 7 — React Query Setup
1. Install `@tanstack/react-query`
2. Add `<QueryClientProvider>` to `App.tsx`
3. Set up React Query DevTools for debugging

**Goal**: React Query is ready to use in components.

---

### Step 8 — SongCard Component (Epic 4)
1. Define `Song` type in `src/types/index.ts`
2. Build `SongCard.tsx` with: album art, title, artist, play button, like button
3. Add hover animation (`hover:scale-[1.02] transition-transform`)
4. Wire up the HTML5 audio player with play/pause state
5. Ensure only one song plays at a time (manage state in parent)
6. Add `SkeletonCard.tsx` for loading state

**Goal**: You can import `<SongCard song={...} />` and it looks and works correctly.

---

### Step 9 — Feed Page (Epic 5)
1. Create `src/api/feed.ts` with `getGlobalFeed()` function
2. Create `useFeed()` custom hook using React Query
3. Build `FeedPage` that shows a list of `SongCard` components
4. Add "Discover" and "Following" tabs
5. Add loading skeleton and empty state

**Goal**: Visit `/` and see a working feed of songs.

---

### Step 10 — Artist Profile (Epic 3)
1. Build `ArtistCard.tsx` component
2. Build `ArtistProfilePage.tsx`
3. Add follow/unfollow button with instant feedback
4. Link artist name in `SongCard` to their profile page

---

### Step 11 — Concerts (Epic 6)
1. Build `ConcertCard.tsx`
2. Build `ConcertsPage.tsx` with city filter
3. Connect to backend

---

### Step 12 — Comments (Epic 7)
1. Build `CommentSection.tsx`
2. Add it below each `SongCard`
3. Add optimistic UI with React Query mutations

---

### Step 13 — City Feeds (Epic 8)
1. Build `CityFeedPage.tsx`
2. Add city selector to `Navbar`

---

### Step 14 — Polish (Epic 9)
1. Add `react-hot-toast` with dark theme
2. Add loading and error states everywhere
3. Test on mobile — make layout responsive

---

### Step 15 — Deploy (Epic 10)
1. Deploy database to Supabase
2. Deploy backend to Railway
3. Deploy frontend to Vercel

---

## Key Things to Remember

- **Component** = a function that returns JSX
- **Props** = data passed INTO a component (read-only)
- **State** = data that lives INSIDE a component and can change
- **useEffect** = run code after render (for API calls, timers)
- **Context** = global state shared across the app (like auth)
- **React Query** = handles all API calls with caching + loading/error states
- **Tailwind** = write CSS as class names directly in JSX

When something doesn't work, React shows the error clearly in the browser console. Read the error, then Google the exact message — React errors are very well documented.
