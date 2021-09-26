import rpc from 'discord-rpc';
const client = new rpc.Client({ transport: 'ipc' });
import fs from 'fs';
// config.json file
if (!fs.existsSync('./config.json')) throw new Error('\x1b[31mI could not find config.json, are you sure you have it?\x1b[0m');
const config = Object.assign(JSON.parse(fs.readFileSync('./config.json', 'utf8')));

let currentArray;

// Update activity status
function update() {

    // IF => User is sleeping
    if (currentlyAsleep()) {
        // Set sleeping status
        return setActivity({
            details: config.rpc.sleep.details || undefined,
            state: config.rpc.sleep.state || undefined,
            partySize: config.rpc.sleep.partySize || undefined,
            partyMax: config.rpc.sleep.partyMax || undefined,
            largeImageKey: config.rpc.sleep.largeImageKey || undefined,
            largeImageText: config.rpc.sleep.largeImageText || undefined,
            endTimestamp: config.rpc.sleep.endTimestamp ? awakeWhen() : undefined,
            joinSecret: config.rpc.sleep.joinButton ? true : false,
            spectateSecret: config.rpc.sleep.spectateButton ? true : false
        });
    }

    // Default => User is not sleeping
    setActivity({
        details: config.rpc.discord.details || undefined,
        state: config.rpc.discord.state || undefined,
        partySize: config.rpc.discord.partySize || undefined,
        partyMax: config.rpc.discord.partyMax || undefined,
        startTimestamp: config.rpc.discord.startTimestamp || undefined,
        largeImageKey: config.rpc.discord.largeImageKey || undefined,
        largeImageText: config.rpc.discord.largeImageText || undefined,
        smallImageKey: config.rpc.discord.smallImageKey || undefined,
        smallImageText: config.rpc.discord.smallImageText || undefined,
        joinSecret: config.rpc.discord.joinButton || undefined,
        spectateSecret: config.rpc.discord.spectateButton || undefined
    })
}

// When everything ready
client.on('ready', async () => {
    console.log("\x1b[32mReady! \x1b[34mThe RPC Client Started Successfully.\x1b[0m")

    setInterval(() => {
		try {
		    update();
		} catch (err) {
		    console.log(`\x1b[31m${err}\x1b[0m`);
        }
    }, config.interval);

});

// Client login
client.login({
    clientId: config.appid
}).catch(console.error);

// Set Activity => Set current activity for the user
function setActivity(array) {
    // array == currentArray => prevents API spamming
    if (JSON.stringify(array, null, 4) == JSON.stringify(currentArray, null, 4)) return;
    currentArray = array;

    let time = new Date();

    array = {
        details: array.details,
        state: array.state,
        partySize: array.partySize,
        partyMax: array.partyMax,
        startTimestamp: array.startTimestamp ? time : undefined,
        endTimestamp: array.endTimestamp,
        largeImageKey: array.largeImageKey,
        largeImageText: array.largeImageText,
        smallImageKey: array.smallImageKey,
        smallImageText: array.smallImageText,
        partyId: config.appid,
        joinSecret: array.joinSecret ? config.appid + "JOIN" : undefined,
		spectateSecret: array.spectateSecret ? config.appid + "SPEC" : undefined,
        instance: false
    }

    client.setActivity(array)
}

// Sleep Time => Return the current day [Number]
function getSleepTimes() {
    // (currentHour > 12 ? ((currentDay + 1) === 8 ? 1 : currentDay + 1) : currentDay) - 1
    //let day = (new Date().getHours() > 12 ? ((new Date().getDay() + 1) === 8 ? 1 : new Date().getDay() + 1) : new Date().getDay()) - 1;

    let day = 0;

    if (new Date().getHours() > 12) {
        if ((new Date().getDay() + 1) === 8) {
            day = 1; // Back to Monday
        } else {
            day = (new Date().getDay() + 1); // Go to next day
        }
    } else {
        day = new Date().getDay(); // Get current day
    }

    day--;

    if (config.sleepTime) return config.sleepTime[day];
}

// Sleep Time Update => Return true or false [Boolean]
function currentlyAsleep() {
    let sleepTimes = getSleepTimes();

    // User didn't set their sleep schedules
    if (!sleepTimes) return false;

    if (new Date().getHours() < sleepTimes[1] || new Date().getHours() >= sleepTimes[0]) {
        return true; // Enable sleep mode
    } else {
        return false; // Disable sleep mode
    }
}

// When Awake => Return when user is waking up [Date]
function awakeWhen() {
    let time = new Date();
    let awakeTime = new Date();

    if (time.getHours() > 12) {
        awakeTime.setDate(awakeTime.getDate() + 1)
    }

    awakeTime.setHours(getSleepTimes()[1], 0, 0, 0);
    return awakeTime;
}
