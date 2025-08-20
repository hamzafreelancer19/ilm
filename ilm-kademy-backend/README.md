# Ilm Kademy Backend

Django + DRF backend for the Ilm Kademy educational platform.

## Features

- **Multi-role Authentication**: SUPER_ADMIN, INSTITUTE_ADMIN, TEACHER, STUDENT
- **Institute Management**: Multi-tenant with role-based access control
- **Book Library**: Multi-subject, multi-language content with 13 modular chapter sections
- **Assessment Tools**: Quizzes and assignments with auto-grading
- **AI Assistant**: Chat, grammar check, and quiz suggestions
- **Subscription Management**: Plan-based access control
- **Notifications**: Real-time announcements and user notifications

## Setup

### Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd ilm-kademy-backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Core
- `GET /api/v1/health/` - Health check

### Authentication
- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/login/` - User login
- `POST /api/v1/auth/logout/` - User logout
- `GET /api/v1/auth/profile/` - User profile
- `PATCH /api/v1/auth/profile/` - Update profile
- `POST /api/v1/auth/change-password/` - Change password

### Institutes
- `GET /api/v1/institutes/` - List institutes
- `POST /api/v1/institutes/` - Create institute
- `GET /api/v1/institutes/{id}/` - Institute detail
- `PATCH /api/v1/institutes/{id}/` - Update institute

### Books
- `GET /api/v1/books/` - List books
- `POST /api/v1/books/` - Create book
- `GET /api/v1/books/{id}/` - Book detail
- `GET /api/v1/books/{id}/chapters/` - Book chapters
- `GET /api/v1/books/{id}/chapters/{chapter_id}/sections/` - Chapter sections

### Quizzes
- `GET /api/v1/quizzes/` - List quizzes
- `POST /api/v1/quizzes/` - Create quiz
- `GET /api/v1/quizzes/{id}/` - Quiz detail
- `POST /api/v1/quizzes/{id}/attempt/` - Start quiz attempt
- `POST /api/v1/quizzes/{id}/submit/` - Submit quiz

### Assignments
- `GET /api/v1/assignments/` - List assignments
- `POST /api/v1/assignments/` - Create assignment
- `GET /api/v1/assignments/{id}/` - Assignment detail
- `POST /api/v1/assignments/{id}/submit/` - Submit assignment

### AI Assistant
- `POST /api/v1/ai/chat/` - AI chat
- `POST /api/v1/ai/grammar-check/` - Grammar check
- `POST /api/v1/ai/quiz-suggestions/` - Quiz suggestions

## Models Overview

### Users & Roles
- **User**: Custom user model with role-based access
- **Profile**: Extended user information
- **Role Types**: SUPER_ADMIN, INSTITUTE_ADMIN, TEACHER, STUDENT

### Institute Management
- **Institute**: Multi-tenant organization
- **Membership**: User-institute relationships
- **Invitation**: Institute invitation system

### Content Management
- **Book**: Multi-subject educational content
- **Chapter**: Book content organization
- **ChapterSection**: 13 modular content types
- **Tag**: Content categorization

### Assessment
- **Quiz**: Interactive assessments
- **Question**: Quiz content with multiple types
- **QuizAttempt**: User quiz attempts
- **Assignment**: Homework and projects
- **AssignmentSubmission**: Student submissions

### AI & Support
- **AIConversation**: Chat sessions
- **AIMessage**: Individual messages
- **GrammarCheck**: Text correction
- **QuizSuggestion**: AI-generated questions

### Business Logic
- **Plan**: Subscription plans
- **Subscription**: User/institute subscriptions
- **Entitlement**: Feature access control

### Communication
- **Announcement**: System/institute announcements
- **Notification**: User notifications
- **NotificationPreference**: User preferences

## Development

### Running Tests
```bash
python manage.py test
```

### Code Quality
```bash
# Install pre-commit hooks
pre-commit install

# Run checks
pre-commit run --all-files
```

### Database
```bash
# Reset database
python manage.py flush

# Create sample data
python manage.py loaddata sample_data.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Django debug mode | `True` |
| `SECRET_KEY` | Django secret key | Auto-generated |
| `DATABASE_URL` | Database connection | `sqlite:///db.sqlite3` |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |
| `JWT_ACCESS_TOKEN_LIFETIME` | JWT access token lifetime (minutes) | `60` |
| `JWT_REFRESH_TOKEN_LIFETIME` | JWT refresh token lifetime (days) | `1` |

## Architecture

- **Django 4.2**: Web framework
- **Django REST Framework**: API framework
- **JWT Authentication**: Token-based auth
- **Multi-tenant**: Institute-based isolation
- **Modular Design**: App-based architecture
- **JSON Fields**: Flexible content storage
- **Role-based Access**: Granular permissions

## Contributing

1. Follow Django coding standards
2. Write tests for new features
3. Update documentation
4. Use meaningful commit messages
5. Create feature branches 