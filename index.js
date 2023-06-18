const readline = require('readline');
const clear = require('clear');

const messages = {
    en: {
        installedVersion: 'Installed Node.js version:',
        latestVersion: 'Latest available Node.js version:',
        updatePrompt: 'Do you want to update Node.js? (y/n): ',
        updating: 'Updating Node.js...',
        updateError: 'Error updating Node.js:',
        updateSuccess: 'Node.js updated successfully.',
        upToDate: 'Node.js version is up to date. No update needed.',
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
        upToDate: 'Версія Node.js актуальна. Оновлення не потрібне.',
        languageNotSupported:
            'Мова не підтримується. Будь ласка, запустіть програму з змінною середовища LANGUAGE=uk для української мови.',
    },
};

const getInstalledNodeVersion = () => {
    return process.version;
};

const getLatestNodeVersion = async () => {
    try {
        const latestVersionModule = await import('latest-version');
        const latestVersionNumber = await latestVersionModule.default('node');
        return latestVersionNumber;
    } catch (error) {
        console.error('Сталася помилка при отриманні останньої версії Node.js:', error);
    }
};

const compareVersions = async () => {
    const installedVersion = getInstalledNodeVersion();
    console.log(messages[language].installedVersion, installedVersion);

    const latestVersion = await getLatestNodeVersion();
    console.log(messages[language].latestVersion, latestVersion);

    if (latestVersion && installedVersion !== latestVersion) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(messages[language].updatePrompt, async (answer) => {
            if (answer.toLowerCase() === 'y') {
                try {
                    const { exec } = require('child_process');
                    console.log(messages[language].updating);
                    exec('npm install -g node', (error, stdout, stderr) => {
                        if (error) {
                            console.error(messages[language].updateError, error);
                        } else {
                            console.log(messages[language].updateSuccess);
                        }
                    });
                } catch (error) {
                    console.error(messages[language].updateError, error);
                }
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
