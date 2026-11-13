# MINDNEST

Personal growth and emotional wellness platform.

## Add the application source

The Next.js application source is provided separately as `MINDNEST_V1_MVP.zip`.
Extract the archive and copy the contents of its `mindnest-v1` folder into this repository root. Preserve the `src` and `supabase` folders and all root configuration files.

Then import this repository into Vercel and use the default Next.js build settings.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Important

The current MVP stores user entries in the current browser's local storage. Supabase schema and client scaffolding are included, but authentication and cloud CRUD are not yet connected. Mindy AI needs a server-side API key to provide live AI responses.
