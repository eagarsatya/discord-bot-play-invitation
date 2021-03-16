require('dotenv').config();

console.log(process.env.DISCORD_TOKEN);

const { Client } = require('discord.js');

const client = new Client();

client.on('ready', () => {
    console.log(`${client.user.username}`);
});

client.on("message", (message) => {
    if (message.author.bot) return;
    console.log(message.content);

    if (message.content === 'hello') {
        message.channel.send('hello there');
    }
})

client.login(process.env.DISCORD_TOKEN);