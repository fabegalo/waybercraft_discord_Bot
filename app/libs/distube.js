const { DisTube } = require('distube');

const { Client, Intents, Permissions } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const distube = new DisTube(client, { searchSongs: 15, emitNewSongOnly: true });

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


module.exports = { distube };