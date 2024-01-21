const fs = require('fs');
const https = require('https');

const downloadFile = async (url, filePath) => {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });

            fileStream.on('error', (error) => {
                reject(new Error('Error downloading file:', error));
            });
        });
    });
};

module.exports = downloadFile;
