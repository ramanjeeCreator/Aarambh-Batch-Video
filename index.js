const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');

// Get the current script file name
const currentFileName = path.basename('Videos/');

// Get all files in the current directory, excluding current script and index.html
const files = fs.readdirSync(currentFileName);

// Create HTML content with dropdown menus for each folder
let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aarambh Batch Videos</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Aarambh Batch Videos</h1>
    <div class="folders">
`;

// Helper function to get folder name from the file
function getFileName(file) {
    const separator = " -";
    // Only process files that contain the separator ' -'
    if (file.includes(separator)) {
        return file.slice(0, file.indexOf(separator));
    }
    return null; // Return null for files that don't match the pattern
}

// Initialize folders array
let folders = [];

// Iterate over files and group them into folders
files.forEach(file => {
    const folder = getFileName(file); // Extract folder name

    // If folder is null, skip this file (i.e., it doesn't have ' -')
    if (folder !== null) {
        // Check if the folder already exists
        const folderExists = folders.some(x => x.folderName === folder);

        if (!folderExists) {
            // If folder doesn't exist, create a new folder object with an empty files array
            folders.push({
                folderName: folder,
                files: [] // Initialize files array here
            });
        }

        // Find the folder object to append the file
        let filesObj = folders.find(item => item.folderName === folder);
        if (filesObj) {
            filesObj.files.push(file); // Push the file into the existing files array
        }
    }
});

// console.log(folders);

// Add dropdowns for each folder and its files
folders.forEach(folder => {
    htmlContent += `
        <div class="folder">
            <div class="folderName toggle-btn" onclick="toggleFiles('${folder.folderName}')">${folder.folderName}</div>
            <div id="${folder.folderName}" class="files">
    `;

    // Add links for each file inside the folder
    folder.files.forEach(file => {
        htmlContent += `
            <span link="./Videos/${file}" onclick="playVideo(this)">${file}</span>
        `;
    });

    htmlContent += `
            </div>
        </div>
    `;
});

// Close HTML and add a script to handle the dropdown toggling
htmlContent += `
    </div>
    <div class="item">
        <span>Click on a video to play</span>
        <span id="music">100</span>
        <span id="speed">1x</span>
        <div class="resizer nw"></div>
        <div class="resizer ne"></div>
        <div class="resizer sw"></div>
        <div class="resizer se"></div>
        <video id="myVideo" controls>
            Your Browser doesn't support the video tag
        </video>
    </div>


    <script src="main.js"></script>
</body>
</html>
`;

// Write the HTML content to a new file
const htmlFilePath = path.join(__dirname, 'index.html');
fs.writeFileSync(htmlFilePath, htmlContent);

console.log('index.html has been created with linked files.');

// Open Offline
function openInChrome() {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const filePath = 'D:\\Study\\STUDY- Videos\\Next Toppers SST\\Aarambh Batch Video\\index.html'
    exec(`"${chromePath}" "${filePath}"`, (err) => {
        if (err) {
            console.error('Error launching Chrome:', err);
        }
    });
}

openInChrome()