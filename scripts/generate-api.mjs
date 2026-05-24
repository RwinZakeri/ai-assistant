import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = join(__dirname, '..');

function generateApi() {
  try {
    const apiUrl = 'https://assist.isnode.ir';
    const swaggerUrl = `${apiUrl}/swagger/v1/swagger.json`;
    console.log('swaggerUrl:::::::::::::::::::::', swaggerUrl);
    console.log(`Generating API from: ${swaggerUrl}`);

    execSync(`npx openapi --input ${swaggerUrl} --output ./api`, {
      cwd: rootDir,
      stdio: 'inherit',
    });

    console.log('API generation completed successfully!');

    execSync('pnpm run sync:copy-api-files', {
      cwd: rootDir,
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Error generating API:', error);
    process.exit(1);
  }
}

generateApi();
