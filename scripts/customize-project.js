#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get project details from command line arguments
const projectName = process.argv[2];
const clientName = process.argv[3];
const adminEmail = process.argv[4] || `admin@${projectName.replace(/-/g, '')}.com`;

if (!projectName || !clientName) {
  console.log('Usage: node scripts/customize-project.js <project-name> <client-name> [admin-email]');
  console.log('Example: node scripts/customize-project.js acme-corp "Acme Corporation" admin@acme.com');
  process.exit(1);
}

console.log(`🎨 Customizing project for: ${clientName}`);

// Define replacements
const replacements = {
  'nextjs-auth-template': projectName,
  'Next.js Auth Template': clientName,
  'nextjs_auth_template': projectName.replace(/-/g, '_'),
  'nextjs-auth': projectName,
  'admin@example.com': adminEmail,
  'nextjs-auth-network': `${projectName}-network`,
  'nextjs-auth-postgres': `${projectName}-postgres`,
  'nextjs-auth-app': `${projectName}-app`
};

function replaceInFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    for (const [search, replace] of Object.entries(replacements)) {
      content = content.replace(new RegExp(search, 'g'), replace);
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
}

// Files to update
const filesToUpdate = [
  'package.json',
  'docker-compose.yml',
  '.env',
  '.env.local.example',
  'src/app/page.tsx',
  'src/app/login/page.tsx',
  'src/components/admin-dashboard.tsx',
  'scripts/clear-and-seed.ts',
  'scripts/reset-admin.ts',
  'scripts/create-admin.ts',
  'prisma/seed.ts'
];

console.log('📝 Updating files...');
filesToUpdate.forEach(replaceInFile);

// Update .env.local if it exists
if (fs.existsSync('.env.local')) {
  replaceInFile('.env.local');
}

// Create custom README
const readmeContent = `# ${clientName}

A secure web application built with Next.js, Better Auth, and Prisma.

## Quick Start

1. **Setup environment:**
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local and add your BETTER_AUTH_SECRET
   \`\`\`

2. **Start development:**
   \`\`\`bash
   docker compose up -d postgres
   npm install
   npx prisma db push
   npm run clear-and-seed
   npm run dev
   \`\`\`

3. **Access the application:**
   - Homepage: http://localhost:3000
   - Admin: http://localhost:3000/admin
   - Login: ${adminEmail} / admin123

## Project Details

- **Client**: ${clientName}
- **Project**: ${projectName}
- **Database**: ${projectName.replace(/-/g, '_')}
- **Admin Email**: ${adminEmail}

## Development

See the main template documentation for detailed setup and troubleshooting.
`;

fs.writeFileSync('README.md', readmeContent);
console.log('✅ Updated: README.md');

console.log(`\n🎉 Project customized successfully!`);
console.log(`📋 Summary:`);
console.log(`   Client: ${clientName}`);
console.log(`   Project: ${projectName}`);
console.log(`   Database: ${projectName.replace(/-/g, '_')}`);
console.log(`   Admin: ${adminEmail}`);
console.log(`\n🔧 Next steps:`);
console.log(`   1. cp .env.local.example .env.local`);
console.log(`   2. Edit .env.local with your BETTER_AUTH_SECRET`);
console.log(`   3. docker compose up -d postgres`);
console.log(`   4. npm install`);
console.log(`   5. npx prisma db push`);
console.log(`   6. npm run clear-and-seed`);
console.log(`   7. npm run dev`);
