import rpc from "discord-rpc";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

const client = new rpc.Client({ transport: "ipc" });

// Configuration files
const configDir = "./config";
const files = fs
  .readdirSync(configDir)
  .filter((file) => path.extname(file) === ".json");
if (files.length === 0) {
  throw new Error(
    "\x1b[31mI could not find any JSON configuration file. Please make sure you have them.\x1b[0m"
  );
}

let config = JSON.parse(
  fs.readFileSync(path.join(configDir, "default.json"), "utf8")
);

client
  .login({
    clientId: config.appid,
  })
  .then(() => {
    askForActivity();
  })
  .catch(console.error);

// When everything is ready
client.on("ready", async () => {
  setActivity(config.rpc.discord);
  console.log(
    "\x1b[32mReady! \x1b[34mThe RPC Client Started Successfully.\x1b[0m"
  );
});

function askForActivity() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "confirm",
        message:
          "Do you want to update the activity? If not, the program will exit. (ignore this message if you don't have made any changes)",
      },
    ])
    .then((answers) => {
      if (answers.confirm) {
        config = JSON.parse(
          fs.readFileSync(path.join(configDir, "default.json"), "utf8")
        );
        setActivity(config.rpc.discord);
        console.log("\x1b[32mActivity updated!\x1b[0m");
        console.log(config.rpc.discord);

        askForActivity(); // Recursively call the function
      } else {
        process.exit();
      }
    });
}

//const currentTime = new Date();
// Set activity => Set current activity for the user
function setActivity(config) {
  const activity = {
    details: config.details || undefined,
    state: config.state || undefined,
    partySize: config.partySize || undefined,
    partyMax: config.partyMax || undefined,
    startTimestamp: config.startTimestamp
      ? new Date().setHours(0, 0, 0, 0)
      : undefined,
    endTimestamp: config.endTimestamp ? new Date() : undefined,
    largeImageKey: config.largeImageKey || undefined,
    largeImageText: config.largeImageText || undefined,
    smallImageKey: config.smallImageKey || undefined,
    smallImageText: config.smallImageText || undefined,
    instance: false,
    buttons: [],
  };

  if (config.joinButton.enabled) {
    activity.buttons.push({
      label: config.joinButton.label,
      url: config.joinButton.url,
    });
  }

  if (config.spectateButton.enabled) {
    activity.buttons.push({
      label: config.spectateButton.label,
      url: config.spectateButton.url,
    });
  }

  client.setActivity(activity);
}
