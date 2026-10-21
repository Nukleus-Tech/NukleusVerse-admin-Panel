# NukleusVerse Admin Panel

The administration frontend for the NukleusVerse meeting platform. It gives administrators a central place to review platform activity, manage user access, inspect meetings, and browse recordings and meeting notes.

Built with React, Vite, and Tailwind CSS. This repository contains the frontend; authentication, data storage, and admin operations are provided by a separate backend API.

## Features

| Area | Current capabilities |
| --- | --- |
| Dashboard | View user, meeting, recording, and note counts, recent activity, and recent meetings. |
| Users | Search by name or email, inspect user details and meeting activity, and block or unblock accounts. |
| Meetings | Search by meeting name, host, room code, or status; view live and completed meeting counts and meeting details. |
| Recordings | Search recordings and inspect their status, duration, file size, host, and estimated storage usage. |
| Meeting notes | Search notes by meeting, host, or preview text and open available note files in a new tab. |
| Settings | View the administrator profile and backend-provided system information. |
| Authentication | Sign in through the admin API, access protected routes, and sign out. Unauthorized API responses clear the session and redirect to login. |

### Current limitations

- **AI summaries, PDF reports, and email delivery tracking** are shown as “Coming Soon”; their integrations are not implemented.
- **Recording downloads** have an API helper and a visible button, but the recordings page does not pass a download handler to the table. Downloads are not functional yet.
- **Dashboard and user screens contain sample fallback data.** It can appear before API data arrives or when a request fails; some dashboard fields also fall back when omitted by the API. Check API responses before treating displayed values as production metrics.
- **Meeting data loads when the page opens.** There is currently no polling or real-time subscription.
- **User management supports viewing, blocking, and unblocking.** Creating, deleting, and editing user profiles are not implemented in this frontend. Settings are read-only.

## Technology stack

| Purpose | Technology |
| --- | --- |
| UI | React 19 and JavaScript with JSX |
| Development and build | Vite 8 |
| Styling | Tailwind CSS 4 with the Vite plugin |
| Routing | React Router 7 |
| API requests | Axios |
| Icons | Lucide React and React Icons |
| Code quality | ESLint 10 with React Hooks and React Refresh rules |

Dependency versions are defined in [package.json](./package.json) and pinned in [package-lock.json](./package-lock.json).

## Getting started

### Prerequisites

- Node.js 24.x and npm. Node.js 24 satisfies the engine requirements of the locked build and lint dependencies.
- Git to clone the repository.
- Access to the NukleusVerse backend and a valid administrator account.

### Install and run

```bash
git clone https://github.com/Nukleus-Tech/NukleusVerse-admin-Panel.git
cd NukleusVerse-admin-Panel
npm ci
npm run dev
```

Open the local URL printed by Vite and sign in with your administrator credentials. The prefilled email is a convenience value; use the account provisioned by your backend administrator. This repository does not provision admin accounts or include a default password.

### Available commands

| Command | Description |
| --- | --- |
| `npm ci` | Install dependencies using the committed lockfile. |
| `npm run dev` | Start the development server. |
| `npm run build` | Generate the production frontend in `dist/`. |
| `npm run preview` | Preview the production build locally after building. |
| `npm run lint` | Run ESLint across the project. |

There is currently no automated test script in `package.json`.

## Backend configuration

The shared Axios client is configured in [src/api/axios.js](./src/api/axios.js). Its current `baseURL` is:

```text
https://nukleus-verse-backend-407918012309.asia-south1.run.app
```

To use another backend, update `baseURL` in that file and rebuild the frontend. The app currently reads the API URL directly from source; adding a `.env` file alone will not change it.

The backend must accept requests from the frontend's origin through its CORS configuration, including requests with the `Authorization` header. The Vite configuration does not define an API proxy.

### Authentication flow

1. The login form sends `{ email, password }` to `POST /api/admin/login`.
2. The frontend expects a response containing `success: true`, an `admin` object, and a `token`.
3. The token and admin profile are stored in browser `localStorage` under `nukleus_admin_token` and `nukleus_admin_user`.
4. The Axios request interceptor adds `Authorization: Bearer <token>` to subsequent requests.
5. Signing out clears the stored session. An HTTP `401` response also clears it and redirects to `/login`.

Protected routes check whether a token exists locally. The backend must validate the token and enforce administrator permissions on every protected endpoint.

### API integration

These are the endpoint paths referenced by the frontend's [API modules](./src/api), relative to the configured backend URL. They describe the client integration, not a verification of the deployed backend.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/admin/login` | Authenticate an administrator. |
| `GET` | `/api/admin/dashboard` | Load dashboard cards, activity, and recent meetings. |
| `GET` | `/api/admin/users` | List users and user statistics. |
| `GET` | `/api/admin/users/:id` | Load user details. |
| `PUT` | `/api/admin/users/:id/block` | Block a user. |
| `PUT` | `/api/admin/users/:id/unblock` | Unblock a user. |
| `GET` | `/api/admin/meetings` | List meetings. |
| `GET` | `/api/admin/meetings/:meetingId` | Load meeting details. |
| `GET` | `/api/admin/recordings` | List recordings. |
| `GET` | `/api/admin/recordings/:meetingId/download` | Recording download helper; not connected to the page yet. |
| `GET` | `/api/admin/notes` | List meeting notes. |
| `GET` | `/api/admin/notes/:meetingId` | Load a meeting's notes, including the file URL when available. |
| `GET` | `/api/admin/settings/profile` | Load the administrator profile. |
| `GET` | `/api/admin/settings/system` | Load system information. |

## Application routes

| Route | Page | Access |
| --- | --- | --- |
| `/login` | Administrator sign-in | Public |
| `/` | Redirect to `/dashboard` | Authenticated |
| `/dashboard` | Platform overview | Authenticated |
| `/users` | User management | Authenticated |
| `/meetings` | Meeting overview and details | Authenticated |
| `/recordings` | Recording browser | Authenticated |
| `/notes` | Meeting notes | Authenticated |
| `/summaries` | AI summaries placeholder | Authenticated |
| `/settings` | Administrator profile and system information | Authenticated |

Unmatched paths display the not-found page. Route definitions live in [src/routes/AppRoutes.jsx](./src/routes/AppRoutes.jsx).

## Project structure

```text
NukleusVerse-admin-Panel/
├── public/                  # Static assets
├── src/
│   ├── api/                 # Axios client and endpoint helpers
│   ├── assets/              # Images and SVG assets
│   ├── components/          # Layout, tables, search inputs, and status badges
│   ├── context/             # Authentication provider and context
│   ├── hooks/               # Authentication hook
│   ├── layout/              # Shared admin layout
│   ├── pages/               # Login, dashboard, and management screens
│   ├── routes/              # Route definitions and authentication guard
│   ├── utils/               # Browser session storage helpers
│   ├── App.jsx              # Router and provider setup
│   ├── index.css            # Tailwind CSS entry point
│   └── main.jsx             # React entry point
├── eslint.config.js         # Lint configuration
├── index.html               # Application HTML entry point
├── package.json             # Dependencies and npm scripts
├── package-lock.json        # Locked dependency versions
└── vite.config.js           # Vite, React, and Tailwind configuration
```

## Build and deployment

```bash
npm ci
npm run lint
npm run build
```

Deploy the generated `dist/` directory to a static hosting service. Configure the host to serve `index.html` for application routes such as `/users` and `/meetings`, while serving asset files normally; the app uses `BrowserRouter`.

For a local check of the build, run:

```bash
npm run preview
```

The preview command is for inspecting the build locally. Configure the deployed frontend origin on the backend before using authentication and admin APIs from that domain.

<!-- ## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Installation, build, or lint fails with a Node.js engine error | Use Node.js 24.x, then run `npm ci` again. |
| Login fails | Confirm the backend URL and use a valid backend-provisioned admin account. |
| The app returns to login after an API request | An HTTP `401` clears the session. Sign in again and check backend authentication if it persists. |
| Data does not load | Inspect the browser Network panel for connection, CORS, or API errors. Confirm the backend allows your frontend origin. |
| Notes do not open | Allow pop-ups for the admin panel and confirm that the backend returns an accessible `notesUrl`. |
| Recording download does nothing or raises an error | The page's download handler is not connected yet; see current limitations above. |
| Refreshing `/users` or another route returns a hosting 404 | Configure the static host's fallback to `index.html`. | -->

## Development

Keep API calls in `src/api/`, screen logic in `src/pages/`, and reusable UI in `src/components/`. Run `npm run lint` and `npm run build` before submitting code changes, and update this README when setup, routes, or capabilities change.

Local environment files, private key files, dependencies, and build output are excluded through [.gitignore](./.gitignore). Keep credentials out of frontend source and committed files.
