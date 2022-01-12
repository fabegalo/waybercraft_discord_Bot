const { distube } = require("../libs/distube");

const { MessageEmbed, Permissions } = require('discord.js');

async function execInteractions(client) {
    client.on('interactionCreate', async interaction => {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }

        if (interaction.commandName === 'vote') {
            await interaction.reply('**Para realizar seu voto utilize os seguintes Links:**\n  > https://minecraft-mp.com/server/283671/vote/ \n  > https://minecraftpocket-servers.com/server/110446/vote/ \n\n`OBS:` Lembrando que todos os votos são contados e armazenados por nick, para recebimento de futuras recompensas!');
        }

        if (interaction.commandName === 'tocar') {
            await interaction.deferReply({ ephemeral: true });

            var search = interaction.options.get("search").value;
            const msg = interaction.member.voice.channel
            await distube.playVoiceChannel(msg, search, { textChannel: interaction.channel });

            await interaction.editReply("Executado!");
        }

        if (interaction.commandName === 'reload') {
            var hasPermission = await validaPermissao(interaction, Permissions.FLAGS.MANAGE_CHANNELS);
            if (hasPermission) {
                await interaction.reply("Resetting...");
                client.destroy();
                client.login(process.env.TOKEN);
                await interaction.editReply("Complete!");
            }
        }
    });
}

async function validaPermissao(interaction, permission) {
    if (!interaction.memberPermissions.has(permission)) {
        interaction.reply("Você é fraco, lhe falta permissão para usar esse comando");
        return false;
    }

    return true;
}

module.exports = { execInteractions };