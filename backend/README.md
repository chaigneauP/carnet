# Backend `carnet`

API REST locale en **NestJS 11.1.16 + TypeORM 0.3.28 + TypeScript**.

## Endpoints disponibles

- `GET /` : état simple du service
- `GET /api/health` : santé de l'API et de PostgreSQL
- `GET /api/games` : liste minimale des jeux
- `GET /api/games?limit=10` : limite le nombre de résultats
- `GET /api/games/:id` : détail d'un jeu avec métadonnées, note, tags et playthroughs
- `POST /api/games` : création d'un jeu
- `PUT /api/games/:id` : mise à jour complète des champs éditables d'un jeu
- `DELETE /api/games/:id` : suppression d'un jeu

## Variables d'environnement

Créez `backend/.env` à partir de `backend/.env.example`.

Valeurs par défaut locales :

- `PORT=3000`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/game_library?schema=public`

## Démarrage local

1. Depuis la racine du projet, démarrer PostgreSQL : `docker compose up -d postgres`
2. Dans `backend/`, installer les dépendances : `npm ci`
3. Vérifier le projet : `npm run check`
4. Injecter des données de test si besoin : `npm run db:seed`
5. Lancer l'API NestJS : `npm run dev`

## Scripts npm

- `npm run dev` : serveur NestJS TypeScript avec rechargement
- `npm run build` : compilation TypeScript
- `npm run start` : exécute la version compilée
- `npm run db:seed` : exécute `database/seed/001-local-seed.sql` sur la base locale
- `npm run test` : tests unitaires + e2e
- `npm run test:e2e` : tests e2e du contrat HTTP
- `npm run check` : build TypeScript de validation

## Architecture

Structure principale :

- `src/main.ts` : bootstrap NestJS + validation globale des DTOs
- `src/app.module.ts` : module racine
- `src/app.controller.ts` : route `GET /`
- `src/health/*` : module de santé applicative et PostgreSQL
- `src/games/dto/*` : DTOs d'entrée/sortie du module `games`
- `src/games/games.mapper.ts` : mapping DTOs ↔ entités
- `src/games/*` : contrôleur et service métier `games`
- `src/database/entities/*` : mapping TypeORM sur les tables PostgreSQL existantes
- `src/common/filters/http-exception.filter.ts` : format d'erreur HTTP homogène

## Notes

- PostgreSQL reste conteneurisé via `docker-compose.yml`, mais le backend tourne localement avec npm.
- La source de vérité du schéma SQL reste `database/init/001-init.sql`.
- Les entités TypeORM mappent les tables existantes sans `synchronize` automatique.
- Les DTOs centralisent les données transitoires entre contrôleurs, services et persistance.
- Le mapper `games` garde le service focalisé sur l'orchestration et les règles métier simples.
- Les artefacts legacy `Express` / `Prisma` ont été supprimés du code source du backend.
- `GET /api/games` retourne un tableau vide si la base ne contient encore aucun jeu.
- Les réponses d'erreur conservent le format historique `{ message: ... }`, y compris pour les routes inconnues.
