
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

### License

[Add your license information here]
