# Topaz Image Enhancement UI

A modern web interface for enhancing images using Topaz Labs' AI models, featuring real-time comparison tools and fine-tuned controls.

## Features

- 🖼️ Real-time before/after comparison with interactive slider
- 🔍 Advanced zoom and pan capabilities for detailed inspection
- 🎚️ Precise control over enhancement parameters
- 🎯 Multiple enhancement presets optimized for different use cases
- 📱 Responsive design with touch support
- ⚡ Fast processing with real-time progress tracking

## Enhancement Models

### Traditional Models (Fast)
- **Standard V2** - Balanced enhancement for high-quality photos
- **High Fidelity V2** - Maximum detail preservation

### AI Models (Advanced)
- **Recovery V2** - Reconstruct detail from tiny images (32-256px)
- **Super Focus V2** - Fix severely blurred images
- **Redefine** - Creative upscaling with AI-generated detail

## 🚀 Quick Setup

### What You Need
1. **Node.js** (v18+) - Download from [nodejs.org](https://nodejs.org/)
2. **Git** - Download from [git-scm.com](https://git-scm.com/)
3. **Topaz API Key** - Get one at [topazlabs.com/api](https://www.topazlabs.com/api)

### Installation (5 minutes)

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd topaz-playground
   npm install -g pnpm
   pnpm install
   ```

2. **Add your API key**
   ```bash
   cd apps/api
   # Create .env file with your API key
   echo "TOPAZ_API_KEY=your-api-key-here" > .env
   echo "CORS_ORIGIN=http://localhost:5173" >> .env
   echo "PORT=3001" >> .env
   ```

3. **Start the app**
   ```bash
   cd ../..
   pnpm dev
   ```

4. **Open in browser**: http://localhost:5173

### Usage

1. **Upload** an image (drag & drop or click)
2. **Choose** a model preset
3. **Adjust** settings (detail, scale, etc.)
4. **Click** "Enhance"
5. **Compare** results with the slider

## Troubleshooting

**App won't start?**
- Make sure Node.js v18+ is installed: `node --version`
- Install pnpm: `npm install -g pnpm`

**API errors?**
- Check your Topaz API key in `apps/api/.env`
- Verify you have API credits remaining

**Port conflicts?**
- The app will automatically use different ports if needed
- Backend: 3001, Frontend: 5173

## Project Structure

```
topaz-playground/
├── apps/web/     # React frontend
├── apps/api/     # Express backend
└── package.json  # Root config
```

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Build**: Turborepo with pnpm workspaces

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Add your license information here]
