const { distube } = require("../libs/distube");

async function execInteractions(client) {
    client.on('interactionCreate', async interaction => {

        if (!interaction.isCommand()) return;
    
        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }

        if(interaction.commandName === 'tocar'){
            await interaction.deferReply({ ephemeral: true });

            var search = interaction.options.get("search").value;
            const msg = interaction.member.voice.channel
            await distube.playVoiceChannel(msg, search, {textChannel: interaction.channel});

            await interaction.editReply("Executado!");
        }
    });
}

module.exports = { execInteractions };