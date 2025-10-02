# NiraPoth - AI-Powered Road Safety Platform

Making roads safer through technology and transparency.

## Features

- 🛡️ AI-powered traffic monitoring
- 🚦 Real-time accident detection
- 📊 Transparent accountability dashboard
- 🗺️ Traffic navigation with route optimization
- 👥 Citizen participation platform

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Maps API key (for traffic navigation features)

### Environment Setup

1. Copy the example environment file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Add your Google Maps API key to `.env.local`:
   \`\`\`
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   \`\`\`

3. To get a Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
     - Directions API
   - Create credentials (API Key)
   - **Important**: Restrict your API key for security:
     - Go to API Key settings
     - Under "Application restrictions", select "HTTP referrers"
     - Add your domain (e.g., `yourdomain.com/*`, `localhost:3000/*` for development)
     - Under "API restrictions", select "Restrict key" and choose only the APIs you enabled
   - Copy the API key to your `.env.local` file

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/public` - Static assets
- `/scripts` - Utility scripts

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key for traffic navigation | Yes (for maps feature) |

**Note**: The `NEXT_PUBLIC_` prefix is required for the Google Maps JavaScript API to work in the browser. To secure your API key, always use HTTP referrer restrictions and API restrictions in the Google Cloud Console.

## Security Best Practices

- Always restrict your Google Maps API key using HTTP referrer restrictions
- Enable only the specific Google Maps APIs you need
- Never commit `.env.local` to version control
- Regularly rotate your API keys
- Monitor your API usage in Google Cloud Console

## License

MIT
