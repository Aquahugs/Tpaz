# Topaz Image Enhancement UI

A modern web interface for enhancing images using Topaz Labs' AI models, featuring real-time comparison tools and fine-tuned controls.

![UI Preview](docs/preview.png)

## Features

- 🖼️ Real-time before/after comparison with interactive slider
- 🔍 Advanced zoom and pan capabilities for detailed inspection
- 🎚️ Precise control over enhancement parameters
- 🎯 Multiple enhancement presets optimized for different use cases
- 📱 Responsive design with touch support
- ⚡ Fast processing with real-time progress tracking
- 🤖 Support for both traditional GAN and generative AI models

## Enhancement Models

This project leverages five specialized Topaz enhancement models across two categories:

### Traditional GAN Models (Fast Processing)

#### Standard V2 (Basic Preset)
- **Best for**: High-quality photos shot on good glass
- **Processing**: Direct/synchronous (immediate results)
- **Characteristics**: 
  - Fast and consistent processing
  - Gentle cleaning and sharpening
  - Preserves original image characteristics
  - Balanced enhancement approach

#### High Fidelity V2 (Sharp Preset)
- **Best for**: Images requiring maximum detail preservation
- **Processing**: Direct/synchronous (immediate results)
- **Characteristics**:
  - Enhanced micro-texture preservation
  - Superior color nuance retention
  - Higher processing time than Standard V2
  - Maximum quality output

### Generative AI Models (Advanced Processing)

#### Recovery V2
- **Best for**: Tiny images (32-256px) requiring detail reconstruction
- **Processing**: Asynchronous with progress tracking
- **Characteristics**:
  - AI-generated detail reconstruction
  - Optimized for extremely low-resolution inputs
  - Creative interpretation of missing detail
  - Longer processing time

#### Super Focus V2
- **Best for**: Severely blurred or out-of-focus images
- **Processing**: Asynchronous with progress tracking
- **Characteristics**:
  - Advanced deblurring algorithms
  - Focus boost control for intensity
  - Seed-based reproducible results
  - Specialized for motion blur and focus issues

#### Redefine
- **Best for**: Creative upscaling with AI-generated detail
- **Processing**: Asynchronous with progress tracking
- **Characteristics**:
  - Most creative and interpretive model
  - Prompt-based enhancement control
  - Autoprompt feature for automatic optimization
  - Creativity and texture controls
  - Advanced noise reduction and sharpening

## 🚀 Quick Start Guide

Follow these step-by-step instructions to get the Topaz Image Enhancement UI running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

#### 1. Node.js (v18 or higher)
**Windows:**
- Download from [nodejs.org](https://nodejs.org/)
- Run the installer and follow the setup wizard
- Verify installation: Open Command Prompt and run `node --version`

**macOS:**
- Download from [nodejs.org](https://nodejs.org/) or use Homebrew: `brew install node`
- Verify installation: Open Terminal and run `node --version`

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. pnpm Package Manager (v8.15.6 or higher)
After installing Node.js, install pnpm globally:
```bash
npm install -g pnpm
```
Verify installation: `pnpm --version`

#### 3. Git
**Windows:** Download from [git-scm.com](https://git-scm.com/)
**macOS:** `brew install git` or download from [git-scm.com](https://git-scm.com/)
**Linux:** `sudo apt-get install git`

#### 4. Topaz API Key
- Sign up at [Topaz Labs API](https://www.topazlabs.com/api)
- Navigate to your API dashboard
- Generate a new API key
- Keep this key handy for the setup process

### Step-by-Step Installation

#### Step 1: Clone the Repository
Open your terminal/command prompt and run:
```bash
git clone <repository-url>
cd topaz-playground
```

#### Step 2: Install Dependencies
From the root directory of the project:
```bash
pnpm install
```
This will install all dependencies for both the frontend and backend applications.

#### Step 3: Set Up Environment Variables
1. Navigate to the API directory:
   ```bash
   cd apps/api
   ```

2. Create a `.env` file:
   **Windows (Command Prompt):**
   ```cmd
   echo. > .env
   ```
   **macOS/Linux:**
   ```bash
   touch .env
   ```

3. Open the `.env` file in your preferred text editor and add:
   ```bash
   # Topaz API Configuration
   TOPAZ_API_KEY=your-topaz-api-key-here
   
   # Server Configuration
   CORS_ORIGIN=http://localhost:5173
   PORT=3001
   NODE_ENV=development
   ```

4. Replace `your-topaz-api-key-here` with your actual Topaz API key

#### Step 4: Start the Development Servers
1. Navigate back to the root directory:
   ```bash
   cd ../..
   ```

2. Start both frontend and backend servers:
   ```bash
   pnpm dev
   ```

You should see output similar to:
```
🚀 API server running on port 3001
📍 Health check: http://localhost:3001/api/health
📍 Enhance endpoint: http://localhost:3001/api/enhance
📍 Environment: development
📍 Topaz API Key: Configured

  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### Step 5: Access the Application
1. Open your web browser
2. Navigate to `http://localhost:5173`
3. You should see the Topaz Image Enhancement UI

### Verification Steps

#### Test the Setup
1. **Health Check**: Visit `http://localhost:3001/api/health` - you should see a JSON response with status "ok"

2. **Upload Test**: Try uploading a small image in the UI to verify the API connection

3. **Enhancement Test**: Run a basic enhancement to confirm your Topaz API key is working

### Common Setup Issues & Solutions

#### Issue: "pnpm: command not found"
**Solution:** Install pnpm globally:
```bash
npm install -g pnpm
```

#### Issue: "Port 3001 is already in use"
**Solution:** Either:
- Kill the process using port 3001: `lsof -ti:3001 | xargs kill -9` (macOS/Linux)
- Change the port in `apps/api/.env`: `PORT=3002`

#### Issue: "Port 5173 is already in use"
**Solution:** The Vite dev server will automatically try the next available port (5174, 5175, etc.)

#### Issue: "CORS error" in browser console
**Solution:** Ensure `CORS_ORIGIN` in your `.env` file matches the frontend URL exactly

#### Issue: "Topaz API key not configured"
**Solution:** 
- Verify your `.env` file is in the `apps/api/` directory
- Ensure there are no extra spaces around the API key
- Restart the development server after adding the key

#### Issue: Dependencies fail to install
**Solution:**
- Clear pnpm cache: `pnpm store prune`
- Delete `node_modules` and `pnpm-lock.yaml`, then run `pnpm install` again
- Ensure you're using Node.js v18 or higher

### Development Workflow

Once everything is running:

1. **Frontend Development**: Edit files in `apps/web/src/` - changes will hot-reload automatically
2. **Backend Development**: Edit files in `apps/api/src/` - the server will restart automatically
3. **View Logs**: Check your terminal for both frontend and backend logs
4. **Stop Servers**: Press `Ctrl+C` in the terminal running `pnpm dev`

### Next Steps

- Try uploading different types of images to test the various enhancement models
- Experiment with different parameter settings
- Check the browser developer tools for any console errors
- Review the API logs in your terminal for debugging information

## Local Development Setup

### Project Structure

topaz-playground/
├── apps/
│ ├── web/ # React frontend (Vite + TypeScript)
│ │ ├── src/
│ │ │ ├── components/ # UI components
│ │ │ ├── hooks/ # Custom React hooks
│ │ │ ├── services/ # API client
│ │ │ ├── store/ # Zustand state management
│ │ │ ├── config/ # Preset configurations
│ │ │ └── types/ # TypeScript definitions
│ │ └── package.json
│ └── api/ # Express.js backend
│ ├── src/
│ │ ├── routes/ # API endpoints
│ │ ├── middleware/ # Express middleware
│ │ └── types/ # TypeScript definitions
│ └── package.json
├── package.json # Root package.json (Turborepo)
└── turbo.json # Turborepo configuration


### Usage

1. **Open your browser** to http://localhost:5173
2. **Upload an image** by dragging and dropping or clicking to select
   - Supported formats: JPEG, PNG, TIFF, WebP
   - Maximum file size: 50MB
3. **Choose enhancement settings**:
   - **Preset**: Select from 5 available models
   - **Detail/Sharpen**: Adjust enhancement intensity (0-1)
   - **Scale**: Choose output scale (1x, 2x, or 4x)
   - **Advanced Parameters**: Model-specific controls (creativity, texture, focus boost, etc.)
4. **Click "Enhance"** to start processing
5. **View results** with the interactive before/after comparison slider

### Model-Specific Parameters

#### Traditional Models (Basic/Sharp)
- **Detail**: Sharpening intensity (0-1)
- **Sharpen**: Fine-tune sharpening (optional override)
- **Denoise**: Noise reduction strength (0-1)

#### Recovery V2
- **Detail**: Enhancement intensity (0-1)

#### Super Focus V2
- **Detail**: Focus enhancement intensity (0-1)
- **Focus Boost**: Additional focus strength (0.25-1)
- **Seed**: Reproducible results control

#### Redefine
- **Creativity**: AI interpretation level (1-6)
- **Texture**: Texture enhancement (1-5)
- **Prompt**: Custom enhancement description
- **Autoprompt**: Automatic prompt generation
- **Sharpen**: Sharpening control (0-1)
- **Denoise**: Noise reduction (0-1)

### Available Scripts

From the root directory:

- `pnpm dev` - Start both frontend and backend in development mode
- `pnpm build` - Build both applications for production
- `pnpm test` - Run tests across all packages
- `pnpm type-check` - Run TypeScript type checking
- `pnpm lint` - Run ESLint across all packages

### API Endpoints

- `POST /api/enhance` - Start image enhancement
- `GET /api/status/:processId` - Check enhancement status
- `GET /api/download/:processId` - Download enhanced image
- `GET /api/health` - Health check endpoint

### Processing Modes

The application supports two processing modes based on the model type:

#### Synchronous Processing (Traditional Models)
- **Models**: Standard V2, High Fidelity V2
- Returns enhanced image immediately
- No polling required
- Faster turnaround time
- Best for general photo enhancement

#### Asynchronous Processing (Generative Models)
- **Models**: Recovery V2, Super Focus V2, Redefine
- Returns a `processId` for status polling
- Progress tracking with real-time updates
- Download available when complete
- More intensive AI processing

### Troubleshooting

**Common Issues:**

1. **"No API key" error**
   - Ensure your Topaz API key is correctly set in `apps/api/.env`
   - Verify the API key is valid and has sufficient credits

2. **CORS errors**
   - Check that `CORS_ORIGIN` in `.env` matches your frontend URL
   - Default should be `http://localhost:5173`

3. **Port conflicts**
   - Frontend runs on port 5173, backend on 3001
   - Change ports in `package.json` scripts if needed

4. **Dependencies not installing**
   - Ensure you're using pnpm (not npm or yarn)
   - Try `pnpm install --frozen-lockfile`

5. **TypeScript errors**
   - Run `pnpm type-check` to see detailed errors
   - Ensure all dependencies are installed

6. **Enhancement fails with 404**
   - Check that your Topaz API key has sufficient credits
   - Verify the API endpoints are correct in the logs
   - Some models may not be available in your API tier

7. **Status polling issues**
   - The app handles both async and direct processing modes
   - Check browser console for detailed error messages
   - Generative models take longer to process

8. **Model-specific errors**
   - Recovery V2: Ensure input image is very small (32-256px work best)
   - Super Focus V2: Works best on blurred images
   - Redefine: Requires either prompt or autoprompt enabled

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Zustand
- **Backend**: Node.js, Express, TypeScript, Zod validation
- **Build System**: Turborepo with pnpm workspaces
- **UI Components**: Radix UI primitives
- **Image Processing**: Topaz Labs API integration (5 models)
- **File Upload**: Multer with memory storage
- **State Management**: Zustand for client state
- **Validation**: Zod schemas for type-safe API requests

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request



