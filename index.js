const clear = require('clear');
const detectLanguage = require('./modules/languageDetector.js');
const { compareVersions } = require('./modules/nodeUpdater');

(async () => {
    const language = detectLanguage();
    clear();
    compareVersions(language);
})();
