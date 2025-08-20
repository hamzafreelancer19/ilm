# Ilm Kademy - Educational Platform

A comprehensive educational platform with professional design system, built with Django + DRF backend and React + Tailwind frontend.

## Project Structure

```
Book_Project/
├── ilm-kademy-backend/     # Django + DRF API
├── ilm-kademy-frontend/    # React + Tailwind UI
└── README.md              # This file
```

## Features

- **Multi-role System**: SUPER_ADMIN, INSTITUTE_ADMIN, TEACHER, STUDENT
- **Institute Management**: Multi-tenant with role-based access
- **Book Library**: Multi-subject, multi-language content with 13 modular chapter sections
- **AI Assistant**: Chat, grammar check, and quiz suggestions
- **Assessment Tools**: Quizzes and assignments with auto-grading
- **Professional Design System**: Light/dark themes, mobile-first, accessible
- **Subscription Management**: Plan-based access control

## Quick Start

### Backend
```bash
cd ilm-kademy-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd ilm-kademy-frontend
npm install
npm run dev
```

## Development Workflow

1. **Foundation**: Project setup, auth, basic structure
2. **Core Modules**: Users, institutes, books, chapters
3. **Features**: Quizzes, assignments, AI assistant
4. **Advanced**: Subscriptions, notifications, dashboards
5. **Quality**: Testing, documentation, preview checks

## Design System

- **Brand Colors**: Teal (#14B8A6), Blue (#3B82F6), Purple (#8B5CF6)
- **Typography**: Inter/Poppins with consistent scale
- **Components**: Professional card-based design with smooth transitions
- **Themes**: Light/dark mode with WCAG AA contrast compliance

## Preview Checkpoints

After each major step, we'll run preview checks to ensure:
- Backend API endpoints work correctly
- Frontend components render properly
- No console/server errors
- Design consistency maintained
- Mobile responsiveness verified 