# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules and Constraints

- **No summary or explanations**: Never respond with an explanatory summary of applied changes, unless explicitly requested to provide details about a change or how a code block works.
- **No preambles or pleasantries**: Avoid greetings, intros, conversational filler, or fluff. Deliver the direct result only.
- **Do not write unit tests**: Do not write unit tests (or any other automated tests) for any block of code unless explicitly requested.
- **Do not execute tests**: Do not run unit tests (or any other automated tests) unless explicitly asked to do so.

## Project Overview

**United Consortium UI** is a React application built with Create React App that manages consortium operations, expenses, claims, and member notifications. The app provides a dashboard for viewing and managing consortium details, expense receipts, member payments, and claims.

## Quick Start & Common Commands

### Development
- `npm start` — Start development server (runs on http://localhost:3000)
- `npm run build` — Build for production
- `npm test` — Run tests in watch mode
- `npm test -- --watchAll=false` — Run tests once and exit

### Environment
- Backend API: http://localhost:5000 (configured in `src/services/utils/constants.js`)
- Node version: Use Node LTS
- No `.env` file needed currently; API URL is hardcoded

### Authentication
- The session lives in an HttpOnly cookie set by the backend on `POST /authenticate`, so it is never readable from JavaScript.
- `src/services/utils/http-client.js` is the shared axios instance every service imports. It sets `withCredentials` so the cookie travels with each call, and installs an interceptor that signs the user out when a protected call answers 401.
- `main-view.js` restores the session on load via `GET /session`, so a reload keeps the user logged in. Running the backend locally (`APP_ENV` unset) it reports `local: true` and nothing is enforced.
- Logging out calls `POST /logout` to clear the cookie server side.

## Architecture

### Core Stack
- **React 17** with Create React App 5.0.1
- **Material-UI (MUI v5)** for UI components
- **Emotion** for CSS-in-JS styling
- **React Router v5** for page navigation
- **Axios** for HTTP requests
- **ag-grid** for data tables (expense receipts, member tables)
- **Testing Library** + Jest for unit tests

### Directory Structure
```
src/
├── components/          # UI components organized by feature
│   ├── application-nav/ # Top navigation bar
│   ├── consortium/      # Consortium management features
│   ├── claims/          # Claims management
│   ├── expenses-receipt/ # Expense receipt handling
│   ├── login/           # Authentication
│   ├── notifications/   # Notification system
│   ├── payment-status/  # Payment status views
│   ├── common/          # Shared components (buttons, form fields, error handlers)
│   └── main/            # Router and main layout
├── services/            # API service classes (one per domain)
│   ├── user-service/
│   ├── consortium-service/
│   ├── expense-receipt-service/
│   ├── claims-service/
│   └── utils/           # Constants (API_URL)
├── model/               # Domain models (User, Consortium, ExpensesReceipt, etc.)
├── theme.js             # MUI theme configuration (colors, typography)
└── setupTests.js        # Jest configuration
```

### State Management Pattern

The app uses **React Context API** for global state. Each major domain has a Context Provider:
- `UserContext` — Current logged-in user
- `ConsortiumContext` — Selected/active consortium
- `ExpensesReceiptContext` — Expense receipt data
- `ClaimContext` — Claims data
- `PathContext` — Current route path

These providers wrap the entire app in `src/components/main/main-view.js`. Components consume contexts with `useContext()` to access and update global state.

### Service Layer Pattern

Services are class-based and handle all API communication:
```javascript
// Example: UserService
class UserService {
  async getUser(email) { ... }
  createModel(data) { ... }  // Maps API response to model
}
const userService = new UserService();
export default userService;
```

**Key points:**
- One service class per domain/resource
- Services instantiate model objects from API responses
- Services use Axios for HTTP calls
- API base URL: `http://localhost:5000` (from `constants.js`)

### Routing

Routes are defined in `src/components/main/main-view.js` using React Router:
- `/login` — Authentication
- `/consortiums` — Consortium list and details
- `/expenses` — Expense receipt management
- `/claims` — Claims management
- `/notifications` — Notifications list

The app redirects to current path via `PathContext` when user state changes.

### Styling

- **MUI Theme** (`src/theme.js`) — Centralized theme with primary color `#2C4068`, secondary `#C9784A`
- **MUI Components** — Cards, Buttons, TextFields, Chips use theme overrides
- **Emotion** — CSS-in-JS via MUI's styling system
- **Inline sx prop** — MUI components use `sx` for component-level styles (e.g., `sx={{ ml: '248px' }}`)
- No separate SCSS files currently used

### Component Patterns

**Typical component structure:**
- Feature-based folders (e.g., `consortium/`, `expenses-receipt/`)
- Main view component (e.g., `ConsortiumsMainView`)
- Nested sub-components (e.g., `ConsortiumCard`, `ConsortiumMembersTable`)
- Test files in `__tests__/` subdirectory

**Example:** Consortium feature
```
consortium/
├── consortiums-main-view/
├── consortiums-list-view/
├── consortium-details-view/
├── consortium-members-table/
├── consortium-provider/      # Context provider
├── consortium-dropdown.js
└── // test files in __tests__/
```

## Testing

### Test Setup
- **Testing Library** + Jest (configured by CRA)
- Mock adapter: `axios-mock-adapter` for mocking API calls
- Test files use naming convention: `*.test.js` or `*.tests.js`
- Tests run with `npm test`

### Running Tests
- `npm test` — Watch mode (re-runs on file changes)
- `npm test -- --testNamePattern="Pattern"` — Run specific tests
- `npm test -- --watchAll=false` — Run once and exit (CI mode)

### Key Testing Patterns
- Import `userEvent` from `@testing-library/react` for interactions
- Mock Axios calls with `axios-mock-adapter` for services
- Render providers in test setup if testing context-dependent components

## Important Implementation Details

1. **Backend Integration** — All API calls go through service classes. Update `SERVICE_URL` in `constants.js` if backend URL changes.

2. **Authentication** — Handled in `LoginView` and `AuthenticationHandler`. User context is populated after login.

3. **Responsive Layout** — Main content area adjusts margin (`ml: { sm: '248px' }`) and padding (`pt`) based on sidebar and navbar, responsive to screen size.

4. **Error Handling** — Error handler utility in `src/components/common/handlers/error-handler.js`. Services may throw errors that should be caught and displayed.

5. **ag-grid** — Used in member tables and expense receipt lists. Configure columns and data in individual components.

6. **Navigation** — Don't use anchor tags; use React Router Link/useHistory. PathContext triggers history.push() on path changes.

## Common Workflows

### Adding a New Feature
1. Create feature folder under `src/components/[featureName]/`
2. Create main view component and nested sub-components
3. Create service class in `src/services/[featureName]-service/`
4. Create model class in `src/model/` if needed
5. Create context provider if feature needs global state
6. Add route in `src/components/main/main-view.js`
7. Add navigation link in `ApplicationNavView`

### Modifying API Integration
1. Update the service class method in `src/services/*/`
2. Update the corresponding model class if response structure changes
3. Update tests in the service's `__tests__/` folder

### Styling Updates
1. For global styles → update `theme.js`
2. For component-level styles → use MUI's `sx` prop
3. Review MUI theme overrides in `theme.js` for `MuiButton`, `MuiCard`, `MuiTextField`
