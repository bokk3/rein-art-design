# Troubleshooting Guide

This document covers all the issues we encountered during development and their solutions.

## 🚨 Database Issues

### Issue 1: Prisma Client Initialization Error
**Error**: `Missing required environment variable: DATABASE_URL`

**Cause**: Prisma config not loading environment variables properly

**Solution**:
```typescript
// prisma.config.ts
import "dotenv/config";  // Add this line
import { defineConfig, env } from "prisma/config";
```

### Issue 2: Table Mapping Mismatch
**Error**: `The table 'public.accounts' does not exist`

**Cause**: Prisma schema using singular table names but Better Auth expecting plural

**Solution**: Update schema mappings
```prisma
model Account {
  // ... fields
  @@map("accounts")  // Use plural
}

model Session {
  // ... fields  
  @@map("sessions")  // Use plural
}
```

### Issue 3: Database Connection from Docker vs Local
**Error**: `Can't reach database server at postgres:5432`

**Cause**: Environment variable pointing to Docker hostname when running locally

**Solution**: Use correct hostname for context
```env
# For local development (app runs outside Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/db_name

# For Docker containers (app runs inside Docker)  
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/db_name
```

## 🔧 Development Server Issues

### Issue 4: Slow Initial Compilation (7-9 seconds)
**Cause**: Multiple Prisma client instances + heavy imports

**Solutions Applied**:
1. **Global Prisma Instance**:
```typescript
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

2. **Suspense Boundaries**:
```tsx
<Suspense fallback={<AuthLoading />}>
  <AuthForm />
</Suspense>
```

3. **Optimized Better Auth Config**:
```typescript
export const auth = betterAuth({
  // ... config
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Faster dev
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
})
```

## 🛣️ Routing & Import Issues

### Issue 5: TypeScript Path Resolution
**Error**: `Cannot find module '@/components/auth-form'`

**Cause**: Path aliases not configured properly or IDE cache

**Solutions**:
1. **Check tsconfig.json**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. **Use relative imports as fallback**:
```typescript
import { AuthForm } from "../components/auth-form"
```

3. **Restart TypeScript server** in your IDE

### Issue 6: Better Auth API Route Handler
**Error**: `405 Method Not Allowed` on auth endpoints

**Cause**: Incorrect API route export format

**Solution**:
```typescript
// src/app/api/auth/[...all]/route.ts
import { auth } from "../../../../lib/auth"

const handler = auth.handler
export { handler as GET, handler as POST }
```

## 🐳 Docker Issues

### Issue 7: Container Name Conflicts
**Error**: Container names already in use after project rename

**Solution**:
```bash
# Stop all containers
docker compose down

# Remove old containers
docker container prune

# Start with new names
docker compose up -d postgres
```

### Issue 8: Network Name Persistence
**Issue**: Docker network keeps old project name

**Solution**: Add explicit network configuration
```yaml
# docker-compose.yml
networks:
  default:
    name: your-project-network
```

### Issue 9: Volume Data Persistence
**Issue**: Database data persists after project changes

**Solution**: 
```bash
# Remove volumes to start fresh
docker compose down -v

# Or remove specific volume
docker volume rm project_postgres_data
```

## 🔐 Authentication Issues

### Issue 10: Admin User Seeding
**Error**: Admin user created but can't sign in

**Cause**: User created without proper password hash via Better Auth

**Solution**: Use Better Auth API for user creation
```typescript
// Instead of direct Prisma user creation
const result = await auth.api.signUpEmail({
  body: {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User'
  }
})
```

### Issue 11: Session Not Persisting
**Issue**: User gets logged out on page refresh

**Cause**: Session configuration or cookie issues

**Solution**: Check Better Auth session config
```typescript
export const auth = betterAuth({
  // ... other config
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update every day
  },
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
})
```

## 🔄 State Management Issues

### Issue 12: Stale Prisma Client
**Error**: Schema changes not reflected in application

**Solution**: Three-step refresh process
```bash
1. npx prisma db push      # Sync database
2. npx prisma generate     # Regenerate client  
3. # Restart dev server    # Clear cache
```

### Issue 13: Environment Variable Caching
**Issue**: Environment changes not picked up

**Solution**: Restart development server
```bash
# Kill dev server (Ctrl+C)
npm run dev  # Restart
```

## 📦 Package Management Issues

### Issue 14: Package Lock Conflicts
**Issue**: package-lock.json has old project name

**Solution**:
```bash
# Regenerate package-lock.json
rm package-lock.json
npm install
```

### Issue 15: Node Modules Cache
**Issue**: Weird import errors after changes

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎨 UI/UX Issues

### Issue 16: Loading States Missing
**Issue**: Users see blank screen during auth checks

**Solution**: Add loading components
```tsx
if (isPending) {
  return <AuthLoading />
}
```

### Issue 17: Form Submission Feedback
**Issue**: No feedback during form submission

**Solution**: Add loading states
```tsx
const [isSubmitting, setIsSubmitting] = useState(false)

// In form
<button disabled={isSubmitting}>
  {isSubmitting ? "Loading..." : "Sign In"}
</button>
```

## 🔍 Debugging Tips

### General Debugging Process:
1. **Check browser console** for client-side errors
2. **Check terminal** for server-side errors  
3. **Verify environment variables** are loaded correctly
4. **Test database connection** with simple query
5. **Check Docker containers** are running: `docker ps`
6. **Verify network connectivity** between containers

### Useful Commands:
```bash
# Check running containers
docker ps

# Check container logs
docker logs container-name

# Check database connection
docker exec -it postgres-container psql -U postgres -d database_name

# Check environment variables in Next.js
console.log(process.env.DATABASE_URL)

# Check Prisma client generation
npx prisma generate --help
```

### Environment Debugging:
```typescript
// Add to any component to debug env vars
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL?.substring(0, 30) + '...',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? 'Set' : 'Missing',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
})
```

## 🚀 Performance Optimization Lessons

### What We Learned:
1. **Prisma Client Instantiation**: Use global instance to prevent multiple connections
2. **Better Auth Configuration**: Disable email verification in development
3. **Loading States**: Always provide user feedback
4. **Suspense Boundaries**: Prevent layout shifts during loading
5. **Environment Management**: Proper file precedence is crucial
6. **Docker Optimization**: Use health checks and proper networking

### Production Considerations:
- Enable connection pooling
- Use proper logging levels
- Implement proper error boundaries
- Add monitoring and analytics
- Use CDN for static assets
- Optimize Docker images for production

This troubleshooting guide should help anyone working with this template avoid the pitfalls we encountered!