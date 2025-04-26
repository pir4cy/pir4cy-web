#!/usr/bin/env node

/**
 * This script helps convert HTB writeups from GitHub to the new format.
 * It fetches the writeups from your GitHub repository and saves them as markdown files
 * in the src/content/htb directory.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const GITHUB_API_URL = 'https://api.github.com/repos/pir4cy/HTB-Writeups/contents';
const OUTPUT_DIR = path.join(__dirname, '../src/content/htb');

// Function to fetch data from GitHub API
function fetchFromGitHub(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'HTB-Writeup-Converter',
        // Add your GitHub token here if you have rate limiting issues
        // 'Authorization': 'token YOUR_GITHUB_TOKEN'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to fetch raw content from GitHub
function fetchRawContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to extract machine name from filename
function extractMachineName(filename) {
  return filename.replace('.md', '');
}

// Function to create frontmatter
function createFrontmatter(machineName, content) {
  // Extract the first paragraph as the excerpt
  const excerptMatch = content.match(/^#.*\n\n(.*?)(?:\n\n|$)/s);
  const excerpt = excerptMatch ? excerptMatch[1].trim() : `HTB writeup for ${machineName}`;
  
  // Extract tags from the content
  const tags = extractTags(content);
  
  return `---
title: 'HTB: ${machineName}'
date: '${new Date().toISOString().split('T')[0]}'
excerpt: '${excerpt}'
readingTime: ${calculateReadingTime(content)}
tags: ['HTB', 'Writeup', ${tags.map(tag => `'${tag}'`).join(', ')}]
author: 'pir4cy'
coverImage: '/images/htb-logo.svg'
---`;
}

// Function to extract tags from the content
function extractTags(content) {
  const tags = ['HTB', 'Writeup'];
  
  // Look for common HTB tags in the content
  const commonTags = [
    'Easy', 'Medium', 'Hard', 'Insane',
    'Windows', 'Linux',
    'Web', 'Pwn', 'Crypto', 'Forensics', 'Misc', 'OSINT'
  ];
  
  for (const tag of commonTags) {
    if (content.includes(tag)) {
      tags.push(tag);
    }
  }
  
  return tags;
}

// Function to calculate reading time
function calculateReadingTime(content) {
  const wordsPerMinute = 225;
  const wordCount = content.split(/\s+/g).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Function to transform image paths in the content
function transformImagePaths(content, filePath) {
  // Get the directory path of the markdown file
  const dirPath = filePath.substring(0, filePath.lastIndexOf('/'));
  
  // Replace relative image paths with GitHub raw content URLs
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, altText, imagePath) => {
    // If the image path is already an absolute URL, keep it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return match;
    }
    
    // If the image path starts with a slash, it's relative to the repository root
    if (imagePath.startsWith('/')) {
      return `![${altText}](https://raw.githubusercontent.com/pir4cy/HTB-Writeups/main${imagePath})`;
    }
    
    // Otherwise, it's relative to the markdown file's directory
    // Make sure we don't have double slashes in the path
    const cleanDirPath = dirPath.startsWith('/') ? dirPath.substring(1) : dirPath;
    const cleanImagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    return `![${altText}](https://raw.githubusercontent.com/pir4cy/HTB-Writeups/main/${cleanDirPath}/${cleanImagePath})`;
  });
}

// Main function
async function main() {
  try {
    // Create output directory if it doesn't exist
    await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
    
    console.log('Fetching HTB writeups from GitHub...');
    
    // Fetch the contents of the repository
    const contents = await fetchFromGitHub(GITHUB_API_URL);
    
    // Filter for the Machines directory
    const machineFiles = contents.filter(item => 
      item.type === 'dir' && item.name === 'Machines'
    );
    
    if (machineFiles.length === 0) {
      console.error('Machines directory not found');
      return;
    }
    
    // Fetch the contents of the Machines directory
    const machinesContents = await fetchFromGitHub(machineFiles[0].url);
    
    // Filter for markdown files
    const markdownFiles = machinesContents.filter(item => 
      item.type === 'file' && item.name.endsWith('.md')
    );
    
    console.log(`Found ${markdownFiles.length} markdown files`);
    
    // Process each markdown file
    for (const file of markdownFiles) {
      try {
        console.log(`Processing ${file.name}...`);
        
        // Fetch the content of the file
        const content = await fetchRawContent(file.download_url);
        
        // Extract the machine name
        const machineName = extractMachineName(file.name);
        
        // Create the frontmatter
        const frontmatter = createFrontmatter(machineName, content);
        
        // Transform image paths in the content
        const transformedContent = transformImagePaths(content, file.path);
        
        // Remove the existing frontmatter if any
        const contentWithoutFrontmatter = transformedContent.replace(/^---\n[\s\S]*?\n---\n/, '');
        
        // Combine the new frontmatter with the content
        const newContent = `${frontmatter}\n\n${contentWithoutFrontmatter}`;
        
        // Write the file to the output directory
        const outputPath = path.join(OUTPUT_DIR, file.name);
        await fs.promises.writeFile(outputPath, newContent);
        
        console.log(`Saved ${file.name} to ${outputPath}`);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
      }
    }
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main(); 