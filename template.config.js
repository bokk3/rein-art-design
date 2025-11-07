// Template Configuration
// This file defines the variables that will be replaced when creating new projects

module.exports = {
  // Project identifiers
  projectName: "nextjs-auth-template",
  displayName: "Next.js Auth Template",
  
  // Database configuration
  databaseName: "nextjs_auth_template",
  
  // Docker container names
  containerPrefix: "nextjs-auth",
  
  // Default admin user
  adminEmail: "admin@example.com",
  adminPassword: "admin123",
  
  // Replaceable variables for client projects
  variables: {
    "{{PROJECT_NAME}}": "nextjs-auth-template",
    "{{DISPLAY_NAME}}": "Next.js Auth Template", 
    "{{DATABASE_NAME}}": "nextjs_auth_template",
    "{{CONTAINER_PREFIX}}": "nextjs-auth",
    "{{ADMIN_EMAIL}}": "admin@example.com",
    "{{COMPANY_NAME}}": "Your Company",
    "{{DOMAIN}}": "localhost:3000"
  }
}