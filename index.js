import rpc from 'discord-rpc';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const client = new rpc.Client({ transport: 'ipc' });

// Configuration files
let config = null;
const configDir = './config';
const files = fs.readdirSync(configDir).filter(file => path.extname(file) === '.json');
if (files.length === 0) {
    throw new Error('\x1b[31mI could not find any JSON configuration files. Please make sure you have them.\x1b[0m');
}

// Prompt for config file
const choices = files.map(file => ({ name: file }));
inquirer.prompt([
    {
        type: 'list',
        name: 'config',
        message: 'Select your configuration file',
        choices: choices,
    },
]).then(answers => {
    const selectedConfig = answers.config;
    const configFile = path.join(configDir, selectedConfig);
    config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

    client.login({
        clientId: config.appid
    }).catch(console.error);
});

// When everything is ready
client.on('ready', async () => {
    setActivity(config.rpc.discord);
    console.log("\x1b[32mReady! \x1b[34mThe RPC Client Started Successfully.\x1b[0m");
});

// Set activity => Set current activity for the user
function setActivity(activityConfig) {
    const activity = {
        details: activityConfig.details || undefined,
        state: activityConfig.state || undefined,
        partySize: activityConfig.partySize || undefined,
        partyMax: activityConfig.partyMax || undefined,
        startTimestamp: activityConfig.startTimestamp && new Date().getTime() || undefined,
        endTimestamp: activityConfig.endTimestamp || undefined,
        largeImageKey: activityConfig.largeImageKey || undefined,
        largeImageText: activityConfig.largeImageText || undefined,
        smallImageKey: activityConfig.smallImageKey || undefined,
        smallImageText: activityConfig.smallImageText || undefined,
        instance: false,
        buttons: []
    };

    if (activityConfig.joinButton.enabled) {
        activity.buttons.push({
            label: activityConfig.joinButton.label,
            url: activityConfig.joinButton.url
        });
    }

    if (activityConfig.spectateButton.enabled) {
        activity.buttons.push({
            label: activityConfig.spectateButton.label,
            url: activityConfig.spectateButton.url
        });
    }

    client.setActivity(activity);
}
