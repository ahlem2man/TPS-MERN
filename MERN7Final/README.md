# Gestionnaire de Projets (Projet Final)

Application React (Vite) — projet final combinant `useReducer`, `useState` et `useEffect`.

## Fonctionnalités

- Ajouter / supprimer / modifier statut (todo / doing / done) des projets (useReducer).
  
- Chaque projet contient : titre, description, statut, deadline, timer Pomodoro.

- Timer Pomodoro indépendant par projet (useEffect dans ProjectItem).
  
- Persistance complète dans `localStorage` (useEffect).
  
- Filtrer par statut, recherche titre/description, tri par deadline (useState).
  
- Statistiques visuelles (nombre par statut).

## 	Explication du reducer (tous les cas):

LOAD_PROJECTS :

•	Utilisé pour charger la liste initiale depuis localStorage.

•	action.payload doit être un tableau de projets. Remplace l'état projects.

ADD_PROJECT:

•	Crée un nouvel objet projet avec id, title, description, status: 'todo', deadline, createdAt, timer.

•	Ajoute ce projet en tête du tableau projects.

DELETE_PROJECT:

•	Supprime un projet dont l'id est dans action.payload.

EDIT_PROJECT :

•	Met à jour les champs donnés de projet (par ex. éditer titre/description/deadline).

•	action.payload contient { id, updates }.

SET_STATUS :

•	Change le statut (todo|doing|done) du projet identifié par id.

UPDATE_PROJECT_TIMER :

•	Met à jour l'objet timer du projet (minutes, seconds, isActive).

•	Utilisé par le composant ProjectItem qui gère l'interval du timer.

RESET_ALL_TIMERS :

•	Réinitialise tous les timers à 25:00 et isActive=false.

Default :

•	Renvoie l'état inchangé si l'action n'est pas reconnue.

Cette séparation garantit que toute logique qui modifie la collection de projets (ajout, suppression, update) reste centralisée et déterministe via le reducer.

## Explication de chaque useEffect:

App.jsx — useEffect (load) :

•	useEffect(() => { const saved = localStorage.getItem('projects-manager'); ... }, []);

•	But : récupérer l'état persistant des projets au premier rendu. Sans cela, à chaque refresh l'app perdrait les projets.

App.jsx — useEffect (save):

•	useEffect(() => { localStorage.setItem('projects-manager', JSON.stringify(projects)); }, [projects]);

•	But : sauvegarder automatiquement chaque fois que la liste de projets change (ajout, suppression, timer updates, statut change). Permet persistance.

ProjectItem.jsx — useEffect (timer interval):

•	Met en place un setInterval qui décrémente seconds toutes les secondes quand isActive est true. Gère la logique seconds === 0 => décrémente minutes ou arrête le timer.

•	Contient un nettoyage (return () => clearInterval(interval)) pour éviter fuite mémoire quand le composant est démonté ou isActive change.

ProjectItem.jsx — useEffect (sync local timer -> reducer):

•	À chaque changement de minutes/seconds/isActive, on dispatch UPDATE_PROJECT_TIMER pour mettre à jour l'objet timer dans le reducer, ce qui entraîne la sauvegarde par luseEffect du App.jsx.

•	But : garantir que le timer persiste si l'utilisateur recharge la page.
