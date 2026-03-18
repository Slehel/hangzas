# Hungarian Music Community App - MVP Project Plan

## Overview

This project is a web-based Hungarian music community platform where:

-   Fans discover Hungarian artists
-   Artists share songs, concerts, and updates
-   Users listen to 30-second previews via Spotify
-   Communities form around cities (Szeged, Budapest, etc.)

This document is written for AI agents and developers to understand the
system and generate tasks.

------------------------------------------------------------------------

# Goals

## MVP Goals

Users can:

-   Register and login
-   Discover songs
-   Play 30 sec previews
-   Follow artists
-   Comment on songs
-   View concerts
-   Browse city feeds

Artists can:

-   Create artist profile
-   Post songs
-   Post concerts
-   Post updates

------------------------------------------------------------------------

# Tech Stack

## Frontend

React (TypeScript)

Libraries:

-   React Router
-   Axios
-   React Query
-   Tailwind or Material UI
-   HTML5 Audio

## Backend

Spring Boot

Modules:

-   Spring Web
-   Spring Security (JWT)
-   Spring Data JPA
-   PostgreSQL

## Database

PostgreSQL

## External APIs

Spotify Web API

------------------------------------------------------------------------

# Architecture

Frontend → Backend REST API → Database

Backend → Spotify API

------------------------------------------------------------------------

# Data Model

## User

-   id
-   email
-   password
-   name
-   city
-   role

## ArtistProfile

-   id
-   userId
-   artistName
-   bio
-   imageUrl
-   city

## Post

-   id
-   artistId
-   type
-   content
-   createdAt

## Song

-   id
-   postId
-   spotifyId
-   previewUrl
-   title
-   imageUrl

## Concert

-   id
-   postId
-   venue
-   city
-   date
-   ticketUrl

## Comment

-   id
-   userId
-   songId
-   content

------------------------------------------------------------------------

# Features

## Authentication

Register Login JWT auth

## Artist Profiles

Create profile View profile Follow

## Feed

Show posts

## Songs

Create song post Play preview

## Concerts

Create concert View concert

## Comments

Comment on songs

## City Feed

Filter by city

------------------------------------------------------------------------

# Frontend Structure

src/

components/ pages/ api/ hooks/ contexts/

------------------------------------------------------------------------

# Backend Structure

controller/ service/ repository/ model/ security/ dto/

------------------------------------------------------------------------

# Development Phases

## Phase 1

Setup frontend and backend

## Phase 2

Authentication

## Phase 3

Artist profiles

## Phase 4

Song posts

## Phase 5

Feed

## Phase 6

Concerts

## Phase 7

Comments

## Phase 8

City feeds

------------------------------------------------------------------------

# Deployment

Frontend:

Vercel

Backend:

Railway

Database:

Supabase

------------------------------------------------------------------------

# Future Features

Mobile app Chat Notifications Direct music upload

------------------------------------------------------------------------

# Agent Instructions

Agent should:

Break project into tasks

Example:

Task:

Create User Entity

Task:

Create Auth Controller

Task:

Create React Login Page

Task:

Create Feed Component

Task:

Integrate Spotify preview

------------------------------------------------------------------------

# Definition of Done

MVP is done when:

Users can:

Register Login Play preview Follow artist Comment View concerts

------------------------------------------------------------------------

# Priority

Authentication first

Then:

Profiles Songs Feed Concerts Comments City

------------------------------------------------------------------------

# End
