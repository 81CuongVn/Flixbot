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
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Active with a latency of ${timeTaken}ms`);
    } else if (command === 'kick'){
        if (!message.member.hasPermission('KICK_MEMBERS')){
          
            return message.reply('You need permission in order to kick.')
        } else if (args.length === 0){
            return message.reply('Please provide a member to kick.')
        } 
        const member = message.guild.members.cache.get(args[0]);
        if (member) {
            member
                .kick()
                .then((mem) => message.channel.send(`${member} was kicked.`))
                .catch((error) => {
                    console.log(error);
                    message.channel.send(`Cannot kick ${member}`);
                })
        } else {
            message.channel.send('User was not found');
        }
    } else if (command === 'ban'){
        if (!message.member.hasPermission('BAN_MEMBERS')){
            return message.reply('You need permission in order to ban.')
        } else if (args.length === 0){
            return message.reply('Please provide a member to ban.')
        }
        try {
            const user = await message.guild.members.ban(args[0]);
            message.channel.send(`${user} has been banned.`);
        } catch (error) {
            console.log(error);
            message.channel.send('Cannot kick that user.');
        }  
    } else if (command === 'announce'){
        console.log(args);
        const announcement = args.join(' ');
        console.log(announcement);
        message.channel.send('@everyone ' + announcement);

    } else if (command === 'roleadd') {
        const role = message.guild.roles.cache.get(args[0]);
        const member = message.guild.members.cache.get(args[1]);
        member.roles
            .add(role)
            .then((mem) => message.reply(`${role} has been added to ${member}`))
            .catch((error) => {
                console.log(error)
                message.reply(`Unable to add ${role} to ${member}.`)
            })
    } else if (command === 'roleremove') {
        const role = message.guild.roles.cache.get(args[0]);
        const member = message.guild.members.cache.get(args[1]);
        member.roles
            .remove(role)
            .then((mem) => message.reply(`${role} has been removed from ${member}`))
            .catch((error) =>{
                console.log(error)
                essage.reply(`Unable to remove ${role} from ${member}.`)
            })
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
                message.reply("Can't find that movie.");
            })
    } else if (command === 'rating'){
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
                'Looks to be ' + consenus + '.');
            })
            .catch((error) => {
                console.log(error);
                message.reply("Can't find that movie.");
            })
    } else if (command === 'somethinglike'){
        axios.get('https://api.themoviedb.org/3/search/movie?api_key='+process.env.TMDB_KEY+'&query='+args.join("+"))
        .then((response) => {
            console.log(response.data.results[0].id);
            let id = response.data.results[0].id;
            axios.get('https://api.themoviedb.org/3/movie/'+id+'/recommendations?api_key='+process.env.TMDB_KEY+'&language=en-US&page=1')
                .then((res) => {
                    // gets the top 3 results, and chooses one
                    let resultRank = Math.floor((Math.random()*3));
                    message.reply('A similar movie is: ' + res.data.results[resultRank].original_title + '.\n' +
                    'Overview: ' + res.data.results[resultRank].overview);
                })
                /**
                 *  // gets the top 5 results
                    message.reply('Top 5 similar movies are: ' + res.data.results[0].original_title + ', ' +
                    res.data.results[1].original_title + ', ' + res.data.results[2].original_title + ', ' +
                    res.data.results[3].original_title + ', ' + res.data.results[4].original_title)
                 */
                .catch((error) => {
                    console.log(error);
                    message.reply("Can't find that movie.");
                })
        })
        .catch((error) => {
            console.log(error);
        })
    } else if (command === 'trending'){
        axios.get('https://api.themoviedb.org/3/movie/popular?api_key='+process.env.TMDB_KEY+'&language=en-US&page=1')
            .then((response) => {
                message.reply('These movies seem to trending: \n'+
                '1. '+response.data.results[0].original_title+'\n' +
                '2. '+response.data.results[1].original_title+'\n' +
                '3. '+response.data.results[2].original_title+'\n' +
                '4. '+response.data.results[3].original_title+'\n' +
                '5. '+response.data.results[4].original_title+'\n');
            })
            .catch((error) => {
                console.log(error);
                message.reply("Can't find that movie.");
            })
    } else if (command === 'watch'){
        // method to open a watch link to whatever movie is queried
    }    
});

client.login(process.env.DISCORD_TOKEN)
