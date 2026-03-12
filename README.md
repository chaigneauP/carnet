# Game Library – Personal Video Game Mediatheque

## Project Goal

This project is a **local web application** used as a personal video game library.

The purpose of the application is to:

* keep track of video games I have played
* record personal playthroughs
* analyze games through detailed ratings
* write personal feedback and notes
* organize games using tags

This tool acts as a **personal gaming journal and database**.

The project is designed to run **locally only** and does not require authentication.

---

# MVP Scope

The Minimum Viable Product focuses on the following core features.

## 1. Dashboard

The homepage provides a quick overview of the library.

Displayed elements:

* total number of games
* total number of completed games
* games currently in progress
* last games added
* last completed games

The dashboard acts as a **summary view of the collection**.

---

## 2. Library Page

A page listing all games in the database.

Each game entry should display:

* title
* cover image (optional)
* platform
* status
* global rating (manually entered score)
* total playtime
* tags

Basic features:

* search by title
* filter by status
* filter by platform
* filter by tags

---

## 3. Game Page

The game page is the **main detail view**.

Information displayed:

### Game Information

Manually entered metadata:

* title
* developer
* release year
* genre
* cover image
* description (optional)

### Personal Notes

Personal comments and analysis about the game.

### Detailed Rating

Instead of a single rating, the game is rated through multiple criteria:

* Gameplay
* Level Design
* Story
* Atmosphere
* Replayability

Each criterion is rated from **0 to 10**.

---

## 4. Playthrough History

A game can have **multiple playthroughs**.

Each playthrough records the following information:

* platform
* start date
* end date
* playtime (hours)
* completion status

Possible statuses:

* Completed
* In Progress
* Dropped

Each playthrough may optionally contain:

* personal notes
* achievements completed
* difficulty level

---

## 5. Tag System

Games can be associated with multiple tags.

Tags are used for **classification and filtering**.

Examples:

* survival horror
* roguelike
* coop
* masterpiece
* disappointing
* backlog

Tags are reusable across games.

---

# Business Rules

- A game can have multiple playthroughs.
- The total playtime of a game is the sum of all playthrough playtime_hours.
- Each game has only one rating entry.
- Tags are reusable and shared across games.
- Deleting a game should also delete its playthroughs and rating.

# Core Data Model

## Game

Represents a video game.

Fields:

* id
* title
* developer
* release_year
* genre
* cover_url
* description
* status
* playtime_total
* created_at
* updated_at

### Game Status Values

Possible values for `games.status`:

- backlog
- playing
- completed
- dropped
---

## Playthrough

Represents a specific time the game was played.

Fields:

* id
* game_id
* platform
* start_date
* end_date
* playtime_hours
* status
* notes
* difficulty
* achievements_completed
* created_at
* updated_at

### Playthrough Status Values

Possible values for `playthroughs.status`:

- Completed
- In Progress
- Dropped
---

## Rating

Detailed evaluation of a game.

Fields:

* id
* game_id
* gameplay
* level_design
* story
* atmosphere
* replayability
* overall_score
* notes
* created_at
* updated_at

overall_score is manually entered by the user and represents the final personal score of the game.
Values range from **0 to 10**.
The rating values are **manually entered by the user** and are **not automatically calculated**.

---

## Tag

Fields:

* id
* name

---

## GameTag

Many-to-many relationship between games and tags.

Fields:

* game_id
* tag_id

---

# Data Relationships

- A Game can have multiple Playthroughs
- A Game has one Rating
- A Game can have multiple Tags
- A Tag can belong to multiple Games

# Non-MVP Features (Future Improvements)

These features are intentionally **out of scope for the MVP**:

* automatic data import (IGDB API)
* advanced statistics
* yearly gaming reports
* screenshots gallery
* achievements tracking
* export features (CSV / JSON)
* recommendation system

---

# Design Principles

The application should prioritize:

* simplicity
* fast navigation
* easy data entry
* clear visualization of personal gaming history

The project is intended as a **long-term personal archive of gaming experiences**.

# Tech Stack

Frontend

- React
- Vite
- React Router
- Axios
- TailwindCSS

Backend

- Node.js
- NestJS 11.1.16

Database

- PostgreSQL

ORM

- TypeORM 0.3.28

Infrastructure

- Docker
- Docker Compose (PostgreSQL local)

# Project Structure

project-root

frontend  
React application

backend  
Node.js REST API (run locally with npm)

database  
SQL initialization scripts

docker-compose.yml  
PostgreSQL local configuration

# Development Goal

The goal is to implement a clean architecture with:

- REST API backend
- modular React components
- simple PostgreSQL schema
- clear separation between controllers, services and database logic
- Respect clean code principles and best practices

# REST API

Base route

/api

Games

GET /api/games  
GET /api/games/:id  
POST /api/games  
PUT /api/games/:id  
DELETE /api/games/:id

Ratings

GET /api/games/:id/rating  
POST /api/games/:id/rating  
PUT /api/games/:id/rating

Playthroughs

GET /api/games/:id/playthroughs  
POST /api/games/:id/playthroughs  
PUT /api/playthroughs/:id  
DELETE /api/playthroughs/:id

Tags

GET /api/tags  
POST /api/tags

Game Tags

POST /api/games/:id/tags  
DELETE /api/games/:id/tags/:tagId

# Docker Setup

The project now uses Docker Compose for the database only.

Service:

- postgres (PostgreSQL database)

Start PostgreSQL with:

`docker compose up -d postgres`

Stop it with:

`docker compose stop postgres`

The backend is intended to run locally from the `backend` folder with npm, using `backend/.env`.

# Local Backend Setup

1. Start PostgreSQL with Docker Compose from the project root.
2. Create `backend/.env` from `backend/.env.example` if needed.
3. Install backend dependencies in `backend/`.
4. Run `npm run check` in `backend/`.
5. Optionally load reusable local sample data with `npm run db:seed` from `backend/`.
6. Start the API locally.

Validated local endpoints:

- `GET /`
- `GET /api/health`
- `GET /api/games`
- `GET /api/games?limit=10`
- `GET /api/games/:id`

# Environment Variables

Root `.env` (used by Docker Compose for PostgreSQL):

POSTGRES_PORT=5432
POSTGRES_DB=game_library
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

Backend `backend/.env`:

PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/game_library?schema=public

# Frontend Architecture

The frontend is built with React using Vite as the development environment.

Main libraries:

- React Router for navigation
- Axios for API requests
- TailwindCSS for UI styling

Suggested folder structure:

frontend/src

components  
Reusable UI components

pages  
Application pages (Dashboard, Library, Game)

services  
API communication layer

hooks  
Custom React hooks

layouts  
Page layouts and navigation

# Backend Architecture

The backend is a REST API built with Node.js and NestJS.

Responsibilities:

- expose REST endpoints
- manage business logic
- communicate with PostgreSQL via TypeORM
- validate transient HTTP payloads with DTOs

Suggested folder structure:

backend/src

main.ts  
NestJS application entry point

app.module.ts  
Root module

app.controller.ts  
Root route controller

health  
Health module and PostgreSQL probe

games  
Games module, controller and business logic

games/dto  
DTOs for params, query strings, commands and responses

games.mapper.ts  
Mapping between DTOs and TypeORM entities

database/entities  
TypeORM entity mappings

common/filters  
HTTP exception formatting

# ORM

The backend uses **TypeORM 0.3.28** to interact with PostgreSQL.

TypeORM provides:

- entity mapping on the existing SQL schema
- repository and query builder access
- explicit relation loading
- predictable integration with NestJS modules

The mapped domain models are:

- Game
- Playthrough
- Rating
- Tag
- GameTag
