require('dotenv').config();
const dataAccessMan = require('../db/dataAccess');
const commonMan = require('./utilities/common');
const { Client } = require('discord.js');

// const regex = new RegExp('!ip play [\d|\D]{1,100} (0[0-9]|1[0-9]|2[1-3]):([0-5][0-9])')

const client = new Client();

const listCommand = [
    "Hey mate thanks for asking! Here is some feature that you can use for now : ",
    "MAIN FEATURE : ",
    "=====================",
    "!ip play [game(anystring 1-100)] [time(hh:mm)]",
    "!ip join",
    "!ip list",
    "!ip clear",
    "EXTRA FEATURE : ",
    "=====================",
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
    else if (message.content.startsWith("!ip play")) {
        let currentDate = new Date();

        try {
            var substringHour = parseInt(message.content.substr(message.content.length - 5, 2));
            var substringMinute = parseInt(message.content.substr(message.content.length - 2, 2));

            var game = message.content.substring(9, message.content.length - 5)
        } catch (e) {
            message.channel.send("Failed to substring :')");
            return;
        }

        let playDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), substringHour, substringMinute);
        let dateString = [playDate.getMonth() + 1,
        playDate.getDate(),
        playDate.getFullYear()].join('/') + ' ' +
            [playDate.getHours(),
            playDate.getMinutes(),
            playDate.getSeconds()].join(':');

        let currentPlayInvitation = await dataAccessMan.findPlayInvitation(message.channel.id);
        if (currentPlayInvitation.length > 0) {
            message.channel.send(`There's Play Invitation that currently running for Game : ${currentPlayInvitation[0].game}`);
            return;
        }

        let result = await dataAccessMan.createPlayInvitation(message.author.id, playDate / 1000, message.channel.id, game);
        if (result) {
            message.channel.send(`<@${message.author.id}> invite you to play ${game} at ${dateString}`);
        }
        else {
            message.channel.send("Something went wrong while creating Play Invitation");
        }
    }
    else if (message.content === "!ip list") {
        let currentPlayInvitation = await dataAccessMan.findPlayInvitationDetail(message.channel.id);
        if (currentPlayInvitation.length > 0) {
            let table = commonMan.convertJsonToTable(currentPlayInvitation);
            message.channel.send(table);
        }
        else {
            message.channel.send("There isn't any Play Invitation for now. Invite your friends to play?");
        }
    }
    else if (message.content === "!ip join") {
        let currentPlayInvitation = await dataAccessMan.findPlayInvitation(message.channel.id);
        if (currentPlayInvitation.length == 0) {
            message.channel.send("There isn't any Play Invitation for now. Invite your friends to play?");
            return;
        }

        let currentPlayInvitationId = currentPlayInvitation[0].play_invitation_id;

        let userAlreadyJoin = await dataAccessMan.userAlreadyJoin(currentPlayInvitationId, message.author.id);

        if (userAlreadyJoin) {
            message.channel.send("You already join the party! Good luck, have fun!");
            return;
        }

        let result = await dataAccessMan.insertParticipant(currentPlayInvitationId, message.author.id)

        if (result === true) {
            message.channel.send("Succesfully join the party! Have fun!");
        }
        else {
            message.channel.send("Failed to join the party :'(");
        }
    }
    else if (message.content === "!ip clear") {
        let result = await dataAccessMan.clearInvitation(message.channel.id);
        if (result) {
            message.channel.send("Cleared!");
            return;
        }
        message.channel.send("Failed to clear the invitation");
    }
})

client.login(process.env.DISCORD_TOKEN);