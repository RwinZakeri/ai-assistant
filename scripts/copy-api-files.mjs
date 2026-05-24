import { copy, remove } from 'fs-extra';
import { readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const srcDir = join(rootDir, 'src');
const apiDir = join(rootDir, 'api');
const destDir = join(srcDir, 'apis');

async function removeFoldersExceptCore() {
  try {
    const items = await readdir(destDir);
    
    for (const item of items) {
      if (item !== 'core') {
        const itemPath = join(destDir, item);
        await remove(itemPath);
        console.log(`Removed: ${item}`);
      }
    }
  } catch (error) {
    console.log('Destination directory does not exist, will be created during copy');
  }
}

async function copyApiFiles() {
  try {
    console.log('Starting copy process...');
    console.log('Source directory:', apiDir);
    console.log('Destination directory:', destDir);
    
    // Check if source directory exists
    try {
      const sourceStats = await stat(apiDir);
      if (!sourceStats.isDirectory()) {
        throw new Error('Source is not a directory');
      }
    } catch (error) {
      console.error('Source directory does not exist or is not accessible:', apiDir);
      process.exit(1);
    }
    
    // First remove all folders except core
    await removeFoldersExceptCore();
    
    // Then copy API files
    console.log('Copying files...');
    await copy(apiDir, destDir, {
      filter: (src) => {
        // Skip files that are in a core directory
        const shouldSkip = src.includes('/core/') || src.includes('\\core\\');
        if (shouldSkip) {
          console.log('Skipping core file:', src);
        }
        return !shouldSkip;
      },
      overwrite: true,
      errorOnExist: false
    });

    console.log('API files copied successfully!');

    await remove(apiDir);
    console.log('Original API directory removed successfully!');
  } catch (error) {
    console.error('Error during copy:', error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

copyApiFiles();
