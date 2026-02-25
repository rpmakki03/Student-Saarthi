# Student Saarthi - AI Career Guidance App

A Next.js application that provides personalized career guidance for Indian students after 10th class using Google Gemini AI.

## Features

- **Aptitude & Interest Quiz**: Interactive quiz to assess student preferences
- **AI-Powered Guidance**: Career recommendations using Gemini 1.5 model
- **Voice Input**: Speech-to-text for quiz answers using Web Speech API
- **Hindi Speech Output**: Text-to-speech in Hindi using Google Cloud TTS
- **Stream Recommendations**: Science, Commerce, or Arts stream suggestions
- **Career Paths**: Detailed career options and next steps
- **College Information**: Top colleges by stream with ratings and details
- **Academic Timeline**: Visual timeline of educational journey

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui components
- **AI**: Google Gemini 1.5 Flash model
- **Text-to-Speech**: Google Cloud Text-to-Speech API
- **Authentication**: Supabase Auth (SSR)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Theming**: Dark/Light mode toggle (next-themes)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```bash
# Google Gemini API Key
GOOGLE_API_KEY=your_gemini_api_key_here

# Google Cloud Text-to-Speech (optional - for audio generation)
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_service_account_key.json

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Get API Keys

#### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to `GOOGLE_API_KEY`

#### Google Cloud Text-to-Speech (Optional)
1. Enable Google Cloud Text-to-Speech API
2. Create a service account and download the JSON key
3. Add the path to `GOOGLE_APPLICATION_CREDENTIALS`

### 4. Run the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## App Structure

```
app/
├── api/
│   ├── guidance/     # Career guidance using Gemini
│   └── tts/         # Text-to-speech conversion
├── quiz/            # Aptitude & interest quiz
├── guidance/        # Career guidance results
├── timeline/        # Academic timeline
├── colleges/        # College recommendations
└── login/           # Authentication

components/
├── site/            # Site-wide components
└── ui/              # Reusable UI components

proxy.ts             # Next.js 16 middleware proxy for Supabase Auth
```

## Key Features Implementation

### Quiz System
- 8 questions covering aptitude, interests, and goals
- Progress tracking and validation
- Results passed to guidance page

### AI Guidance
- Structured prompts for consistent responses
- JSON parsing for reliable data extraction
- Error handling and fallbacks

### Voice Features
- Speech recognition for quiz input
- Hindi text-to-speech for guidance output
- Browser compatibility checks

### UI/UX
- Responsive design with Tailwind CSS
- Dark/Light mode theme toggle
- Loading states and animations
- Accessible form controls
- Modern card-based layout

## API Endpoints

### POST /api/guidance
Takes student profile/quiz answers and returns career guidance.

**Request:**
```json
{
  "answer": "Student's interests and goals description"
}
```

**Response:**
```json
{
  "stream": "Science",
  "rationale": "Explanation for recommendation",
  "subjects": ["Physics", "Chemistry", "Mathematics"],
  "careers": ["Engineering", "Medicine", "Research"],
  "colleges_advice": "College selection advice",
  "next_steps": ["Step 1", "Step 2", "Step 3"]
}
```

### POST /api/tts
Converts text to Hindi speech using Google Cloud TTS.

**Request:**
```json
{
  "text": "Text to convert to speech"
}
```

**Response:** MP3 audio file

## Development

### Adding New Quiz Questions
Edit `app/quiz/page.tsx` and add questions to the `quizQuestions` array.

### Customizing AI Prompts
Modify the system prompts in `app/api/guidance/route.ts` to change the AI's behavior.

### Styling Changes
Use Tailwind CSS classes and modify `app/globals.css` for custom styles.

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred platform (Vercel, Netlify, etc.)

3. Set environment variables in your deployment platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
