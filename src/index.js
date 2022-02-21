require('dotenv').config();
const axios = require('axios');

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
        // active 
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Active with a latency of ${timeTaken}ms`);
    } else if (command === 'info'){
        // get movie info
        axios.get('http://www.omdbapi.com?t='+args.join("+")+'&apikey='+process.env.API_KEY)
            .then((response) => {
                message.reply('Plot: '+response.data.Plot + '\n' +
                'Released in ' + response.data.Released + ' with a runtime of ' + response.data.Runtime + '.\n' +
                'The genres include: ' + response.data.Genre + '.\n' +
                'Directed by ' + response.data.Director + '.\n' + 
                'Has actors like ' + response.data.Actors + '.\n' +
                response.data.Awards + ' and made around  ' + response.data.BoxOffice + '.\n');
                message.channel.send(response.data.Poster);
            })
            .catch((error) => {
                console.log(error);
                message.reply("Can't find that movie.")
            })
    } else if (command === 'review'){
        // get random movie info
        axios.get('http://www.omdbapi.com?t='+args.join("+")+'&apikey='+process.env.API_KEY)
            .then((response) => {
                let consenus = '';
                if (response.data.imdbRating < 5){
                    consenus += 'bad';
                } else if (response.data.imdbRating > 5 && response.data.imdbRating < 7){
                    consenus += 'okay';
                } else if (response.data.imdbRating > 7 && response.data.imdbRating < 8){
                    consenus += 'pretty good'
                } else consenus += 'great';
                message.reply('Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value + '\n' +
                'Metacritic Rating: ' + response.data.Ratings[2].Value + '\n' +
                'Looks to be ' + consenus + '.')
            })
            .catch((error) => {
                console.log(error);
                message.reply("Can't find that movie.")
            })
    } else if (command === 'trailer'){

    }
    
    if (command === 'test'){
        // get similar movie
        message.reply('input was: ' + args.join("+"));

    };

});

client.login(process.env.DISCORD_TOKEN)
