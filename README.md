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

## Enhancement Models

This project leverages two specialized Topaz enhancement models:

### Standard V2 (Basic Preset)
- **Best for**: High-quality photos shot on good glass
- **Characteristics**: 
  - Fast and consistent processing
  - Gentle cleaning and sharpening
  - Preserves original image characteristics
  - Balanced enhancement approach

### High Fidelity V2 (Sharp Preset)
- **Best for**: Images requiring maximum detail preservation
- **Characteristics**:
  - Enhanced micro-texture preservation
  - Superior color nuance retention
  - Higher processing time
  - Maximum quality output

## Local Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v8.15.6 or higher)
- **Topaz API Key** (required for image enhancement)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd topaz-playground
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `apps/api` directory:
   ```bash
   # apps/api/.env
   TOPAZ_API_KEY=your-topaz-api-key-here
   CORS_ORIGIN=http://localhost:5173
   PORT=3001
   NODE_ENV=development
   ```

   **Getting a Topaz API Key:**
   - Sign up at [Topaz Labs API](https://www.topazlabs.com/api)
   - Navigate to your API dashboard
   - Generate a new API key
   - Copy the key to your `.env` file

4. **Start the development servers**
   ```bash
   pnpm dev
   ```

   This will start:
   - **Frontend (Web)**: http://localhost:5173
   - **Backend (API)**: http://localhost:3001

### Usage

1. **Open your browser** to http://localhost:5173
2. **Upload an image** by dragging and dropping or clicking to select
   - Supported formats: JPEG, PNG, TIFF, WebP
   - Maximum file size: 50MB
3. **Choose enhancement settings**:
   - **Preset**: Basic (Standard V2) or Sharp (High Fidelity V2)
   - **Detail**: Adjust sharpening intensity (0-1)
   - **Scale**: Choose output scale (1x, 2x, or 4x)
4. **Click "Enhance"** to start processing
5. **View results** with the interactive before/after comparison slider

### Project Structure
