const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const clear = require('clear');
const https = require('https');
const { execSync } = require('child_process');
const messages = require('./modules/messages');
const detectLanguage = require('./modules/languageDetector.js');

const unlinkFileAsync = promisify(fs.unlink);

const getInstalledNodeVersion = () => {
    return process.version;
};

const getLatestNodeVersion = async () => {
    try {
        const latestVersionModule = await import('latest-version');
        const latestVersionNumber = await latestVersionModule.default('node');
        return latestVersionNumber;
    } catch (error) {
        console.error('Error getting latest Node.js version:', error);
    }
};

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

const executeInstaller = async (filePath) => {
    return new Promise((resolve, reject) => {
        const installer = exec(`start /wait ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                reject(new Error(`Error executing installer: ${error}`));
            } else {
                resolve();
            }
        });

        installer.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Installer exited with code ${code}`));
            }
        });
    });
};

const updateNode = async (language) => {
    try {
        const latestVersion = await getLatestNodeVersion();
        if (latestVersion) {
            console.log(messages[language].updating);

            const installerFilePath = 'node-installer.msi';
            const installerUrl = `https://nodejs.org/dist/v${latestVersion}/node-v${latestVersion}-x64.msi`;

            await downloadFile(installerUrl, installerFilePath);
            await executeInstaller(installerFilePath);

            console.log(messages[language].updateSuccess);

            await unlinkFileAsync(installerFilePath);
        }
    } catch (error) {
        console.error(messages[language].updateError, error);
    }
};

const compareVersions = async (language) => {
    const installedVersion = getInstalledNodeVersion();
    console.log(messages[language].installedVersion, installedVersion);

    const latestVersion = await getLatestNodeVersion();
    console.log(messages[language].latestVersion, latestVersion);

    if (latestVersion && installedVersion !== latestVersion) {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(messages[language].updatePrompt, async (answer) => {
            if (answer.toLowerCase() === 'y') {
                await updateNode(language);
            } else {
                console.log(messages[language].upToDate);
            }

            rl.close();
        });
    } else {
        console.log(messages[language].upToDate);
    }
};

(async () => {
    const language = detectLanguage();
    clear();
    compareVersions(language);
})();
