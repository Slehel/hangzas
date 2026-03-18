# UI / UX Design Guidelines - Music Community App

## Design Goal

The application should have a modern, minimalist, music-focused UI
inspired by Spotify and Apple Music.

Key principles: - Clean - Dark mode first - Content-focused (music \>
UI) - Minimal distractions - Smooth interactions

------------------------------------------------------------------------

# Visual Style

## Theme

-   Default: Dark mode

## Colors

Primary background: #121212 (main background) #181818 (cards) #282828
(hover)

Accent color: #1DB954

Text: Primary: #FFFFFF Secondary: #B3B3B3 Muted: #727272

------------------------------------------------------------------------

## Typography

Use: - Inter font or system font

Hierarchy: - H1: Page titles - H2: Section titles - Body text - Small
metadata text

Rules: - Avoid large text blocks - Use spacing instead of borders

------------------------------------------------------------------------

# Layout Principles

## Card-based design

Everything should be a card: - Song - Artist - Concert - Post

## Spacing over borders

Use: - Padding - Margin - Subtle shadows

Avoid heavy borders.

## Layout types

-   Feed: vertical scroll
-   Artists: grid
-   Songs: list or cards

## Navigation

Sticky navigation (top or side)

------------------------------------------------------------------------

# Core UI Components

## SongCard

-   Cover image
-   Title
-   Artist
-   Play button
-   Like button

## ArtistCard

-   Profile image
-   Name
-   City
-   Follow button

## ConcertCard

-   Date
-   Venue
-   City
-   "I'm going" button

## CommentSection

-   Comments list
-   Input field
-   Submit button

## Feed

-   List of posts
-   Loading states

------------------------------------------------------------------------

# Interaction Design

## Animations

-   Subtle hover scale (1.02)
-   Fade-in content
-   Smooth transitions

Avoid heavy animations.

## Audio Player

-   Play/pause
-   Only one song at a time

## Feedback states

Every action must have: - Loading state - Success feedback - Error
feedback

------------------------------------------------------------------------

# Responsiveness

Support: - Desktop (primary) - Mobile (responsive)

Mobile: - Stacked layout - Large touch targets

------------------------------------------------------------------------

# UX Principles

## Music-first

UI should focus on: - Songs - Artists - Concerts

## Fast interaction

User should: - Play song in 1 click - Follow artist instantly

## Minimal cognitive load

Avoid: - Clutter - Too many buttons - Complex flows

------------------------------------------------------------------------

# Suggested Libraries

Option 1: - Tailwind CSS - Headless UI

Option 2: - Material UI

------------------------------------------------------------------------

# Definition of Done

A feature is complete when: - Matches design system - Responsive - Has
loading and error states - Consistent UI

------------------------------------------------------------------------

# What to Avoid

-   Bright backgrounds
-   Cluttered layouts
-   Too many colors
-   Heavy borders
-   Inconsistent spacing

------------------------------------------------------------------------

# Agent Instructions

When generating UI: - Use dark minimalist Spotify-style design - Use
card-based layout - Use consistent spacing and typography - Keep UI
simple and focused on music
