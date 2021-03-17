require('dotenv').config();
const dataAccessMan = require('../db/dataAccess');
const { Client } = require('discord.js');

const client = new Client();

const listCommand = [
    "Hey mate thanks for asking! Here is some feature that you can use for now : ",
    "!ip tag - for the answer of your what's your tag",
    "!ip currentuser - list of user that has sayaing hello to this channel",
    "!ip hello - to say hello !",
    "!ip help - to see this message for helping you again :)"
]

client.on('ready', () => {
    console.log(`${client.user.username}`);
});

client.on("message", async (message) => {
    if (message.author.bot) return;

    if (message.content === '!ip hello') {
        var exist = await dataAccessMan.hasSayHello(message.author.tag) != false;
        console.log(exist);
        if (exist) {
            message.channel.send(`Hi I remember you ${message.author.username}!`);
        }
        else {
            await dataAccessMan.addUser(message.author.tag);
            message.channel.send(`Nice to meet you ${message.author.username}!`);
        }

    }
    else if (message.content === '!ip currentuser') {
        var listUser = await dataAccessMan.getUser();

        message.channel.send(JSON.stringify(listUser));
    }
    else if (message.content === '!ip tag') {
        message.channel.send(`hello there ${message.author.tag}!`);
    }
    else if (message.content === "!ip help") {
        message.channel.send(listCommand.join("\n"));
    }
})

client.login(process.env.DISCORD_TOKEN);