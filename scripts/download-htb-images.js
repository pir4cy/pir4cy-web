import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GitHub authentication token (if needed)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Function to download a file
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    // Create directory if it doesn't exist
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const options = {
      headers: GITHUB_TOKEN ? {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'HTB-Image-Downloader'
      } : {
        'User-Agent': 'HTB-Image-Downloader'
      }
    };

    const file = fs.createWriteStream(dest);
    https.get(url, options, (response) => {
      if (response.statusCode === 404) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Image not found (404). If this is a private repository, please set GITHUB_TOKEN environment variable.`));
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Function to extract image URLs and alt text from markdown files
function extractImageUrls(markdownContent) {
  const imageRegex = /!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g;
  const matches = [...markdownContent.matchAll(imageRegex)];
  return matches.map(match => ({
    url: match[2],
    alt: match[1],
    title: match[3] || ''
  }));
}

// Function to convert relative path to GitHub URL
function convertToGitHubUrl(relativePath, machineName) {
  // Remove 'boxImages/' prefix if present
  const cleanPath = relativePath.replace(/^boxImages\//, '');
  return `https://raw.githubusercontent.com/pir4cy/HTB-Writeups/main/Machines/boxImages/${cleanPath}`;
}

// Main function
async function main() {
  try {
    console.log('Starting to download HTB images...');
    
    // Get all HTB markdown files
    const htbDir = path.join(__dirname, '../src/content/htb');
    const files = fs.readdirSync(htbDir).filter(file => file.endsWith('.md'));
    
    for (const file of files) {
      const machineName = path.basename(file, '.md');
      console.log(`\nProcessing ${machineName}...`);
      
      // Read the markdown file
      const markdownPath = path.join(htbDir, file);
      const markdownContent = fs.readFileSync(markdownPath, 'utf8');
      
      // Extract image URLs and metadata
      const images = extractImageUrls(markdownContent);
      
      // Process each image
      for (const image of images) {
        let imageUrl = image.url;
        
        // If it's a relative path, convert it to GitHub URL
        if (!imageUrl.startsWith('http')) {
          imageUrl = convertToGitHubUrl(imageUrl, machineName);
        }
        
        // Extract the image filename from the URL
        const imageName = path.basename(imageUrl).split('"')[0]; // Remove any quotes in filename
        
        // Construct the local path
        const localPath = path.join(__dirname, '../public/images/htb/machines', machineName, imageName);
        
        // Download the image
        console.log(`  Downloading ${imageName}...`);
        try {
          await downloadFile(imageUrl, localPath);
          console.log(`  ✓ Downloaded ${imageName}`);
        } catch (err) {
          console.error(`  ✗ Failed to download ${imageName}: ${err.message}`);
        }
      }
    }
    
    console.log('\nAll images processed!');
    
    if (!GITHUB_TOKEN) {
      console.log('\nNote: If you\'re seeing 404 errors, you may need to set the GITHUB_TOKEN environment variable.');
      console.log('You can create a token at https://github.com/settings/tokens');
      console.log('Then run the script with: GITHUB_TOKEN=your_token node scripts/download-htb-images.js');
    }
  } catch (error) {
    console.error('Error downloading images:', error);
    process.exit(1);
  }
}

// Run the script
main(); 