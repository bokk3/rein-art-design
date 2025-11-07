#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get project details from command line arguments
const projectName = process.argv[2];
const clientName = process.argv[3];

if (!projectName || !clientName) {
    console.log('Usage: node scripts/create-project.js <project-name> <client-name>');
    console.log('Example: node scripts/create-project.js acme-corp "Acme Corporation"');
    process.exit(1);
}

const templateDir = process.cwd();
const newProjectDir = path.join('..', projectName);

console.log(`🚀 Creating new project: ${projectName} for ${clientName}`);

// Create project directory
if (!fs.existsSync(newProjectDir)) {
    fs.mkdirSync(newProjectDir, { recursive: true });
}

// Copy template files (excluding node_modules, .git, etc.)
const excludeDirs = [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    '.env.local'
];

function copyDir(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            if (!excludeDirs.includes(entry.name)) {
                copyDir(srcPath, destPath);
            }
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyDir(templateDir, newProjectDir);

// Replace template variables in files
const replacements = {
    'nextjs-auth-template': projectName,
    'Next.js Auth Template': clientName,
    'nextjs_auth_template': projectName.replace(/-/g, '_'),
    'nextjs-auth': projectName,
    'admin@example.com': `admin@${projectName.replace(/-/g, '')}.com`,
    'Your Company': clientName
};

function replaceInFile(filePath) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        for (const [search, replace] of Object.entries(replacements)) {
            content = content.replace(new RegExp(search, 'g'), replace);
        }

        fs.writeFileSync(filePath, content);
    }
}

// Files to update with replacements
const filesToUpdate = [
    path.join(newProjectDir, 'package.json'),
    path.join(newProjectDir, 'docker-compose.yml'),
    path.join(newProjectDir, '.env'),
    path.join(newProjectDir, '.env.local.example'),
    path.join(newProjectDir, 'src/app/page.tsx'),
    path.join(newProjectDir, 'src/app/login/page.tsx'),
    path.join(newProjectDir, 'src/components/admin-dashboard.tsx'),
    path.join(newProjectDir, 'README.md')
];

filesToUpdate.forEach(replaceInFile);

// Create project-specific README
const readmeContent = `# ${clientName}

A secure web application built with Next.js, Better Auth, and Prisma.

## Quick Start

1. **Setup environment:**
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local and add your BETTER_AUTH_SECRET
   \`\`\`

2. **Start with Docker:**
   \`\`\`bash
   docker-compose up -d postgres
   npm install
   npx prisma db push
   npm run clear-and-seed
   npm run dev
   \`\`\`

3. **Access the application:**
   - Homepage: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Login: admin@${projectName.replace(/-/g, '')}.com / admin123

## Project Structure

- \`src/app/\` - Next.js App Router pages
- \`src/components/\` - React components
- \`src/lib/\` - Authentication and utilities
- \`prisma/\` - Database schema and migrations
- \`scripts/\` - Utility scripts

## Deployment

See DOCKER.md for containerized deployment instructions.
`;

fs.writeFileSync(path.join(newProjectDir, 'README.md'), readmeContent);

console.log(`✅ Project created successfully!`);
console.log(`📁 Location: ${newProjectDir}`);
console.log(`🔧 Next steps:`);
console.log(`   cd ${projectName}`);
console.log(`   cp .env.local.example .env.local`);
console.log(`   # Edit .env.local with your secrets`);
console.log(`   docker-compose up -d postgres`);
console.log(`   npm install`);
console.log(`   npx prisma db push`);
console.log(`   npm run clear-and-seed`);
console.log(`   npm run dev`);