# Chatbot Frontend

This repository contains two React applications:

- **frontend/** – the main UI for the Hacettepe University Library AI assistant, including the public chatbot surface and an authenticated admin console for curation and analytics.
- **chatbot-widget/** – a lightweight Create React App scaffold intended for building an embeddable chatbot widget.

## Features (frontend)
- **Conversational chatbot** with markdown rendering, typing indicator, suggested follow-up questions, autocomplete, and session-scoped feedback (likes/dislikes) sent to the backend.
- **Admin authentication** flow that stores a bearer token in `localStorage` to unlock the dashboard.
- **Admin dashboard** with multiple panels:
  - *Onaysız Sorular*: review, approve, reject, or send answers back for editing.
  - *Konuşma Geçmişi*: browse chat history by session ID.
  - *Geri Bildirimler*: inspect feedback logs with timestamps and session metadata.
  - *İstatistikler*: charts for message volumes, feedback ratios, answer distributions, and top-liked answers.
  - *Cevap Düzenleyici*: edit answers, assign quality scores, and request alternative suggestions from the backend.
- **Backend expectations**: both the chatbot and admin APIs target a server running on `http://localhost:5000` (see calls under `/chat`, `/api/*`, and `/admin/login`).

## Getting started
### Prerequisites
- Node.js 18+ and npm.
- A backend service available at `http://localhost:5000` that implements the chatbot, analytics, and admin endpoints.

### Installation
Clone the repository, then install dependencies for the desired app:

```bash
# Main app
cd frontend
npm install

# Optional widget scaffold
cd ../chatbot-widget
npm install
```

### Running the main app
From `frontend/`:

```bash
npm start
```

The development server uses the CRA proxy to forward API calls to `http://localhost:5000`.

### Building for production
From `frontend/`:

```bash
npm run build
```

The build output will be emitted to `frontend/build/`.

## Project structure
```
chatbot_frontend/
├── frontend/           # Primary chatbot + admin React app
│   ├── src/
│   │   ├── components/ # Chat UI components
│   │   ├── admin/      # Admin login, dashboard, panels, and API helpers
│   │   └── ...
│   └── public/
└── chatbot-widget/     # Embeddable widget scaffold (CRA starter)
```

## Development notes
- The chatbot experience keeps a per-session UUID in memory and sends conversation history with each request.
- Admin actions call REST endpoints for moderation, analytics, and answer curation; ensure CORS and authentication are configured on the backend accordingly.
- UI text is primarily in Turkish to match the target audience.
