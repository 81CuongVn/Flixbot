require('dotenv').config();

const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', function(e) {
    console.log(`Logged in as ${client.user.tag}`)
});

const prefix = '!';

client.on('messageCreate', function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'ping'){
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Active, Latency:${timeTaken}ms`);
    };

    if (command === 'random'){
        // get random movie
    };
    
    if (command === 'somethinglike'){
        // get similar movie
    };

    if (command === 'review'){
        // get general few worded movie review
    }

});

client.login(process.env.DISCORD_TOKEN)



