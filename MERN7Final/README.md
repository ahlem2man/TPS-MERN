# Gestionnaire de Projets (Projet Final)

Application React (Vite) — projet final combinant `useReducer`, `useState` et `useEffect`.

## Fonctionnalités
- Ajouter / supprimer / modifier statut (todo / doing / done) des projets (useReducer).
- Chaque projet contient : titre, description, statut, deadline, timer Pomodoro.
- Timer Pomodoro indépendant par projet (useEffect dans ProjectItem).
- Persistance complète dans `localStorage` (useEffect).
- Filtrer par statut, recherche titre/description, tri par deadline (useState).
- Statistiques visuelles (nombre par statut).
