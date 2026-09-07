# Manioc Investment

Investissement agricole participatif (5%/10%/20%)

**Organisation :** Manioc Investment

## Structure

```
14-manioc-investment/
├── backend/          # Express.js API (Port 3014)
│   ├── server.js
│   ├── package.json
│   └── db.json
├── web/              # React frontend (HTML + Babel standalone)
│   └── index.html
└── mobile/           # Flutter app
    └── lib/main.dart
```

## Démarrage

```bash
# Backend
cd 14-manioc-investment/backend
npm install
npm start

# Web — Ouvrir 14-manioc-investment/web/index.html dans un navigateur
# ou servir avec: npx serve 14-manioc-investment/web

# Mobile
cd 14-manioc-investment/mobile
flutter pub get
flutter run
```

## API

| Endpoint | Description |
|----------|-------------|
| GET /api/health | Health check |
| GET /api/stats | Statistiques |
