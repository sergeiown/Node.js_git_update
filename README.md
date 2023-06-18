# Node.js Updater

The Node.js Updater is a command-line tool that checks the installed version of Node.js and compares it with the latest available version. If the installed version is not up to date, the program offers an option to update Node.js. 😈

***Note: This tool does not use NVM (Node Version Manager). 👻***

## Dependencies

This program utilizes the following dependencies:

- axios: a library for making HTTP requests.
- clear: a library for clearing the console output.
- latest-version: a library for getting the latest available version of Node.js.

All dependencies are automatically installed when running the `npm install` command.

## Usage

Run the following command to start the program:

```node index.js [language]```

- `language` (optional): an argument specifying the language of the program. Available options: `en` (English), `uk` (Ukrainian). The default language is English.

The program checks the installed version of Node.js and compares it with the latest available version. If the installed version is not up to date, the program prompts the user to update Node.js. After updating or if the installed version is already up to date, the program informs the user about the Node.js version status.

## Examples

```node index.js```

Start the program with the default language (English).

```node index.js uk```

Start the program with the Ukrainian language.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.
