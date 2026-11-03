# Frontend architecture

## Folder structure

`frontend/src` contains:

- `App.tsx`: route definitions
- `pages/`: screen components
- `components/`: reusable UI, such as `ProtectedRoute` and `NotificationBanner`
- `context/`: authentication and shared notification state
- `api/`: the shared Axios client
- `services/`: API request wrappers
- `types/`: shared TypeScript types

## Routing

`App.tsx` uses `BrowserRouter` and `Routes`. The root path redirects to `/dashboard`. Login and registration are public. Dashboard and notification pages are wrapped in `ProtectedRoute`, which redirects to `/login` when no token is available.

## Authentication

`AuthProvider` in `context/AuthProvider.tsx` stores the current `user` and `token` in React state. It restores them from localStorage on startup and exposes `login`, `logout`, and `useAuth()`. The context currently uses `auth_token` and `auth_user` as its storage keys.

## API calls

`api/axios.ts` creates the shared Axios client. Its request interceptor reads the `token` localStorage key and adds an `Authorization: Bearer ...` header when present. Request methods live in `services/*.ts`, including `authService` and `notificationService`.

## Shared notifications

`NotificationsProvider` stores the notifications array. `DashboardPage` loads the list once and calls `setNotifications`; create, edit, and close actions update the same context, so other pages see changes without a reload.

Open INFO notifications render as `NotificationBanner` components. Each starts a 90-second timer that calls `onClose`; the timer is cleared when the banner unmounts. Closing persists `isClosed` through the API before updating shared state.

## Data flow

**Login:** Login form → `authService.login()` → API returns token/user → `useAuth().login()` stores them → navigate to dashboard.

**Create:** New notification form → `notificationService.create()` → `addNotification()` prepends the response → navigate to dashboard.
