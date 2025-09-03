# WhereNaYou Team Setup Guide

## 🚀 Quick Start for New Team Members

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL
- Git

### 1. Clone and Setup Backend
```bash
git clone <repository-url>
cd whernayoucapstone/backend-wny

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt
pip install python-dotenv

# Create your environment file
copy .env.example .env
```

### 2. Configure Your Environment
Edit your `.env` file with your local settings:
```env
# REQUIRED: Change these for your local setup
SECRET_KEY=generate-your-own-secret-key
DEBUG=True
DB_PASSWORD=your-local-db-password

# OPTIONAL: Customize if needed
DB_NAME=wny-db-yourname
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 3. Setup Frontend
```bash
cd ../frontend-wny
npm install

# Create your environment file
copy .env.example .env
```

### 4. Database Setup
```bash
cd backend-wny
python manage.py migrate
python manage.py createsuperuser
```

### 5. Run Development Servers
```bash
# Backend (Terminal 1)
cd backend-wny
venv\Scripts\activate
python manage.py runserver 0.0.0.0:8000

# Frontend (Terminal 2)
cd frontend-wny
npm start
```

## 🔒 Security Guidelines for Team

### ⚠️ CRITICAL - Never Commit These Files:
- `.env` files (any environment)
- Database credentials
- Secret keys
- Personal configuration

### ✅ Safe to Commit:
- `.env.example` files
- Code changes
- Documentation updates
- Configuration templates

### 🛡️ Best Practices:
1. **Always use your own `.env` file** - never share actual credentials
2. **Generate unique SECRET_KEY** for each environment
3. **Use different database names** to avoid conflicts (e.g., `wny-db-john`, `wny-db-mary`)
4. **Keep DEBUG=True** only in development
5. **Update .env.example** when adding new environment variables

## 🤝 Team Collaboration Workflow

### Branch Strategy
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Work on your changes
git add .
git commit -m "feat: descriptive commit message"

# Push and create PR
git push origin feature/your-feature-name
```

### Code Review Checklist
- [ ] No hardcoded secrets in code
- [ ] Environment variables used for configuration
- [ ] `.env` files not committed
- [ ] Tests pass locally
- [ ] Documentation updated if needed

## 🐛 Common Issues & Solutions

### "ModuleNotFoundError: No module named 'dotenv'"
```bash
pip install python-dotenv
```

### "CORS errors in frontend"
Check your `.env` files:
- Backend: `CORS_ALLOWED_ORIGINS=http://localhost:3000`
- Frontend: `REACT_APP_API_URL=http://127.0.0.1:8000/api/`

### "Database connection failed"
1. Ensure PostgreSQL is running
2. Check your `.env` database credentials
3. Create database if it doesn't exist

### "SECRET_KEY not found"
Make sure you have:
1. Created `.env` file from `.env.example`
2. Added `SECRET_KEY=your-key` to `.env`
3. Installed `python-dotenv`

## 📁 Project Structure
```
whernayoucapstone/
├── backend-wny/           # Django backend
│   ├── .env              # Your local config (DO NOT COMMIT)
│   ├── .env.example      # Template (safe to commit)
│   ├── apps/             # Django apps
│   └── backend/          # Settings
├── frontend-wny/         # React frontend
│   ├── .env              # Your local config (DO NOT COMMIT)
│   ├── .env.example      # Template (safe to commit)
│   └── src/              # React source
└── mobile-wny/           # React Native mobile
```

## 🆘 Getting Help

1. Check this documentation first
2. Look at existing `.env.example` files
3. Ask team members in chat
4. Create GitHub issue for bugs

## 📝 Adding New Environment Variables

When you need new environment variables:

1. **Add to code** using `os.getenv('VAR_NAME', 'default')`
2. **Update .env.example** with the new variable
3. **Document in this file** if it's important
4. **Notify team** to update their local `.env`

Example:
```python
# In settings.py
NEW_FEATURE_ENABLED = os.getenv('NEW_FEATURE_ENABLED', 'False').lower() == 'true'
```

```env
# In .env.example
NEW_FEATURE_ENABLED=False
```
