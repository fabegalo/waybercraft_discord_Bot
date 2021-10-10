const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const Discord = require('discord.js');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const { DisTube } = require('distube');
const fs = require('fs');

const scores = require("./scores.json");
typeof scores; // object

var { prefix, token, APPLICATION_ID, GUILD_ID } = require('./config.json');

const fetch = require('node-fetch'); //https requests

const { badword } = require('./bad_words.json');
const words = badword.split(' ');

const commands = [{
    name: 'ping',
    description: 'Replies with Pong!'
}];

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.login(token); //teste

//client.login(process.env.token); //prod

client.once('ready', () => {
    console.log('Ready Bot Online ! WayberCraft!');
    console.log(`Logged in as ${client.user.tag}!`);
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnect!");
});

client.on('interactionCreate', async interaction => {

    //console.log(interaction);

    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.on("messageCreate", message => {
    //console.log(message);
});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

const distube = new DisTube(client, { searchSongs: 15, emitNewSongOnly: true });

client.on('message', async message => {

    //message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);

    //seção para validar as mensagens enviadas!!!

    //console.log(message.guild.id);

    //Se Mensagem for do servidor WayberCraft
    if (message.guild != null && message.guild.id == '705499998057398273') {
        // if(message.content.match("^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.(?!$)|$)){4}$")){
        //     message.delete();
        //     message.channel.send(`<@!${message.author.id}> Você não pode enviar convites de outros servidores aqui!`);
        // }
    }

    if (message.guild != null && message.guild.id == '354099395903488001') {
        prefix = ':>';
    } else {
        prefix = '!';
    }

    if (!message.author.bot) {
        for (x = 0; x < words.length; x++) {
            if (message.content.match('\\b' + words[x] + '\\b', 'gi') != null) {
                message.delete({ timeout: 10 });
                message.channel.send(`O: ${message.author.username}\n <@!${message.author.id}> meça suas palavras parça`);
            }
        }
    }

    //-----------------Seção para tratar comandos dos usuarios------------------------------------------------------------------

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

    if (command == 'limpar') {

        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
            return message.reply("Você é fraco, lhe falta permissão para Gerenciar Mensagens para usar esse comando");
        }

        const deleteCount = parseInt(args[0], 10);

        if (!deleteCount || deleteCount < 1 || deleteCount >= 100) {
            return message.reply("forneça um número de até 100 mensagens a serem excluidas");
        }

        try {
            if (message.guild != null) {
                console.log("Delete Messages!")

                await message.delete();

                await message.channel.messages.fetch({ limit: deleteCount }).then(messages => { // Fetches the messages
                    message.channel.bulkDelete(messages).then(messages => {
                        message.channel.send(`${messages.size} mensagens limpas nesse chat solicitado por <@!${message.author.id}>`).then(message => {
                            message.delete({ timeout: 8000 });
                            message.react("👌");
                        });
                    }).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
                });

            }
        } catch (err) {
            console.log(err);
        }
    }

    if (command == 'avatar') {
        const args = message.content.slice(prefix.length).trim().split('avatar');
        const user = client.users.cache.get(message.author.id)

        const embed = new Discord.MessageEmbed()
            .setTitle('WayberCraft!')
            .setAuthor("Info", "https://waybercraft.com.br/images/icon_app.png")
            .setDescription("TESTE")
            .setThumbnail("https://waybercraft.com.br/images/icon_app.png")
            .setImage("https://waybercraft.com.br/images/header.png")
            .setFooter("by fabegalo :D")
            //.addField("Pontos: ", scores[message.author.tag] == undefined ? 0 : scores[message.author.tag].money)
            //.addField("Membros: ", message.guild.memberCount ?? "teste")
            .addField("Voce é gay ?: ", user.username.length > 10 ? "Sim" : "Não")
            .setColor('ORANGE')
            .setTimestamp()

        message.channel.send( {embeds: [embed]})
    }

    if (command == "ping") { // Check if message is "!ping"
        message.channel.send("Pinging ...") // Placeholder for pinging ... 
            .then((msg) => { // Resolve promise
                msg.edit("Ping: " + (Date.now() - msg.createdTimestamp)) // Edits message with current timestamp minus timestamp of message
            });
    }

    if (!message.author.bot && command != "pontos") {
        if (!scores[message.author.tag]) {
            scores[message.author.tag] = {
                money: 0
            };
        }

        scores[message.author.tag].money += 25;
        fs.writeFileSync("./scores.json", JSON.stringify(scores));
    }

    if (command == "pontos") {

        if (!scores[message.author.tag]) {
            scores[message.author.tag] = {
                money: 0
            };
        }

        message.reply(`Seus pontos é: ${scores[message.author.tag].money}`);

        fs.writeFileSync("./scores.json", JSON.stringify(scores));
    }

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
            distube.play(message, args.join(" "));
            return;
        }
    }

    if (command == "autoplay") {

        let queue = distube.getQueue(message);

        if(queue == undefined){
            message.channel.send('Nenhuma Musica Tocando!');
            return;
        }

        let mode = distube.toggleAutoplay(message);
        message.channel.send("Set autoplay mode to `" + (mode ? "On" : "Off") + "`");
    }

    if (["repeat", "loop"].includes(command)) {
        distube.setRepeatMode(message, parseInt(args[0]));
    }

    if (command == "parar") {
        distube.stop(message);
        message.channel.send("Parou a música!");
    }

    if (command == "altura") {
        distube.setVolume(message, parseInt(args[0]));
        message.channel.send("Alterou o volume! para: " + parseInt(args[0]));
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
    .on("playSong", (queue, song) => queue.textChannel.send(
        `Tocando \`${song.name}\` - \`${song.formattedDuration}\`\nRequerido por: ${song.user}\n${status(queue)}`
    ))
    .on("addSong", (queue, song) => queue.textChannel.send(
        `Adicionada ${song.name} - \`${song.formattedDuration}\` para a fila por ${song.user}.`
    ))
    // .on("playList", (message, queue, playlist, song) => message.channel.send(
    //     `Tocando \`${playlist.name}\` playlist (${playlist.songs.length} músicas).\nRequerido por: ${song.user}\nTocando agora \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
    // ))
    .on("addList", (queue, playlist) => queue.textChannel.send(
        `Adicionada \`${playlist.name}\` playlist (${playlist.songs.length} músicas) na fila\n${status(queue)}`
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Escolha uma opção abaixo**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Digite qualquer outra coisa ou aguarde 60 segundos para cancelar*`);
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`Pesquisa cancelada`))
    .on('searchNoResult', message => message.channel.send(`No result found!`))
    .on('searchInvalidAnswer', message => message.channel.send(`searchInvalidAnswer`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("Um erro encontrado: " + e);
    })
    .on('searchDone', (message, answer, query) => message.channel.send("Busca Finalizada!"))
    .on('finish', queue => queue.textChannel.send('Finish queue!'))
	.on('finishSong', queue => queue.textChannel.send('Finish song!'))
	.on('disconnect', queue => queue.textChannel.send('Disconnected!'))
	.on('empty', queue => queue.textChannel.send('Empty!'));