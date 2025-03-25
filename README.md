# Beat the Bot!

This app was created with the help of AI. The tech spec was created using [OpenAI](https://openai.com/), which was shared and created in collaboration with [Cursor IDE](https://www.cursor.com/).

This is the original prompt given to OpenAI:

```text
create a leaderboard app that uses supabase. use these supabase credentials and put them in an .env file

SUPABASE_URL=REDACTD
API_KEY=REDACTED

use a table in supabase called “winners” and the fields you care about are “name” (text) and “score” (int8)

create backend endpoints for 1) add winner 2) get winners

the frontend react app calls the get winners endpoint and renders names of winners appearing in bubbles that float around on the screen. the bubble size is directly proportional to the score. have the frontend poll the backend every 2 seconds. do not include any frontend code for adding a winner
```

Both the tech spec and the app were iterated upon. Some manual adjustents were needed, but most of the features were created by chatting with AI.

A web application that displays a floating bubble visualization of winners and their scores using Supabase as the backend.

## Features

- Floating bubble visualization with dynamic sizing based on score
- Real-time updates via polling every 2 seconds
- Backend API for adding or updating winners
- Beautiful color scheme with animations

## Technology Stack

- **Frontend**: Next.js with React
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account with a project set up

### Environment Setup

1. Create a `.env.local` file in the root directory with the following:

```
SUPABASE_URL=https://yygcjlmnqbsdozvpcbjm.supabase.co
SUPABASE_API_KEY=your_supabase_api_key
```

2. Set up your Supabase database with a `winners` table that has the following schema:
   - `id` (INT8): Unique identifier (Primary Key)
   - `created_at` (TIMESTAMPTZ): Timestamp of record creation
   - `name` (TEXT): Winner's name
   - `score` (INT4): Winner's score

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## API Endpoints

### `GET /api/winners`

Returns a list of all winners with their scores.

### `POST /api/winners`

Adds a new winner or updates an existing one.

Request body:

```json
{
  "name": "octopus",
  "score": 100
}
```

Example curl request:

```bash
curl -X POST \
  http://localhost:3000/api/winners \
  -H "Content-Type: application/json" \
  -d '{"name": "octopus", "score": 100}'
```

## Deployment

The app can be easily deployed to Vercel:

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Add the environment variables in the Vercel dashboard
4. Deploy!
