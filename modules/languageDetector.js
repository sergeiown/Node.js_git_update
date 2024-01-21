const { execSync } = require('child_process');

const detectLanguage = () => {
    try {
        const result = execSync('chcp');
        // Getting the result as a Buffer and converting to a string
        const output = result.toString('utf-8');

        if (output.includes('1251') || output.includes('1252') || output.includes('866')) {
            return 'uk'; // Ukrainian locale
        } else if (output.includes('65001')) {
            return 'en'; // English locale
        } else {
            console.log(output);
            console.log(messages.en.languageNotSupported);
            return 'en'; // English locale
        }
    } catch (error) {
        console.error('Error detecting system language:', error);
        process.exit(1);
    }
};

module.exports = detectLanguage;
