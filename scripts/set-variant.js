// Writes the chosen build variant into .env.local so Metro inlines it.
// .env.local takes precedence over .env, and is git-ignored.
const fs = require('fs');
const path = require('path');

const variant = process.argv[2] === 'customer' ? 'customer' : 'client';
const file = path.join(__dirname, '..', '.env.local');

fs.writeFileSync(
  file,
  `# Written by scripts/set-variant.js — do not edit by hand.\nEXPO_PUBLIC_APP_VARIANT=${variant}\n`
);
console.log(`variant: ${variant}`);
