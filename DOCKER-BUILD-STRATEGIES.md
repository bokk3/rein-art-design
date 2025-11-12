# Docker Build Strategies for Multi-Architecture

This document explains different strategies for building Docker images for both ARM64 (Raspberry Pi) and AMD64 (regular servers).

## The Challenge

- **Raspberry Pi** = ARM64 architecture
- **Regular servers** = AMD64 architecture
- Building AMD64 on ARM64 (cross-compilation) is **very slow** (30-60+ minutes)

## Strategy Options

### Option 1: Build ARM64 on Pi, AMD64 on AMD64 Machine ⭐ Recommended

**Best for:** Most users with access to both machines

1. **On Raspberry Pi** (build ARM64):
   ```bash
   export DOCKERHUB_USERNAME=your-username
   ./scripts/push-staging-to-dockerhub.sh
   # Tag as: your-username/rein-art-design:staging-arm64-latest
   ```

2. **On AMD64 machine** (build AMD64):
   ```bash
   export DOCKERHUB_USERNAME=your-username
   ./scripts/build-and-push-amd64-only.sh
   # Tag as: your-username/rein-art-design:staging-amd64-latest
   ```

3. **Create manifest** (combines both):
   ```bash
   docker manifest create your-username/rein-art-design:staging-latest \
     your-username/rein-art-design:staging-arm64-latest \
     your-username/rein-art-design:staging-amd64-latest
   
   docker manifest push your-username/rein-art-design:staging-latest
   ```

**Pros:**
- Fast builds (native architecture)
- No cross-compilation overhead
- Works well with limited resources

**Cons:**
- Requires access to both machines
- Manual manifest creation

---

### Option 2: Multi-Arch Build on Pi (Slow but Works)

**Best for:** When you only have access to Raspberry Pi

```bash
export DOCKERHUB_USERNAME=your-username
./scripts/build-and-push-multiarch.sh
```

**Pros:**
- Works with only one machine
- Single command
- Automatic multi-arch manifest

**Cons:**
- **Very slow** (30-60+ minutes on Pi)
- High CPU/memory usage
- May fail on 4GB Pi if memory is tight

**Time estimate:**
- ARM64 build: ~15-30 minutes
- AMD64 cross-compile: ~30-60 minutes
- **Total: 45-90 minutes**

---

### Option 3: GitHub Actions (Free CI/CD) ⭐ Best for Automation

**Best for:** Automated builds, CI/CD pipelines

Create `.github/workflows/docker-build.yml`:

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ staging ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          target: runner
          platforms: linux/arm64,linux/amd64
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/rein-art-design:staging-latest
          build-args: |
            NODE_ENV=production
            DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy?schema=public
            BETTER_AUTH_SECRET=dummy-secret-for-build-only
            NEXT_PUBLIC_APP_URL=https://rein.truyens.pro
            NEXT_PUBLIC_SITE_URL=https://rein.truyens.pro
```

**Pros:**
- Free for public repos
- Fast (runs on GitHub's AMD64 runners)
- Automatic on git push
- No local resource usage

**Cons:**
- Requires GitHub account
- Need to set up secrets

---

### Option 4: Remote Docker Buildx Builder

**Best for:** Advanced users with multiple machines

1. **Set up remote builder** (on AMD64 machine):
   ```bash
   # On AMD64 machine
   docker buildx create --name remote-builder --driver docker-container
   docker buildx use remote-builder
   ```

2. **Use from Pi**:
   ```bash
   # On Raspberry Pi
   docker buildx create --name remote --driver remote tcp://amd64-machine-ip:2375
   docker buildx use remote
   docker buildx build --platform linux/amd64,linux/arm64 ...
   ```

**Pros:**
- Fast (uses remote machine's resources)
- Can build both architectures

**Cons:**
- Complex setup
- Requires network access between machines
- Security considerations (exposed Docker socket)

---

## Quick Reference

### Build ARM64 only (fast on Pi):
```bash
./scripts/push-staging-to-dockerhub.sh
```

### Build AMD64 only (fast on AMD64):
```bash
./scripts/build-and-push-amd64-only.sh
```

### Build both (slow on Pi):
```bash
./scripts/build-and-push-multiarch.sh
```

### Check image architecture:
```bash
docker manifest inspect your-username/rein-art-design:staging-latest
```

---

## Recommendations

1. **For development/testing:** Build ARM64 on Pi only
2. **For production:** Use GitHub Actions (Option 3)
3. **For quick deployment:** Build separately on each architecture (Option 1)
4. **For single machine:** Use multi-arch build but expect it to be slow (Option 2)

