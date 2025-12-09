# 📚 EduPlatform — Application MERN complète (TP9)

Plateforme web éducative permettant aux utilisateurs de s'inscrire, se connecter, consulter des cours, laisser des avis et suivre leur profil.  
Projet développé en **MERN Stack** pour le module de développement Web avancé.

## 🚀 Technologies Utilisées

| Côté Client (Front-end) | Côté Serveur (Back-end) | Base de données |
|------------------------|------------------------|-----------------|
| React + Vite           | Node.js + Express      | MongoDB Atlas    |
| Axios                  | JSON Web Token (JWT)   | Mongoose         |
| React Router           | bcryptjs               |                  |

---

## 📦 Installation & Lancement

2️⃣ Lancer le Backend:

![Backend](screenshots/1.png)

Par défaut il tourne sur :
➡ http://localhost:5000

3️⃣ Lancer le Frontend :

![frontend](screenshots/2.png)

👉 Ouverture auto sur http://localhost:5173


🔑 Fonctionnalités

✔ Création de compte & Authentification sécurisée (JWT)
✔ Connexion / Déconnexion
✔ Liste des cours disponible
✔ Détails d’un cours + Avis utilisateur
✔ Inscription à un cours
✔ Page Profil + Historique utilisateur
✔ API REST complète & testable sur Postman

| Méthode | Route                     | Description                    |
| ------- | ------------------------- | ------------------------------ |
| POST    | `/api/auth/register`      | Inscription utilisateur        |
| POST    | `/api/auth/login`         | Connexion & génération token   |
| GET     | `/api/courses`            | Liste des cours                |
| GET     | `/api/courses/:id`        | Details d’un cours             |
| POST    | `/api/courses/:id/enroll` | Inscription à un cours         |
| POST    | `/api/reviews/:id`        | Ajouter un avis                |
| GET     | `/api/users/:id/courses`  | Cours suivis par l'utilisateur |



🖼 Captures d’Écran

📍 Ajouter dans /screenshots/:
| Page                                     | Screenshot   |
| ---------------------------------------- | ------------ |
| Page d'accueil                           | ![Page d'accueil](screenshots/home.png)    |
| Liste des cours                          |![Page courses](screenshots/courses.png)  |
| Détails d'un cours + bouton "S'inscrire" |![Page details](screenshots/details.png) |
| Page Register                            | ![Page register](screenshots/register.png) |
| Page Login                               | ![Page login](screenshots/login.png)    |
| Page Profil utilisateur                  |![Page profile](screenshots/profile.png)  |
| Ajout d’un avis + inscription réussie    |![Page review](screenshots/review.png)  |
