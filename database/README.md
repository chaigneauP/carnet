# Database bootstrap

Ce dossier contient l'initialisation locale de PostgreSQL pour le projet `carnet`.

## Contenu

- `init/001-init.sql` : crée le schéma initial, les contraintes, les index et les triggers.

## Règles déjà gérées côté base

- suppression en cascade des `playthroughs`, `ratings` et liaisons `game_tags` lors de la suppression d'un jeu
- unicité d'une note (`rating`) par jeu
- unicité des tags
- recalcul automatique de `games.playtime_total` à chaque création, modification ou suppression de playthrough
- mise à jour automatique des colonnes `updated_at`

## Important

Les scripts du dossier `docker-entrypoint-initdb.d` ne sont exécutés qu'à la création initiale du volume PostgreSQL.
Si vous modifiez `001-init.sql` après un premier démarrage, il faut recréer le volume pour rejouer l'initialisation.

