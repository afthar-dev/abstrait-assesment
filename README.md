# Smart Bookmark App

This is a simple bookmark manager I built with Next.js and Supabase. The main goal was to keep it small but real: Google login, private user data, realtime updates, and a clean UI deployed on Vercel.

---

## Live

Live URL: **https://abstrait-assesment.vercel.app/**
GitHub Repo: **https://github.com/afthar-dev/abstrait-assesment**

---

## What the app does

* Sign in using Google OAuth
* Add bookmarks with a title and URL
* Edit and delete your own bookmarks
* Each user only sees their own data
* Realtime updates across tabs without refreshing

---

## Tech Stack

Next.js (App Router), Supabase (Auth, Postgres, Realtime), Tailwind CSS, TypeScript.

---

## My experience building this

Most of the real work wasn’t the UI. It was understanding how Supabase behaves inside a Next.js app.

At the beginning, authentication kept returning `null` on the server even though login worked. That turned out to be a cookie handling issue with the SSR client. Once that was fixed, I ran into realtime problems that worked locally but felt unreliable in production.

Some of the things I had to figure out along the way:

* I ran into an issue where realtime updates didn’t work consistently because the subscription was starting before the user’s auth session was fully ready on the client. The connection looked active, but it wasn’t actually listening with the correct user context. The fix was to wait for `supabase.auth.getSession()` and only start the realtime channel after a valid session existed. Once the subscription happened after authentication finished, updates became reliable.
* One issue I ran into was that delete actions worked in the database but didn’t update the UI through realtime. It turned out that Postgres doesn’t include the full deleted row data in realtime events by default, so my app couldn’t tell which bookmark was removed. The fix was running `ALTER TABLE bookmarks REPLICA IDENTITY FULL;`, which makes Postgres send the full previous row in delete events. After that, realtime updates started working properly because the UI finally knew exactly which item to remove.
* The table also had to be added to the `supabase_realtime` publication for real time updation for the ui
* Refetching the whole table after every change caused flickering, so I switched to updating only the changed rows

None of these issues were obvious at first, and most of my debugging time went into understanding how auth, RLS policies, and realtime actually interact.

---

## Database

Table: `bookmarks`

Fields:

* id
* title
* url
* user_id
* created_at

Row Level Security is enabled so users can only select, insert, update, or delete their own bookmarks using:

```
auth.uid() = user_id
```

---

## How to run locally

Clone the repo and install:

```
npm install
npm run dev
```

Add your Supabase keys in `.env.local`.

---
