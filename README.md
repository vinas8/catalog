# 🐍 Snake Muffin v0.7.0

> A snake breeding and care e-commerce game with real Stripe payments

[![Version](https://img.shields.io/badge/version-0.7.0-purple)](https://github.com/vinas8/catalog)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://vinas8.github.io/catalog/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## 🎯 What is Snake Muffin?

Snake Muffin is a unique web application combining:
- **E-commerce** - Buy real ball pythons with Stripe payments
- **Pet Care Game** - Tamagotchi-style snake care mechanics
- **Collection Management** - Track and manage your purchased snakes

## ✨ Features

### 🛒 Shop & Purchase
- Browse available ball pythons
- Secure Stripe Checkout integration
- Real-time payment processing
- Automatic product delivery

### 🎮 Care Mechanics
- 8 vital stats (hunger, water, temperature, humidity, health, stress, cleanliness, happiness)
- Feed, water, and clean your snakes
- Stats decay over time (requires care)
- Equipment shop (auto-feeders, thermostats, etc.)

### 📊 Collection
- View all purchased snakes
- Track individual stats per snake
- Species and morph information
- Purchase history

## 🚀 Live Demo

**Frontend:** https://vinas8.github.io/catalog/  
**API:** https://catalog.navickaszilvinas.workers.dev

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  GitHub Pages   │      │ Cloudflare Worker │      │     Stripe      │
│   (Frontend)    │─────▶│    (Backend)      │◀─────│   (Payments)    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Cloudflare KV   │
                         │    (Storage)     │
                         └──────────────────┘
```

### Tech Stack

**Frontend:**
- Plain JavaScript (ES6 modules)
- No framework, no build step
- HTML5 + CSS3

**Backend:**
- Cloudflare Workers (serverless)
- Cloudflare KV (storage)
- Stripe API integration

**Deployment:**
- GitHub Pages (static frontend)
- Cloudflare Workers (API)
- GitHub Actions (CI/CD)

## 📁 Project Structure

```
catalog/
├── index.html              # Landing page
├── catalog.html            # Snake shop
├── collection.html         # User collection
├── game.html              # Care game
├── success.html           # Post-purchase
├── src/
│   ├── config/            # Configuration
│   │   ├── app-config.js  # App settings, DEBUG mode
│   │   ├── worker-config.js
│   │   └── stripe-config.js
│   ├── modules/           # Game logic
│   │   ├── game/
│   │   ├── shop/
│   │   └── auth/
│   └── utils/
│       └── logger.js      # Debug logging utility
├── worker/
│   ├── worker.js          # Cloudflare Worker
│   └── wrangler.toml      # Worker config
├── data/                  # Removed - now uses KV
└── docs/                  # Documentation

```

## 🔧 Configuration

### Debug Mode

Debug mode controls console logging and debug UI:

```javascript
// src/config/app-config.js
DEBUG: isLocalhost  // true in localhost, false in production
```

**When DEBUG is true:**
- Console logs visible
- Debug UI elements shown
- Performance timing enabled

**When DEBUG is false (production):**
- No console logs (except warnings/errors)
- Clean user experience
- Better performance

### Environment Detection

The app automatically detects:
- **Localhost** - Development mode, DEBUG on
- **GitHub Pages** - Production mode, DEBUG off

## 📚 Documentation

- **[Setup Guide](docs/SETUP.md)** - Installation and configuration
- **[Cloudflare Setup](docs/CLOUDFLARE-DEPLOYMENT.md)** - Worker deployment
- **[Stripe Setup](docs/STRIPE-SECRET-SETUP.md)** - Payment configuration
- **[Worker Logs](docs/WORKER-LOGS.md)** - Debugging guide
- **[API Reference](docs/v0.5.0.md)** - Complete technical docs

## 🚦 Quick Start

### Prerequisites
- Node.js 16+ (for local development)
- Cloudflare account
- Stripe account

### Local Development

1. **Clone repository**
```bash
git clone https://github.com/vinas8/catalog.git
cd catalog
```

2. **Start local server**
```bash
python -m http.server 8000
# or
npx serve
```

3. **Open in browser**
```
http://localhost:8000
```

### Deploy to Production

1. **Configure Cloudflare Worker**
```bash
cd worker
wrangler login
wrangler publish
```

2. **Push to GitHub**
```bash
git push origin main
# GitHub Pages auto-deploys
```

3. **Configure Stripe Webhook**
- Go to https://dashboard.stripe.com/webhooks
- Add endpoint: `https://YOUR-WORKER.workers.dev/stripe-webhook`
- Select event: `checkout.session.completed`

## 🔐 Environment Variables

Required secrets (set in Cloudflare):
- `STRIPE_SECRET_KEY` - Stripe API key
- `CLOUDFLARE_API_TOKEN` - For KV access
- `CLOUDFLARE_ACCOUNT_ID` - Your account ID

## 🎮 Usage

1. **Browse Catalog** - Visit the shop page
2. **Select Snake** - Choose a ball python
3. **Checkout** - Pay with Stripe
4. **Receive Snake** - Automatic delivery to collection
5. **Care for Snake** - Feed, water, clean
6. **Repeat** - Build your collection!

## 🧪 Testing

```bash
# Run all tests (if added)
npm test

# Test worker locally
cd worker
wrangler dev
```

## 📊 Current Status

**Version:** 0.7.0 (Email Notifications + Stripe Sync)  
**Status:** ✅ Production Ready  
**Features:** Core functionality complete

### Working Features ✅
- Stripe payment integration
- Product catalog from KV
- User collection management
- Purchase flow (checkout → webhook → assignment)
- Dynamic URLs (localhost + production)
- Debug mode toggle

### Known Limitations ⚠️
- Webhook configuration requires manual setup
- Limited product variety (1 snake currently)
- Basic UI (functional but minimal)

## 🛣️ Roadmap

- [ ] More snake species and morphs
- [ ] Breeding mechanics
- [ ] Multiplayer features
- [ ] Mobile app
- [ ] Advanced care mechanics
- [ ] Snake genetics calculator

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

1. Open an issue describing your idea
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## 📝 License

MIT License - See [LICENSE](LICENSE) file

## 👤 Author

**vinas8**
- GitHub: [@vinas8](https://github.com/vinas8)
- Project: [Snake Muffin](https://github.com/vinas8/catalog)

## 🙏 Acknowledgments

- Stripe for payment infrastructure
- Cloudflare for Workers and KV
- GitHub for hosting and CI/CD

---

**Built with ❤️ and 🐍**
