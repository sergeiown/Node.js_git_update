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
    console.log('Встановлена версія Node.js:', installedVersion);

    const latestVersion = await getLatestNodeVersion();
    console.log('Остання доступна версія Node.js:', latestVersion);

    if (latestVersion && installedVersion !== latestVersion) {
        console.log('Увага: Є нова версія Node.js, рекомендується оновити.');
    } else {
        console.log('Версія Node.js актуальна. Оновлення не потрібне.');
    }
};

compareVersions();
