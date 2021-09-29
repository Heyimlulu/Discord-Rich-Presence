# Discord-Rich-Presence

Discord Rich Presence is a Rich Presence Client (RPC) that show off what users are doing with Discord's status feature

Original project made by [Xanll](https://github.com/Xanll)

## Getting Started

1. Fork or download this project
2. Go to the [Applications](https://discordapp.com/developers/applications/) page and create a new application. 
   1. The name should be whatever you want to be for the status, I.E. "Playing with my friends"
3. Now go to the `Rich Presence` tab > `Art Assets`
   1. Add images you would like to be displayed on the RPC. Make sure to give them names
4. Rename `example-config.json` to `config.json`
5. Edit the properties you need (See #Configuration)

## Running

```
node index.js or npm start
```

You can also double click on `start.bat` to run this project in Windows CMD

## Configuration

### General

| Parameters | Description | Type |
| :------: | :------: | :-------: |
| appid | The application ID | number |
| interval | Delay in milliseconds | number |
| sleepTime | Your sleep schedule. (See #Sleep Times) | array |

----

### Discord

| Parameters | Description | Type |
| :------: | :------: | :-------: |
| details | What the user is currently doing | string |
| state | The user's current state "I.E., In a group" | string |
| partySize | Current size of the user's party | number |
| partyMax | Maximum size of the user's party | number |
| startTimestamp | Epoch seconds for status start | boolean |
| largeImageKey | Name of the large image you want | string |
| largeImageText | Text you want to show when hovering over the large image | string |
| smallImageKey |  Name of the small image you want | string |
| smallImageText | Text you want to show when hovering over the small image | string |
| joinButton | Display a "Ask to Join" button | boolean |
| spectateButton | Display a "Spectate" button | boolean |

----

### SleepTime

| Parameters | Description | Type |
| :------: | :------: | :-------: |
| details | What the user is currently doing | string |
| state | The user's current state "I.E., In a group" | string |
| partySize | Current size of the user's party | number |
| partyMax | Maximum size of the user's party | number |
| endTimestamp | Epoch seconds for status end | boolean |
| largeImageKey | Name of the large image you want | string |
| largeImageText | Text you want to show when hovering over the large image | string |
| joinButton | Display a "Ask to Join" button | boolean |
| spectateButton | Display a "Spectate" button | boolean |

## Sleep Times

Each array has his own day, first is Monday and last is Sunday

```
"sleepTime": [
        [ 22, 7  ], <= Monday
        [ 22, 7  ],
        [ 22, 7  ],
        [ 22, 7  ],
        [ 22, 7  ],
        [ 23, 10 ],
        [ 23, 10 ]  <= Sunday
    ]
```

### I.E. My sleep schedule

| Days | Sleep time | Wake up time | 
| :----: | :----: | :----: |
| Monday | 22 PM | 7 AM |
| Tuesday | 22 PM | 7 AM |
| Wednesday | 22 PM | 7 AM |
| Thursday | 22 PM | 7 AM |
| Friday | 22 PM | 7 AM |
| Saturday | 23 PM | 10 AM |
| Sunday | 23 PM | 10 AM |

# Aknowledgments

- [Discord](https://discord.com/developers/docs/rich-presence/how-to) for theirs docs
