const { exec } = require('child_process');

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

module.exports = executeInstaller;
