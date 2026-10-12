# 💻 GraphEdu - Frontend (React + TypeScript + Vite)

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646C9A?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Apollo Client](https://img.shields.io/badge/Apollo%20Client-4.3-311C87?style=for-the-badge&logo=apollographql&logoColor=white)](https://www.apollographql.com/docs/react/)

> Interface utilisateur moderne pour la plateforme **GraphEdu**, construite avec **React 19**, **Apollo Client** et **Tailwind CSS**. Elle consomme l'API GraphQL pour proposer des visualisations interactives de parcours académiques et des simulations de graphes.

---

## 🚀 Fonctionnalités Front-end

- **Authentification & Gestion des Rôles** :
  - Connexion avec gestion du Token JWT via Context API.
  - Protection des routes selon les rôles (`STUDENT`, `INSTRUCTOR`, `ADMIN`).
- **Espace Étudiant** :
  - Consultation du catalogue de cours avec filtres dynamiques (niveau, département, professeur).
  - Tableau de bord personnalisé avec état des inscriptions.
  - Suivi du parcours académique (cours validés vs cours restants).
  - Suggestions de cours basées sur le filtrage collaboratif.
- **Simulateur de Parcours (Shortest Path)** :
  - Outil interactif calculant le chemin minimal d'apprentissage entre deux cours/certifications.
- **Espace Enseignant** :
  - Création de cours avec configuration des prérequis.
  - Gestion des cours existants et consultation des listes d'étudiants inscrits.
- **Espace Administrateur** :
  - Gestion des utilisateurs (modification, suppression).
  - Visualisation de la charge d'enseignement des professeurs.

---

## 🛠️ Stack Technique

- **Framework** : [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Client GraphQL** : [Apollo Client](https://www.apollographql.com/docs/react/) (Requêtes, mutations, cache Apollo, AuthLink avec injection de token Bearer)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Routage** : [React Router DOM v7](https://reactrouter.com/)

---

## ⚙️ Installation & Démarrage

### 1. Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- npm ou yarn

### 2. Installation des dépendances
```bash
npm install
```

### 3. Lancement du serveur de développement
```bash
npm run dev
```

L'application sera accessible par défaut sur `http://localhost:5173`.

> **Note** : Assurez-vous que le backend **GraphEdu-project** est lancé sur le port `8080` pour que les requêtes GraphQL aboutissent.

### 4. Build de Production
```bash
npm run build
```

---

## 📁 Structure des Fichiers

```
src/
├── components/          # Composants réutilisables & ProtectedRoute
├── contexts/            # Contextes React (AuthContext, etc.)
├── graphql/             # Requêtes et mutations GraphQL Apollo (auth, courses, recommendations)
├── lib/                 # Configuration du client Apollo
├── pages/
│   ├── admin/           # Dashboard Administrateur
│   ├── instructor/      # Gestion & création de cours
│   ├── student/         # Dashboard & catalogue étudiant
│   ├── CourseCatalog.tsx
│   ├── Login.tsx
│   └── ShortestPathSimulator.tsx
├── App.tsx              # Routage principal et gardes d'authentification
└── main.tsx             # Point d'entrée de l'application
```
