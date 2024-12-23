import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file
const envPath = resolve(__dirname, '../../.env');
config({ path: envPath });

// Define the output file path
const outputPath = resolve(__dirname, './utils/environment.ts');

// Collect environment variables
const envVariables = process.env;

// Generate TypeScript content
const tsContent = `
  // This file is auto-generated. Do not edit manually.
  export const environment = {
    ${Object.entries(envVariables)
    .map(([key, value]) => `"${key}": ${JSON.stringify(value)},`)
    .join('\n    ')}
  } as const;
`;

// Write to the output file
writeFileSync(outputPath, tsContent);
console.log(`Environment variables written to ${outputPath}`);