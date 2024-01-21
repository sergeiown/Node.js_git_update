const messages = require('./messages');
const downloadFile = require('./fileDownloader');
const installerExecutor = require('./installerExecutor');

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

module.exports = updateNode;
