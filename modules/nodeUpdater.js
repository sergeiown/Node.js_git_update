const fs = require('fs');
const { promisify } = require('util');
const messages = require('./messages');
const downloadFile = require('./fileDownloader');
const installerExecutor = require('./installerExecutor');

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

const updateNode = async (language) => {
    try {
        const latestVersion = await getLatestNodeVersion();
        if (latestVersion) {
            console.log(messages[language].updating);

            const installerFilePath = 'node-installer.msi';
            const installerUrl = `https://nodejs.org/dist/v${latestVersion}/node-v${latestVersion}-x64.msi`;

            await downloadFile(installerUrl, installerFilePath);
            await installerExecutor(installerFilePath);

            console.log(messages[language].updateSuccess);

            await unlinkFileAsync(installerFilePath);
        }
    } catch (error) {
        console.error(messages[language].updateError, error);
    }
};

module.exports = { getInstalledNodeVersion, getLatestNodeVersion, compareVersions, updateNode };
