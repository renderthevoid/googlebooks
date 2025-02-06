# Google Books Search

# Описание проекта

Это приложение для просмотра книг, использующее API Google Books. Оно позволяет пользователям искать книги, просматривать их список, открывать детальную информацию о книге в модальном окне, а также редактировать название книги.

---
# Installation

#### HTTPS
```
https://github.com/renderthevoid/realty-landing.git
```
For installing all dependencies type `yarn`


# Стек технологий

- **Vue 3**;
- **Vue Router**
- **TypeScript**
- **PrimeVue**
- **TailwindCSS**
- **JSDoc**

---

# Structure 
/google-books-app
│
├── /src
│   ├── /assets          # Static assets (images, fonts, etc.)
│   │   └── logo.png     # Application logo or other static images
│   │
│   ├── /components      # Reusable UI components
│   │   ├── BookTable.vue        # Component for displaying the list of books in a table
│   │   ├── BookModal.vue        # Modal component for detailed book information
│   │   ├── EditBookModal.vue    # Modal component for editing book titles
│   │   ├── SearchBar.vue        # Component for the search bar
│   │   └── Loader.vue           # Loader component for displaying loading states
│   │
│   ├── /composables     # Logic for reusability using Composition API
│   │   ├── useBooks.ts          # Composable for fetching and managing books data
│   │   ├── useQueryParams.ts    # Composable for managing query parameters
│   │   └── useModalState.ts     # Composable for managing modal state
│   │
│   ├── /router          # Vue Router configuration
│   │   └── index.ts      # Main router configuration file
│   │
│   ├── /views           # Page-level components
│   │   ├── HomePage.vue  # Main page for displaying books and search functionality
│   │   └── AboutPage.vue # Page with information about the developer
│   │
│   ├── App.vue          # Root component of the application
│   └── main.ts          # Entry point of the application
│
├── /public              # Public files (served as-is)
│   └── index.html       # HTML template for the application
│
├── vite.config.ts       # Vite configuration file
├── tsconfig.json        # TypeScript configuration file
├── README.md            # Project documentation
└── package.json         # Project dependencies and scripts
