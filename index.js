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
        message: 'Select your config file',
        choices: choices,
    },
]).then(answers => {
    const selectedConfig = answers.config;
    const configFile = path.join(configDir, selectedConfig);
    config = JSON.parse(fs.readFileSync(configFile, 'utf8'));

    console.log("\x1b[32mReady! \x1b[34mThe RPC Client Started Successfully.\x1b[0m");
    client.login({
        clientId: config.appid
    }).catch(console.error);
});

// When everything is ready
client.on('ready', async () => {
    setActivity(config.rpc.discord);
    console.log("\x1b[32mReady! \x1b[34mThe RPC Client Started Successfully.\x1b[0m");
});

// Update activity status
function updateActivity() {
    /*
    if (isCurrentlyAsleep()) {
        setActivity(config.rpc.sleep);
    } else {
        setActivity(config.rpc.discord);
    }

     */

    setActivity(config.rpc.discord);

    const interval = config.interval || 5000; // Default interval of 5 seconds

    setTimeout(updateActivity, interval);
}

// Set activity => Set current activity for the user
function setActivity(activityConfig) {
    const activity = {
        details: activityConfig.details || undefined,
        state: activityConfig.state || undefined,
        partySize: activityConfig.partySize || undefined,
        partyMax: activityConfig.partyMax || undefined,
        startTimestamp: activityConfig.startTimestamp || undefined,
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

// Sleep Time => Return the current day [Number]
function getSleepTimes() {
    let day = 0;
    const currentHour = new Date().getHours();

    if (currentHour > 12) {
        day = (new Date().getDay() + 1) % 7;
    } else {
        day = new Date().getDay();
    }

    day--;

    return config.sleepTime ? config.sleepTime[day] : null;
}

// Sleep Time Update => Return true or false [Boolean]
function isCurrentlyAsleep() {
    const sleepTimes = getSleepTimes();

    if (!sleepTimes) {
        return false;
    }

    const currentHour = new Date().getHours();
    return currentHour < sleepTimes[1] || currentHour >= sleepTimes[0];
}

// When Awake => Return when the user is waking up [Date]
function awakeWhen() {
    const time = new Date();
    const awakeTime = new Date();

    if (time.getHours() > 12) {
        awakeTime.setDate(awakeTime.getDate() + 1);
    }

    awakeTime.setHours(getSleepTimes()[1], 0, 0, 0);
    return awakeTime;
}
