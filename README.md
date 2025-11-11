# 🏆 AURIN Platform

Blockchain-verified achievement platform for permanent, verifiable digital credentials.

## 📚 Documentation

- **[Complete Documentation](./AURIN_COMPLETE_DOCUMENTATION.md)** - Everything about AURIN: architecture, database schema, user flows, verification system
- **[Setup Guide](./SETUP_GUIDE.md)** - Step-by-step setup instructions for developers
- **[Admin Access Guide](./ADMIN_ACCESS_GUIDE.md)** - How to set up admin access
- **[Custom Email Setup](./CUSTOM_EMAIL_SETUP.md)** - Configure custom email service

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations (in Supabase SQL Editor)
# See SETUP_GUIDE.md for migration order

# Start development server
npm run dev
```

## ✨ Features

- ✅ Blockchain-verified badges (NFTs on Base Mainnet)
- ✅ Event management system
- ✅ Organizer verification
- ✅ Event verification (admin approval)
- ✅ Self-badge issuance prevention
- ✅ Public profile links
- ✅ Resume line generator
- ✅ Premium UI/UX with animations

## 🔐 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Event verification required before badge issuance
- ✅ Organizer verification required
- ✅ Self-badge issuance prevention
- ✅ Input validation and sanitization

## 📖 Learn More

See [AURIN_COMPLETE_DOCUMENTATION.md](./AURIN_COMPLETE_DOCUMENTATION.md) for full details.
