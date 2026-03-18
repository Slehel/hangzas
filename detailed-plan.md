# Hungarian Music Community App — Detailed Development Plan

---

## Epic 1: Project Setup

### Task 1.1 — Initialize React Frontend
- Run `npm create vite@latest frontend -- --template react-ts`
- Install dependencies: `react-router-dom`, `axios`, `@tanstack/react-query`, `tailwindcss`
- Configure Tailwind CSS
- Set up folder structure: `src/components/`, `src/pages/`, `src/api/`, `src/hooks/`, `src/contexts/`
- Create a basic `App.tsx` with router placeholder

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
- Form fields: name, email, password, city
- POST to `/api/auth/register`
- On success: redirect to login
- Show validation errors

### Task 2.6 — Frontend: Login Page
- Create `/login` route and `LoginPage` component
- Form fields: email, password
- POST to `/api/auth/login`
- Store JWT in `localStorage`
- On success: redirect to home feed

### Task 2.7 — Frontend: Auth Context
- Create `AuthContext` using React Context API
- Store current user + token
- Provide `login()`, `logout()` methods
- Create `PrivateRoute` component to protect pages that require login

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

### Task 3.5 — Frontend: Artist Profile Page
- Create `/artist/:id` route and `ArtistProfilePage` component
- Display: name, bio, city, image, follower count
- Follow/unfollow button (shown when logged in)
- List of artist's posts below

### Task 3.6 — Frontend: Create Artist Profile Form
- Create `/create-profile` route (protected, only for users without a profile)
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

### Task 4.5 — Frontend: Song Post Card Component
- `SongCard` component displaying: album art, title, artist name, caption
- Embedded 30-second audio preview using HTML5 `<audio>` element
- Play/pause button with visual feedback
- Link to full artist profile

### Task 4.6 — Frontend: Create Song Post Form
- `CreateSongPost` page (protected, artists only)
- Input: Spotify track search or direct Spotify ID
- Preview the track before posting
- Caption input
- Submit to `POST /api/posts/song`

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
- Two tabs: "Discover" (global) and "Following" (requires login)
- Infinite scroll or pagination
- Renders `SongCard`, `ConcertCard`, `UpdateCard` based on post type

### Task 5.4 — Frontend: React Query Integration
- Set up `QueryClientProvider` in `App.tsx`
- Create custom hooks: `useGlobalFeed()`, `useFollowingFeed()`
- Handle loading states, error states, and empty states

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

### Task 6.4 — Frontend: Concert Card Component
- `ConcertCard` component: venue, city, date, ticket link button
- Show artist name and profile link

### Task 6.5 — Frontend: Concerts Page
- `/concerts` route
- City filter dropdown
- List of upcoming concerts using `ConcertCard`

### Task 6.6 — Frontend: Create Concert Post Form
- Form: venue, city, date picker, ticket URL, caption
- Submit to `POST /api/posts/concert`

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

### Task 7.5 — Frontend: Comment Section Component
- `CommentSection` component below each `SongCard`
- Show existing comments
- Comment input box (shown only when logged in)
- Submit new comment, optimistic UI update via React Query

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
- Displays feed filtered to that city
- Shows city name as header
- Reuses `SongCard`, `ConcertCard`, `UpdateCard`

### Task 8.4 — Frontend: City Navigation
- City selector in navbar or sidebar
- Populated from `GET /api/cities`
- Clicking a city navigates to `/city/:cityName`

---

## Epic 9: UI Polish & Navigation

### Task 9.1 — Navbar Component
- Logo + app name
- Links: Feed, Concerts, Cities
- Auth state: show Login/Register or user avatar + logout
- "Create Post" button for artists

### Task 9.2 — Responsive Layout
- Mobile-first layout using Tailwind
- Sidebar on desktop, bottom nav on mobile
- Cards stack vertically on small screens

### Task 9.3 — Loading & Error States
- Global loading spinner component
- Error boundary for API failures
- Empty state illustrations for empty feeds

### Task 9.4 — Toast Notifications
- Success/error toasts for: login, register, follow, comment, post creation
- Use a library like `react-hot-toast`

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
| 3. Artist Profiles | 6 | High |
| 4. Song Posts | 6 | High |
| 5. Feed | 4 | High |
| 6. Concerts | 6 | Medium |
| 7. Comments | 5 | Medium |
| 8. City Feeds | 4 | Medium |
| 9. UI Polish | 4 | Low |
| 10. Deployment | 4 | Final |
| **Total** | **50** | |

---

*Generated from: music-community-app-plan.md*
