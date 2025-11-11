# Instagram API Integration Implementation Plan

## Overview

This document outlines the complete implementation plan for integrating Instagram content into the portfolio CMS. The integration will fetch Instagram posts from a Creator account using the official Instagram Graph API, download and store images locally, and convert posts to unpublished projects that can be reviewed and published by the client.

## Architecture Decision

**Using Official Instagram Graph API** (not third-party packages)

### Why Official API?
- ✅ **Security**: No password storage, uses OAuth 2.0 tokens
- ✅ **Reliability**: Official support from Meta, stable endpoints
- ✅ **Compliance**: Terms of Service compliant
- ✅ **No Supply Chain Risk**: No third-party npm packages
- ✅ **Future-proof**: Official updates and new features

### API Endpoints Used
- `GET /{user-id}/media` - Fetch user's media
- `GET /{media-id}` - Get specific media details
- `GET /{user-id}` - Get user profile info

## Database Schema Updates

### InstagramPost Model Enhancement
```prisma
model InstagramPost {
  id          String   @id @default(cuid())
  instagramId String   @unique
  imageUrl    String
  caption     String
  postedAt    DateTime
  syncedAt    DateTime @default(now())
  isActive    Boolean  @default(true)
  projectId   String?  // Link to converted project
  project     Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)
  
  @@map("instagram_posts")
}
```

### Project Model Update
```prisma
model Project {
  // ... existing fields
  instagramPost InstagramPost?
}
```

## Environment Variables

Add to `.env.local`:
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
INSTAGRAM_CRON_SECRET=your_random_secret_token

# System User ID (for creating projects)
INSTAGRAM_SYSTEM_USER_ID=admin_user_id
```

## File Structure

```
src/
├── lib/
│   ├── instagram-service.ts          # Core Instagram API service
│   ├── instagram-project-converter.ts # Conversion logic
│   └── image-downloader.ts           # Image download utilities
├── app/
│   └── api/
│       ├── instagram/
│       │   ├── sync/
│       │   │   └── route.ts          # Manual sync endpoint
│       │   ├── posts/
│       │   │   ├── route.ts          # List posts
│       │   │   └── [id]/
│       │   │       ├── route.ts      # Get/delete post
│       │   │       └── convert/
│       │   │           └── route.ts  # Convert to project
│       │   └── config/
│       │       └── route.ts          # Get/set Instagram config
│       └── cron/
│           └── instagram-sync/
│               └── route.ts          # Scheduled sync endpoint
└── scripts/
    └── instagram-sync.ts             # Standalone sync script
```

## Core Services

### 1. Instagram Service (`src/lib/instagram-service.ts`)

**Responsibilities:**
- Fetch media from Instagram Graph API
- Handle API authentication and token refresh
- Manage rate limiting and error handling
- Store posts in database

**Key Methods:**
```typescript
class InstagramService {
  static async fetchMedia(accessToken: string, userId: string): Promise<InstagramMedia[]>
  static async fetchMediaDetails(mediaId: string, accessToken: string): Promise<InstagramMediaDetails>
  static async syncFeed(): Promise<SyncResult>
  static async storePost(postData: InstagramPostData): Promise<InstagramPost>
  static async getStoredPostIds(): Promise<string[]>
  static async refreshAccessToken(): Promise<string>
}
```

### 2. Image Downloader (`src/lib/image-downloader.ts`)

**Responsibilities:**
- Download images from Instagram URLs
- Convert to Buffer format
- Handle errors and retries

**Key Methods:**
```typescript
class ImageDownloader {
  static async downloadImage(url: string): Promise<Buffer>
  static async downloadImageWithRetry(url: string, maxRetries?: number): Promise<Buffer>
}
```

### 3. Instagram to Project Converter (`src/lib/instagram-project-converter.ts`)

**Responsibilities:**
- Convert Instagram posts to Project structure
- Extract metadata from captions
- Create TipTap JSON from captions
- Handle image processing and storage

**Key Methods:**
```typescript
class InstagramProjectConverter {
  static async convertPostToProject(post: InstagramPost): Promise<Project>
  static extractTitleFromCaption(caption: string): string
  static extractMaterialsFromCaption(caption: string): string[]
  static convertCaptionToTipTap(caption: string): any
  static async processInstagramImage(imageUrl: string, alt: string): Promise<ProjectImage>
}
```

## API Routes

### 1. Manual Sync Endpoint
**Route:** `POST /api/instagram/sync`
**Auth:** Admin/Editor required
**Functionality:**
- Trigger manual Instagram feed sync
- Returns sync results (new posts, errors, etc.)

### 2. List Posts Endpoint
**Route:** `GET /api/instagram/posts`
**Auth:** Public (with optional admin filters)
**Query Params:**
- `converted`: Filter by conversion status
- `limit`: Pagination limit
- `offset`: Pagination offset

### 3. Get/Delete Post Endpoint
**Route:** `GET|DELETE /api/instagram/posts/[id]`
**Auth:** Admin for DELETE, public for GET
**Functionality:**
- Get specific post details
- Delete post (and associated project if converted)

### 4. Convert Post Endpoint
**Route:** `POST /api/instagram/posts/[id]/convert`
**Auth:** Admin/Editor required
**Functionality:**
- Convert Instagram post to Project
- Mark as unpublished by default
- Link post to created project

### 5. Scheduled Sync Endpoint
**Route:** `GET /api/cron/instagram-sync`
**Auth:** Secret token (query param)
**Functionality:**
- Automated sync triggered by cron
- Protected with secret token
- Logs sync results

## Data Flow

### Sync Process
```
1. Fetch media from Instagram Graph API
   ↓
2. Check which posts are new (compare with database)
   ↓
3. For each new post:
   a. Download image from Instagram URL
   b. Process image (resize, optimize, create thumbnail)
   c. Store image locally
   d. Save post metadata to database
   ↓
4. If AUTO_CREATE_PROJECTS is enabled:
   a. Convert each new post to Project
   b. Mark as unpublished
   ↓
5. Return sync results
```

### Conversion Process
```
1. Get Instagram post from database
   ↓
2. Extract title from caption (first line or first 50 chars)
   ↓
3. Extract materials from hashtags
   ↓
4. Convert caption to TipTap JSON
   ↓
5. Get content type ID for "projects"
   ↓
6. Get system user ID
   ↓
7. Create Project with:
   - unpublished: true
   - translations (default language)
   - images (from Instagram post)
   ↓
8. Link Instagram post to created project
```

## Scheduled Sync Options

### Option A: Vercel Cron (Recommended if deployed on Vercel)
Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/instagram-sync?secret=YOUR_SECRET",
    "schedule": "0 */6 * * *"
  }]
}
```

### Option B: External Cron Service
- Use services like cron-job.org, EasyCron, or GitHub Actions
- Call: `GET https://your-domain.com/api/cron/instagram-sync?secret=YOUR_SECRET`
- Recommended schedule: Every 6 hours

### Option C: Manual Trigger
- Admin panel button to trigger sync
- No automatic scheduling

## Error Handling

### API Errors
- **Rate Limiting**: Implement exponential backoff
- **Invalid Token**: Log error, require token refresh
- **Network Errors**: Retry with exponential backoff (max 3 retries)
- **Invalid Response**: Log error, skip post, continue with others

### Image Download Errors
- **Network Failures**: Retry up to 3 times
- **Invalid Images**: Skip and log error
- **Storage Failures**: Log error, continue with other posts

### Conversion Errors
- **Missing Data**: Log error, skip conversion
- **Database Errors**: Rollback transaction, log error
- **Image Processing Errors**: Skip image, continue with text content

## Security Considerations

1. **Token Storage**: Store all tokens in environment variables
2. **Cron Protection**: Use secret token for cron endpoint
3. **Input Validation**: Validate all API responses
4. **Content Sanitization**: Sanitize captions before storing
5. **Rate Limiting**: Respect Instagram API rate limits
6. **Error Logging**: Log errors without exposing sensitive data

## Testing Strategy

### Unit Tests
- Instagram service methods
- Image downloader
- Project converter logic
- Caption parsing

### Integration Tests
- API endpoints
- Database operations
- Image processing pipeline

### Manual Testing
- Real Instagram account sync
- Image download and processing
- Project conversion
- Error scenarios

## Implementation Checklist

- [ ] Update Prisma schema
- [ ] Create Instagram service
- [ ] Create image downloader
- [ ] Create project converter
- [ ] Create API routes
- [ ] Create cron endpoint
- [ ] Create standalone sync script
- [ ] Update Next.js config for image domains
- [ ] Add environment variable documentation
- [ ] Test with real Instagram account
- [ ] Set up scheduled sync
- [ ] Create admin UI (optional)

## Setup Instructions

### 1. Instagram Developer Setup
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app (Business type)
3. Add "Instagram Graph API" product
4. Configure OAuth redirect URIs
5. Generate access token for Creator account
6. Get Instagram User ID

### 2. Environment Configuration
1. Copy `.env.local.example` to `.env.local`
2. Add Instagram configuration variables
3. Set sync preferences
4. Generate cron secret token

### 3. Database Migration
1. Update Prisma schema
2. Run migration: `npx prisma migrate dev --name add_instagram_project_relation`
3. Generate Prisma client: `npx prisma generate`

### 4. Initial Sync
1. Test manual sync: `POST /api/instagram/sync`
2. Verify posts are stored in database
3. Test conversion: `POST /api/instagram/posts/[id]/convert`
4. Verify project is created

### 5. Schedule Sync
1. Choose sync method (Vercel Cron, external service, or manual)
2. Configure schedule (recommended: every 6 hours)
3. Test scheduled sync
4. Monitor logs for errors

## Future Enhancements

- Admin UI for managing Instagram posts
- Bulk conversion of posts to projects
- Automatic publishing rules (e.g., publish posts older than X days)
- Instagram insights integration
- Support for Instagram Stories
- Support for Instagram Reels
- Image optimization improvements
- Duplicate detection improvements

