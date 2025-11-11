# Instagram Integration Setup Guide

## Overview

The Instagram integration has been fully implemented. This guide will help you set up and configure the integration.

## Prerequisites

1. **Instagram Creator Account** - Your client needs a Creator or Business Instagram account
2. **Meta Developer Account** - Create an app at [Meta for Developers](https://developers.facebook.com/)
3. **Access Token** - Generate an Instagram Graph API access token

## Step 1: Database Migration

Run the Prisma migration to add the Instagram post to project relationship:

```bash
npx prisma migrate dev --name add_instagram_project_relation
npx prisma generate
```

This will:
- Add `projectId` field to `InstagramPost` model
- Add relation between `InstagramPost` and `Project`

## Step 2: Meta Developer Setup

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app (choose "Business" type)
3. Add "Instagram Graph API" product to your app
4. Configure OAuth redirect URIs (if needed)
5. Generate a User Access Token for your Instagram Creator account
6. Get your Instagram User ID (can be found in the API response or Graph API Explorer)

## Step 3: Environment Variables

Add the following to your `.env.local` file:

```env
# Instagram API Configuration
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_USER_ID=your_user_id

# Instagram Sync Settings
INSTAGRAM_SYNC_ENABLED=true
INSTAGRAM_SYNC_INTERVAL_HOURS=6
INSTAGRAM_AUTO_CREATE_PROJECTS=false  # Set to true to auto-create projects
INSTAGRAM_CRON_SECRET=your_random_secret_token_here

# System User ID (optional - will use first admin user if not set)
INSTAGRAM_SYSTEM_USER_ID=admin_user_id
```

### Getting Your Access Token

1. Use the [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Generate a User Token with `instagram_graph_user_media` permission
4. Exchange for a Long-Lived Token (valid for 60 days)
5. Copy the token to `INSTAGRAM_ACCESS_TOKEN`

### Getting Your User ID

1. Use the Graph API Explorer
2. Make a request to: `GET /me?fields=id`
3. Copy the ID to `INSTAGRAM_USER_ID`

### Generating Cron Secret

Generate a random secret token for protecting the cron endpoint:

```bash
# Using openssl
openssl rand -hex 32

# Or use any random string generator
```

## Step 4: Test the Integration

### Manual Sync

1. **Using the API:**
   ```bash
   curl -X POST http://localhost:3020/api/instagram/sync \
     -H "Cookie: your-auth-cookie"
   ```

2. **Using the Script:**
   ```bash
   npm run instagram-sync
   # Or
   tsx scripts/instagram-sync.ts
   ```

### Verify Posts

Check if posts were synced:

```bash
curl http://localhost:3020/api/instagram/posts
```

### Convert Post to Project

Convert a specific post to a project:

```bash
curl -X POST http://localhost:3020/api/instagram/posts/{post-id}/convert \
  -H "Cookie: your-auth-cookie" \
  -H "Content-Type: application/json" \
  -d '{"published": false}'
```

## Step 5: Set Up Scheduled Sync

### Option A: Vercel Cron (Recommended for Vercel deployments)

Create or update `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/instagram-sync?secret=YOUR_CRON_SECRET",
    "schedule": "0 */6 * * *"
  }]
}
```

This will sync every 6 hours.

### Option B: External Cron Service

Use services like:
- [cron-job.org](https://cron-job.org/)
- [EasyCron](https://www.easycron.com/)
- [GitHub Actions](https://github.com/features/actions)

Set up a cron job to call:
```
GET https://your-domain.com/api/cron/instagram-sync?secret=YOUR_CRON_SECRET
```

Recommended schedule: Every 6 hours (`0 */6 * * *`)

### Option C: Manual Trigger

Use the admin panel or API endpoint to manually trigger syncs.

## API Endpoints

### Manual Sync
- **POST** `/api/instagram/sync`
- **Auth:** Admin/Editor required
- **Body:** `{ "autoCreateProjects": false }` (optional)

### List Posts
- **GET** `/api/instagram/posts`
- **Query Params:**
  - `converted=true|false` - Filter by conversion status
  - `limit=25` - Number of posts to return
  - `offset=0` - Pagination offset
  - `isActive=true|false` - Filter by active status

### Get Post
- **GET** `/api/instagram/posts/[id]`
- Returns post details with project relation

### Convert Post
- **POST** `/api/instagram/posts/[id]/convert`
- **Auth:** Admin/Editor required
- **Body:** `{ "published": false }` (optional)

### Delete Post
- **DELETE** `/api/instagram/posts/[id]`
- **Auth:** Admin/Editor required

### Scheduled Sync
- **GET** `/api/cron/instagram-sync?secret=YOUR_SECRET`
- Protected with secret token

## Workflow

1. **Sync Instagram Feed**
   - Fetches latest posts from Instagram
   - Downloads and processes images
   - Stores posts in database

2. **Review Posts**
   - View posts at `/api/instagram/posts`
   - Check which posts are new

3. **Convert to Projects**
   - Manually convert posts you want to publish
   - Or enable `INSTAGRAM_AUTO_CREATE_PROJECTS=true` for automatic conversion
   - Projects are created as **unpublished** by default

4. **Publish Projects**
   - Review converted projects in admin panel
   - Edit if needed
   - Publish when ready

## Troubleshooting

### "INSTAGRAM_ACCESS_TOKEN is not set"
- Make sure you've added the token to `.env.local`
- Restart your development server after adding environment variables

### "No admin user found"
- Make sure you have at least one admin user in the database
- Or set `INSTAGRAM_SYSTEM_USER_ID` to a valid user ID

### "Instagram API error: Invalid OAuth access token"
- Your access token may have expired
- Generate a new long-lived token
- Consider implementing token refresh logic

### "Failed to download image"
- Check your internet connection
- Verify the image URL is accessible
- Check Instagram API rate limits

### Posts not syncing
- Check `INSTAGRAM_SYNC_ENABLED` is set to `true`
- Verify your access token is valid
- Check server logs for errors

## Rate Limits

Instagram Graph API has rate limits:
- **User Token:** 200 requests per hour per user
- **App Token:** Varies by app

The sync process respects these limits and includes retry logic.

## Security Notes

1. **Never commit `.env.local`** - Keep all tokens secret
2. **Use strong cron secret** - Generate a random, long secret token
3. **Rotate tokens regularly** - Refresh access tokens periodically
4. **Monitor API usage** - Watch for unusual activity

## Next Steps

- Set up scheduled sync
- Test with real Instagram account
- Configure auto-create projects (optional)
- Build admin UI for managing posts (optional)

