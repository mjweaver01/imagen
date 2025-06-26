# Imagen

A Vue.js app for generating images using AI.

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure OpenAI API:**

   - For local development, create a `.env` file in the project root:
     ```
     OPENAI_API_KEY=your_actual_openai_api_key_here
     ```
   - For Netlify deployment, set the environment variable in your Netlify site settings

3. **Start development server:**

   ```bash
   npm run dev
   ```

   **Or use Netlify Dev for full edge functions support:**

   ```bash
   npm run netlify:dev
   ```

## Netlify Deployment

This app is optimized for Netlify deployment with Edge Functions for enhanced performance and streaming support.

### Deploy to Netlify

1. **Connect your repository** to Netlify
2. **Set environment variables** in Netlify site settings:
   - `OPENAI_API_KEY`: Your OpenAI API key
3. **Build settings** are automatically configured via `netlify.toml`
4. **Deploy** - Netlify will automatically build and deploy your site

### Local Development with Netlify

```bash
# Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# Start local development with edge functions
npm run netlify:dev
```

## Technology Stack

- Vue 3 with TypeScript
- OpenAI API
- Netlify Edge Functions (Deno runtime)
- Marked (for markdown rendering)
- Vite (build tool)
