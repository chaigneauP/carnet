# Backend `carnet`

Socle minimal de l'API REST en **Node.js + Express + Prisma + TypeScript**.

## Endpoints disponibles

- `GET /` : état simple du service
- `GET /api/health` : santé de l'API et de PostgreSQL
- `GET /api/games` : liste minimale des jeux
- `GET /api/games?limit=10` : limite le nombre de résultats

## Variables d'environnement

Créez `backend/.env` à partir de `backend/.env.example`.

Valeurs par défaut locales :

- `PORT=3000`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/game_library?schema=public`

## Démarrage local

1. Depuis la racine du projet, démarrer PostgreSQL : `docker compose up -d postgres`
2. Dans `backend/`, installer les dépendances : `npm ci`
3. Générer le client Prisma : `npm run prisma:generate`
4. Vérifier le projet : `npm run check`
5. Injecter des données de test si besoin : `npm run db:seed`
6. Lancer le serveur Express : `npm run dev`

## Scripts npm

- `npm run dev` : serveur TypeScript avec rechargement
- `npm run build` : compilation TypeScript
- `npm run start` : exécute la version compilée
- `npm run prisma:generate` : génère le client Prisma
- `npm run prisma:validate` : valide le schéma Prisma
- `npm run db:seed` : exécute `database/seed/001-local-seed.sql` sur la base locale
- `npm run check` : validation Prisma + build

## Notes

- PostgreSQL reste conteneurisé via `docker-compose.yml`, mais le backend est prévu pour tourner localement avec npm.
- Le seed local remplace à chaque exécution les jeux marqués `[seed] ...`, ce qui évite les doublons pendant le développement.
- La source de vérité de la structure SQL reste `database/init/001-init.sql`.
- Le fichier `prisma/schema.prisma` permet au backend de consommer cette base avec un client typé.
- `GET /api/games` retourne un tableau vide si la base ne contient encore aucun jeu.
