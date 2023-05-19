import rpc from 'discord-rpc';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const client = new rpc.Client({ transport: 'ipc' });

// Configuration files
const configDir = './config';
const files = fs.readdirSync(configDir).filter(file => path.extname(file) === '.json');
if (files.length === 0) {
    throw new Error('\x1b[31mI could not find any JSON configuration file. Please make sure you have them.\x1b[0m');
}

let config = JSON.parse(fs.readFileSync(path.join(configDir, 'default.json'), 'utf8'));

client.login({
    clientId: config.appid
}).then(() => {
    askForActivity();
}).catch(console.error);

// When everything is ready
client.on('ready', async () => {
    setActivity(config.rpc.discord);
    console.log("\x1b[32mReady! \x1b[34mThe RPC Client Started Successfully.\x1b[0m");
});

function askForActivity() {
    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Do you want to update the activity?'
        },
      ])
      .then(answers => {
        if (answers.confirm) {
            config = JSON.parse(fs.readFileSync(path.join(configDir, 'default.json'), 'utf8'));
            setActivity(config.rpc.discord);
            console.log("\x1b[32mActivity updated!\x1b[0m");
            console.log(config.rpc.discord);
            
            askForActivity(); // Recursively call the function
        } else {
            process.exit();
        }
      });
  }

// Set activity => Set current activity for the user
function setActivity(activityConfig) {
    const currentTime = new Date();

    const activity = {
        details: activityConfig.details || undefined,
        state: activityConfig.state || undefined,
        partySize: activityConfig.partySize || undefined,
        partyMax: activityConfig.partyMax || undefined,
        startTimestamp: activityConfig.startTimestamp && currentTime.getTime() || undefined,
        endTimestamp: activityConfig.endTimestamp && currentTime.getTime() || undefined,
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
