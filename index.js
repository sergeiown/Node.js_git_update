const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const clear = require('clear');
const https = require('https');
const { execSync } = require('child_process');
const messages = require('./modules/messages');
const detectLanguage = require('./modules/languageDetector.js');
const downloadFile = require('./modules/fileDownloader.js');
const installerExecutor = require('./modules/installerExecutor.js');
const updateNode = require('./modules/nodeUpdater');

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
