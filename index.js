const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const clear = require('clear');
const https = require('https');

const messages = {
    en: {
        installedVersion: 'Installed Node.js version:',
        latestVersion: 'Latest available Node.js version:',
        updatePrompt: 'Do you want to update Node.js? (y/n): ',
        updating: 'Updating Node.js...',
        updateError: 'Error updating Node.js:',
        updateSuccess: 'Node.js updated successfully.',
        upToDate: 'The Node.js version is up to date or no update is required',
        languageNotSupported:
            'Language not supported. Please run the program with "uk" as an argument for Ukrainian language.',
    },
    uk: {
        installedVersion: 'Встановлена версія Node.js:',
        latestVersion: 'Остання доступна версія Node.js:',
        updatePrompt: 'Бажаєте оновити Node.js? (y/n): ',
        updating: 'Оновлення Node.js...',
        updateError: 'Помилка під час оновлення Node.js:',
        updateSuccess: 'Node.js оновлено успішно.',
        upToDate: 'Версія Node.js актуальна або оновлення не потрібне.',
        languageNotSupported:
            'Мова не підтримується. Будь ласка, запустіть програму з змінною середовища LANGUAGE=uk для української мови.',
    },
};

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

const updateNode = async () => {
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

const compareVersions = async () => {
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
                await updateNode();
            } else {
                console.log(messages[language].upToDate);
            }

            rl.close();
        });
    } else {
        console.log(messages[language].upToDate);
    }
};

const language = process.argv[2] || 'en';

if (language === 'uk' || language === 'en') {
    clear();
    compareVersions();
} else {
    console.log(messages.en.languageNotSupported);
}
