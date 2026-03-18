# Hungarian Music Community App — Detailed Development Plan

> **Design System**: Dark mode first, Spotify-inspired. Colors: `#121212` bg, `#181818` cards, `#282828` hover, `#1DB954` accent, `#FFFFFF`/`#B3B3B3`/`#727272` text. Font: Inter. Library: Tailwind CSS + Headless UI.

---

## Epic 1: Project Setup

### Task 1.1 — Initialize React Frontend with Design System
- Run `npm create vite@latest frontend -- --template react-ts`
- Install dependencies:
  - `react-router-dom` — routing between pages
  - `axios` — HTTP requests to backend
  - `@tanstack/react-query` — server state management
  - `tailwindcss` + `postcss` + `autoprefixer` — styling
  - `@headlessui/react` — accessible UI primitives (dropdowns, modals)
  - `react-hot-toast` — success/error toast notifications
- Configure Tailwind with the design system color palette in `tailwind.config.js`:
  ```js
  extend: {
    colors: {
      'app':       '#121212',   // main background
      'card':      '#181818',   // card background
      'hover':     '#282828',   // hover state
      'accent':    '#1DB954',   // green accent (Spotify-style)
      'txt-primary':   '#FFFFFF',
      'txt-secondary': '#B3B3B3',
      'txt-muted':     '#727272',
    }
  }
  ```
- Add Inter font via `<link>` in `index.html` (Google Fonts)
- Set global dark styles in `index.css`:
  - `body { background-color: #121212; color: #FFFFFF; font-family: 'Inter', sans-serif; }`
- Set up folder structure:
  - `src/components/` — reusable UI components (SongCard, ArtistCard, etc.)
  - `src/pages/` — full page components (FeedPage, LoginPage, etc.)
  - `src/api/` — Axios API call functions
  - `src/hooks/` — custom React hooks
  - `src/contexts/` — React Context providers (AuthContext)
  - `src/types/` — TypeScript type definitions
- Create `App.tsx` with:
  - `QueryClientProvider` wrapping the whole app
  - `BrowserRouter` with a placeholder route `/`
  - Root `<div>` with `className="bg-app min-h-screen text-txt-primary"`
- **Definition of Done**: App loads in browser showing a dark (#121212) background with white text

### Task 1.2 — Initialize Spring Boot Backend
- Create project via Spring Initializr with: Spring Web, Spring Security, Spring Data JPA, PostgreSQL Driver, Lombok
- Set up folder structure: `controller/`, `service/`, `repository/`, `model/`, `security/`, `dto/`
- Configure `application.properties` for local PostgreSQL connection
- Verify the app starts with a `/health` endpoint returning 200 OK

### Task 1.3 — Set Up Local PostgreSQL Database
- Create a local PostgreSQL database named `music_community`
- Create a DB user with appropriate permissions
- Connect Spring Boot to the database
- Enable `spring.jpa.hibernate.ddl-auto=update` for development

### Task 1.4 — Connect Frontend to Backend (CORS)
- Configure CORS in Spring Boot to allow requests from `localhost:5173`
- Create a test API endpoint `GET /api/ping`
- Call it from React using Axios to confirm connection works

---

## Epic 2: Authentication

### Task 2.1 — Create User Entity
- Define `User` JPA entity with fields: `id`, `email`, `password`, `name`, `city`, `role`
- Create `UserRepository` extending `JpaRepository`
- Add unique constraint on `email`

### Task 2.2 — Implement Registration Endpoint
- Create `POST /api/auth/register`
- Accept: `email`, `password`, `name`, `city`
- Hash password with BCrypt
- Validate: email format, password length, no duplicate email
- Return: success message or error

### Task 2.3 — Implement Login Endpoint
- Create `POST /api/auth/login`
- Accept: `email`, `password`
- Validate credentials
- Generate JWT token on success
- Return: JWT token + user info

### Task 2.4 — JWT Security Configuration
- Add `jjwt` dependency
- Create `JwtUtil` class: generate, validate, extract claims from token
- Create `JwtFilter` to intercept requests and authenticate via token
- Configure Spring Security: permit `/api/auth/**`, protect everything else

### Task 2.5 — Frontend: Register Page
- Create `/register` route and `RegisterPage` component
- **Design**: Dark card (`bg-card`) centered on page, form fields with dark input styling, accent-colored submit button (`bg-accent text-black`)
- Form fields: name, email, password, city — each with a label and subtle border (`border-hover`)
- POST to `/api/auth/register`
- Show **loading state** on submit button (spinner or "Registering...")
- On success: show green toast, redirect to login
- Show **error state**: inline red error message below each invalid field

### Task 2.6 — Frontend: Login Page
- Create `/login` route and `LoginPage` component
- **Design**: Same dark card layout as Register page — consistent look
- Form fields: email, password
- POST to `/api/auth/login`
- Store JWT in `localStorage`
- Show **loading state** on submit button
- On success: show toast "Welcome back!", redirect to home feed
- Show **error state**: "Invalid email or password" message in red

### Task 2.7 — Frontend: Auth Context
- Create `AuthContext` using React Context API
- Store current user + token
- Provide `login()`, `logout()` methods
- Create `PrivateRoute` component to redirect unauthenticated users to `/login`

---

## Epic 3: Artist Profiles

### Task 3.1 — Create ArtistProfile Entity
- Define `ArtistProfile` JPA entity: `id`, `userId`, `artistName`, `bio`, `imageUrl`, `city`
- One-to-one relationship with `User`
- Create `ArtistProfileRepository`

### Task 3.2 — Create Artist Profile Endpoint
- `POST /api/artists/profile` (protected)
- Logged-in user creates their artist profile
- Validate: user doesn't already have a profile
- Return: created profile

### Task 3.3 — Get Artist Profile Endpoint
- `GET /api/artists/{id}` — public
- Return artist profile + basic stats (follower count, post count)

### Task 3.4 — Follow/Unfollow Artist
- Create `Follow` entity: `id`, `followerId`, `artistId`
- `POST /api/artists/{id}/follow` — follow an artist
- `DELETE /api/artists/{id}/follow` — unfollow
- Both require authentication

### Task 3.5 — Frontend: ArtistCard Component
- Reusable `ArtistCard` component matching the design spec:
  - `bg-card` background, rounded corners, subtle shadow
  - Circular profile image
  - Artist name in `text-txt-primary`, city in `text-txt-secondary`
  - **Follow button**: `bg-accent text-black font-semibold` when not following, outlined when following
  - Hover: card scales to `scale-[1.02]` with smooth transition (`transition-transform duration-200`)
- Follow/unfollow works in 1 click with instant UI feedback (optimistic update)

### Task 3.6 — Frontend: Artist Profile Page
- Create `/artist/:id` route and `ArtistProfilePage`
- **Layout**: Hero section with large profile image + name + city + follower count
- Follow/unfollow button below stats
- Artist's posts listed below in a vertical feed
- **Loading state**: skeleton placeholders while data loads
- **Error state**: "Artist not found" message

### Task 3.7 — Frontend: Create Artist Profile Form
- Create `/create-profile` route (protected, only for users without a profile)
- **Design**: Dark card form, accent-color submit button
- Form: artist name, bio, city, image URL
- POST to `/api/artists/profile`

---

## Epic 4: Song Posts

### Task 4.1 — Create Post and Song Entities
- `Post` entity: `id`, `artistId`, `type` (SONG/CONCERT/UPDATE), `content`, `createdAt`
- `Song` entity: `id`, `postId`, `spotifyId`, `previewUrl`, `title`, `imageUrl`
- One-to-one relationship between `Post` and `Song`

### Task 4.2 — Spotify API Integration (Backend)
- Register app in Spotify Developer Dashboard
- Implement Client Credentials flow to get access token
- Create `SpotifyService` with method: `searchTrack(query)` → returns `spotifyId`, `previewUrl`, `title`, `imageUrl`
- Store Spotify credentials in `application.properties`

### Task 4.3 — Create Song Post Endpoint
- `POST /api/posts/song` (protected, artists only)
- Accept: `content` (caption), `spotifyId`
- Fetch track details from Spotify
- Save Post + Song to DB
- Return: full post with song data

### Task 4.4 — Get Song Post Endpoint
- `GET /api/posts/{id}` — public
- Return post + song data + comment count

### Task 4.5 — Frontend: SongCard Component
- Reusable `SongCard` component matching the design spec:
  - `bg-card` background, rounded-xl, subtle shadow — no heavy borders
  - Album art image (square, rounded corners)
  - Song title in `text-txt-primary font-semibold`
  - Artist name in `text-txt-secondary text-sm` — clickable, links to artist profile
  - Caption text in `text-txt-muted text-sm`
  - **Play/Pause button**: circular `bg-accent` button with icon, plays the 30s preview via HTML5 `<audio>`
  - **Only one song plays at a time** — pause others when a new one starts
  - **Like button**: heart icon, toggles filled/outlined with accent color
  - Hover: card scales `scale-[1.02]`, transition `duration-200`
- **Loading state**: skeleton placeholder card
- **Error state**: "Preview unavailable" gracefully shown

### Task 4.6 — Frontend: Create Song Post Form
- `CreateSongPost` page (protected, artists only)
- **Design**: Dark card form
- Input: Spotify track search or direct Spotify ID
- Preview the track (show album art + title) before posting
- Caption input
- **Loading state** on submit
- Submit to `POST /api/posts/song`
- Show success toast on completion

---

## Epic 5: Feed

### Task 5.1 — Global Feed Endpoint
- `GET /api/feed` — public, paginated
- Return latest posts (all types) sorted by `createdAt` DESC
- Support `?page=0&size=20` query params

### Task 5.2 — Following Feed Endpoint
- `GET /api/feed/following` — protected
- Return posts only from artists the logged-in user follows
- Paginated, sorted by `createdAt` DESC

### Task 5.3 — Frontend: Feed Page
- `FeedPage` at `/` route
- **Layout**: centered vertical scroll feed, max-width container
- Two tabs: "Discover" (global) and "Following" (requires login)
  - Tab underline uses `bg-accent` color, inactive tabs in `text-txt-secondary`
- Infinite scroll or "Load more" button
- Renders `SongCard`, `ConcertCard`, `UpdateCard` based on post type
- **Loading state**: multiple skeleton cards stacked vertically
- **Empty state**: "No posts yet" message with subtle icon
- Fade-in animation on cards as they load (`animate-fadeIn`)

### Task 5.4 — Frontend: React Query Integration
- Set up `QueryClientProvider` in `App.tsx`
- Create custom hooks: `useGlobalFeed()`, `useFollowingFeed()`
- Handle loading states, error states, and empty states in each hook

---

## Epic 6: Concerts

### Task 6.1 — Create Concert Entity
- `Concert` entity: `id`, `postId`, `venue`, `city`, `date`, `ticketUrl`
- One-to-one with `Post`

### Task 6.2 — Create Concert Post Endpoint
- `POST /api/posts/concert` (protected, artists only)
- Accept: `content`, `venue`, `city`, `date`, `ticketUrl`
- Save Post + Concert
- Return: full concert post

### Task 6.3 — List Concerts Endpoint
- `GET /api/concerts` — public
- Optional filter: `?city=Budapest`
- Return upcoming concerts sorted by date ASC

### Task 6.4 — Frontend: ConcertCard Component
- Reusable `ConcertCard` matching design spec:
  - `bg-card` background, rounded-xl, no heavy borders
  - Date displayed prominently in `text-accent font-bold`
  - Venue name in `text-txt-primary font-semibold`
  - City in `text-txt-secondary text-sm`
  - **"I'm going" button**: outlined accent button that fills on click (toggle state)
  - Artist name + link to artist profile
  - Ticket link button if `ticketUrl` is present
  - Hover: card scales `scale-[1.02]`

### Task 6.5 — Frontend: Concerts Page
- `/concerts` route
- **Layout**: vertical list of `ConcertCard` components, max-width container
- City filter dropdown (Headless UI `Listbox`) — dark styled, accent highlight on selection
- **Loading state**: skeleton cards
- **Empty state**: "No upcoming concerts"

### Task 6.6 — Frontend: Create Concert Post Form
- **Design**: Dark card form
- Form: venue, city, date picker, ticket URL, caption
- Submit to `POST /api/posts/concert`
- Loading state on submit, success toast on completion

---

## Epic 7: Comments

### Task 7.1 — Create Comment Entity
- `Comment` entity: `id`, `userId`, `songId`, `content`, `createdAt`
- FK to `User` and `Song`
- Create `CommentRepository`

### Task 7.2 — Add Comment Endpoint
- `POST /api/songs/{songId}/comments` (protected)
- Accept: `content`
- Validate: not empty, max 500 chars
- Return: created comment with user info

### Task 7.3 — Get Comments Endpoint
- `GET /api/songs/{songId}/comments` — public
- Return paginated list of comments with user name + avatar

### Task 7.4 — Delete Comment Endpoint
- `DELETE /api/comments/{id}` (protected)
- Only the comment author can delete
- Return: 204 No Content

### Task 7.5 — Frontend: CommentSection Component
- `CommentSection` component matching design spec, shown below each `SongCard`:
  - Comments list: each comment shows user name (`text-txt-secondary`) + comment text (`text-txt-primary`)
  - Subtle separator between comments (spacing only, no heavy borders)
  - **Input field**: only shown when logged in — dark input with `bg-hover` background
  - **Submit button**: accent color, loading state while posting
  - Optimistic UI update via React Query (comment appears instantly, syncs with server)
  - Delete button (trash icon) shown only on own comments

---

## Epic 8: City Feeds

### Task 8.1 — City Filter on Feed Endpoint
- Extend `GET /api/feed?city=Szeged`
- Filter posts where artist's city matches
- Return paginated, sorted by `createdAt` DESC

### Task 8.2 — List Available Cities Endpoint
- `GET /api/cities` — public
- Return distinct list of cities that have at least one artist

### Task 8.3 — Frontend: City Feed Page
- `/city/:cityName` route and `CityFeedPage`
- **Design**: City name as bold `H1` page header in `text-txt-primary`
- Vertical feed of posts filtered to that city
- Reuses `SongCard`, `ConcertCard`, `UpdateCard`
- **Loading state**: skeleton feed
- **Empty state**: "No posts from [city] yet"

### Task 8.4 — Frontend: City Navigation
- City selector in navbar or sidebar
- Populated from `GET /api/cities`
- Dark dropdown (Headless UI `Listbox`) — accent highlight on selected city
- Clicking a city navigates to `/city/:cityName`

---

## Epic 9: UI Polish & Navigation

### Task 9.1 — Navbar Component
- Sticky top navbar with `bg-card` background + subtle bottom border using spacing/shadow (no heavy line)
- Logo + app name in `text-txt-primary font-bold`
- Links: Feed, Concerts, Cities — in `text-txt-secondary`, active link in `text-txt-primary`
- Auth state:
  - Logged out: "Login" + "Register" buttons
  - Logged in: user avatar/name + "Logout" link + "Create Post" button in `bg-accent text-black`
- Mobile: collapsible hamburger menu or bottom navigation bar

### Task 9.2 — Responsive Layout
- Desktop: centered max-width container with optional sidebar for city/nav links
- Mobile: single column, stacked cards, large touch targets (min 44px height)
- Bottom navigation bar on mobile for Feed / Concerts / Cities
- All cards stack vertically on small screens

### Task 9.3 — Loading & Error States
- Global `SkeletonCard` component matching the shape of `SongCard` and `ConcertCard`
- Skeleton uses `bg-hover` animated pulse effect
- Error boundary component for API failures with a dark-styled "Something went wrong" message
- Empty state components with a subtle icon and `text-txt-muted` text

### Task 9.4 — Toast Notifications
- Use `react-hot-toast` configured with dark theme:
  - Background: `#181818`, text: `#FFFFFF`, border: `#282828`
  - Success icon in `#1DB954`
- Show toasts for: login, register, follow, comment, post creation, errors

---

## Epic 10: Deployment

### Task 10.1 — Deploy Database to Supabase
- Create Supabase project
- Copy connection string
- Update `application.properties` with Supabase DB URL

### Task 10.2 — Deploy Backend to Railway
- Connect GitHub repo to Railway
- Set environment variables: DB URL, JWT secret, Spotify credentials
- Configure build command: `./mvnw package`
- Verify all endpoints work on production URL

### Task 10.3 — Deploy Frontend to Vercel
- Connect GitHub repo to Vercel
- Set environment variable: `VITE_API_URL=<railway backend url>`
- Verify production build works end-to-end

### Task 10.4 — Smoke Test Full MVP
- Register a new user
- Create an artist profile
- Post a song with Spotify preview
- Post a concert
- Follow the artist from another account
- Leave a comment
- Browse city feed
- Confirm all MVP goals are met

---

## Summary

| Epic | Tasks | Priority |
|------|-------|----------|
| 1. Project Setup | 4 | Critical |
| 2. Authentication | 7 | Critical |
| 3. Artist Profiles | 7 | High |
| 4. Song Posts | 6 | High |
| 5. Feed | 4 | High |
| 6. Concerts | 6 | Medium |
| 7. Comments | 5 | Medium |
| 8. City Feeds | 4 | Medium |
| 9. UI Polish | 4 | Low |
| 10. Deployment | 4 | Final |
| **Total** | **51** | |

---

*Generated from: music-community-app-plan.md + ui-ux-design-guidelines.md*
