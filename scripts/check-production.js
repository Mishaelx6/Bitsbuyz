#!/usr/bin/env node

/**
 * Production Environment Check Script
 * Validates that all required environment variables are set
 */

const requiredVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'NODE_ENV'
];

const optionalVars = [
  'PAYSTACK_SECRET_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'GOOGLE_APPLICATION_CREDENTIALS',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_S3_BUCKET',
  'PUBLIC_OBJECT_SEARCH_PATHS',
  'PRIVATE_OBJECT_DIR'
];

console.log('🔍 Checking production environment variables...\n');

let hasErrors = false;
const missing = [];
const present = [];

// Check required variables
for (const varName of requiredVars) {
  if (process.env[varName]) {
    present.push(`✅ ${varName}`);
  } else {
    missing.push(`❌ ${varName} (REQUIRED)`);
    hasErrors = true;
  }
}

// Check optional variables
for (const varName of optionalVars) {
  if (process.env[varName]) {
    present.push(`✅ ${varName}`);
  } else {
    present.push(`⚠️  ${varName} (optional)`);
  }
}

console.log('📋 Environment Variables Status:\n');
console.log('Required Variables:');
missing.forEach(item => console.log(`  ${item}`));
present.filter(item => item.includes('✅')).forEach(item => console.log(`  ${item}`));

console.log('\nOptional Variables:');
present.filter(item => item.includes('⚠️')).forEach(item => console.log(`  ${item}`));

if (hasErrors) {
  console.log('\n❌ Deployment blocked: Missing required environment variables');
  console.log('Please set the missing variables and try again.');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!');
  console.log('🚀 Ready for production deployment.');
}

// Additional checks
console.log('\n🔧 Additional Checks:');

// Check NODE_ENV
if (process.env.NODE_ENV === 'production') {
  console.log('✅ NODE_ENV is set to production');
} else {
  console.log('⚠️  NODE_ENV is not set to production');
}

// Check DATABASE_URL format
if (process.env.DATABASE_URL) {
  if (process.env.DATABASE_URL.startsWith('postgresql://')) {
    console.log('✅ DATABASE_URL format looks correct');
  } else {
    console.log('⚠️  DATABASE_URL format may be incorrect (should start with postgresql://)');
  }
}

console.log('\n🎯 Next steps:');
console.log('1. Ensure your database is running and accessible');
console.log('2. Test database connection');
console.log('3. Run: npm run build:prod');
console.log('4. Deploy to Vercel: vercel --prod');








