# Calorie Deficit AI - Next.js

Converted from vanilla HTML/CSS/JS to Next.js for deployment on imuii.id.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Deploy to imuii.id

1. Upload project folder
2. Set environment variables in imuii.id dashboard
3. Build command: `npm run build`
4. Start command: `npm start`

## Environment Variables

Required variables (set in imuii.id):
- `NEXT_PUBLIC_OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
