const Discord = require('discord.js');
const DisTube = require('distube');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();

const fetch = require('node-fetch'); //https requests

const exampleEmbed = new Discord.MessageEmbed().setTitle('Some title'); //embed discord

const { badword } = require('./bad_words.json');
const words = badword.split(' ');

client.once('ready', () => {
    console.log('Ready Bot Online ! WayberCraft!');
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnect!");
});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

const distube = new DisTube(client, { searchSongs: true, emitNewSongOnly: true });

client.on('message', message => {

    //message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);

    if (!message.author.bot) {
        for (x = 0; x < words.length; x++) {
            if (message.content.match('\\b' + words[x] + '\\b', 'gi') != null) {
                message.delete({ timeout: 10 });
                message.channel.send(`O: ${message.author.username}\n <@!${message.author.id}> meça suas palavras parça`);
            }
        }
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    // if(command == 'send'){

    //     if (!args.length) {
    //         return message.channel.send(`Faltam Argumentos , ${message.author}!`);
    //     }else{
    //         const args = message.content.slice(prefix.length).trim().split('send');
    //         message.guild.members.cache.each(
    //             guild => guild.user.send(args)
    //         );
    //     }
    // }

    if (command == 'sendto') {
        if (!args.length) {
            return message.channel.send(`Faltam Argumentos , ${message.author}!`);
        } else {
            const user = message.mentions.users.first();
            if (user == undefined) {
                return message.reply('insira uma menção valida!');
            }
            message.delete({ timeout: 10 });
            const args = message.content.slice(prefix.length).trim().split(`sendTo <@!${user.id}>`);
            user.send(args);
        }
    }

    if (command == 'users') {
        var list = [];
        var count = 0;
        message.guild.members.cache.each(function () {
            guild => list += guild.user.username + ' \n'
            count++;
        });
        message.channel.send('Quantidade: ' + count + '\n' + list);
        message.channel.send(`Online: ${client.guilds.cache.size}`);
    }

    if (command == "toca" || command == "tocar") {
        if (!args.length) {
            return message.channel.send(`Faltam Argumentos , ${message.author}!`);
        }
        else {
            if (message.channel.type !== 'text') return;
            distube.play(message, args.join(" "));
            return;
        }
    }

    if (["repeat", "loop"].includes(command)) {
        distube.setRepeatMode(message, parseInt(args[0]));
    }

    if (command == "parar") {
        distube.stop(message);
        message.channel.send("Parou a música!");
    }

    if (command == "altura") {
        distube.setVolume(message, 100);
        message.channel.send("Alterou o volume!");
    }

    if (command == "pular") {
        distube.skip(message);
    }

    if (command == "lista") {
        let queue = distube.getQueue(message);

        if (queue == undefined) {
            message.channel.send('Lista Vazia!');
            return;
        }

        message.channel.send('Fila atual:\n' + queue.songs.map((song, id) =>
            `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
        ).slice(0, 10).join("\n"));
    }

    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        let filter = distube.setFilter(message, command);
        message.channel.send("Filtro de fila atual: " + (filter || "Off"));
    }

    if (command == 'comandos') {
        const user = client.users.cache.get(message.author.id)
        user.send('Olá, eu sou o waynerzito estou aqui para te ajudar \n' + 'Aqui esta a lista de comandos: \n' + ' \n !toca {url} \n !users \n !parar \n !sendTo {@mention} {msg here}');
    }

    if (command == 'filtros') {
        message.channel.send("Filtro de fila atual:: " + ("Off" + '\n Filtros Disponiveis: ' + '\n 3d' + '\n bassboost' + '\n karaoke' + '\n nightcore' + '\n vaporwave'));
    }
});

// Queue status template
const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

// DisTube event listeners, more in the documentation page
distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Tocando \`${song.name}\` - \`${song.formattedDuration}\`\nRequerido por: ${song.user}\n${status(queue)}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `Adicionada ${song.name} - \`${song.formattedDuration}\` para a fila por ${song.user}`
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `Tocando \`${playlist.name}\` playlist (${playlist.songs.length} músicas).\nRequerido por: ${song.user}\nTocando agora \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `Adicionada \`${playlist.name}\` playlist (${playlist.songs.length} músicas) na fila\n${status(queue)}`
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Escolha uma opção abaixo**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Digite qualquer outra coisa ou aguarde 60 segundos para cancelar*`);
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`Pesquisa cancelada`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("Um erro encontrado: " + e);
    });

//client.login(token); //teste

client.login(process.env.token); //prod