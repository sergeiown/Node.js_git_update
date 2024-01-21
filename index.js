const clear = require('clear');
const detectLanguage = require('./modules/languageDetector.js');
const { compareVersions } = require('./modules/nodeUpdater');

(async () => {
    clear();
    const language = detectLanguage();
    compareVersions(language);
})();
