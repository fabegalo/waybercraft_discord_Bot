const { distube } = require("../libs/distube");

const { MessageEmbed, Permissions } = require('discord.js');
const { getCargos, setBooster } = require("../api/api");
const { removeAllMembersFromRole, addCargo, validaPermissaoInteraction, getPremiumMembers } = require("../utils/functions");

async function execInteractions(client) {
    client.on('interactionCreate', async interaction => {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "booster") {
            var hasPermission = await validaPermissaoInteraction(interaction, Permissions.FLAGS.MANAGE_CHANNELS);
            if (hasPermission) {
                await interaction.reply("Sincronizando...");

                var users = await getPremiumMembers(client);

                var retorno = "Usuarios Sincronizados: \n";

                await users.map(async (membro, indice) => {
                    sucesso = await setBooster(membro.user.id, 'ativo');

                    if (sucesso) {
                        retorno = retorno + membro.user.tag + '\n';
                        await interaction.editReply(retorno);
                    }
                })
            }
        }

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
            var hasPermission = await validaPermissaoInteraction(interaction, Permissions.FLAGS.MANAGE_CHANNELS);
            if (hasPermission) {
                await interaction.reply("Resetting...");
                client.destroy();
                client.login(process.env.TOKEN);
                await interaction.editReply("Complete!");
            }
        }

        if (interaction.commandName === 'update') {
            await interaction.reply("Atualizando...");
            var hasPermission = await validaPermissaoInteraction(interaction, Permissions.FLAGS.MANAGE_CHANNELS);
            if (hasPermission) {
                try {
                    var cargo = interaction.options.get("cargo").value;

                    removidos = await removeAllMembersFromRole(client, cargo);

                    var users = await getCargos(cargo);

                    var names = '\n';

                    users.map((user, index) => {
                        addCargo(client, cargo, user.discord_id);
                        names = names + '   +   ' + user.username + '\n';
                    });

                    var namesRemovidos = '\n';

                    removidos.map((user, index) => {
                        namesRemovidos = namesRemovidos + '   -   ' + user.user.username + '\n';
                    });

                    await interaction.editReply(`Atualização do Cargo => ${cargo} \n\n Adicionado: ${names} \n Removido: ${namesRemovidos}`);
                } catch (error) {
                    await interaction.editReply(`ERRO: ${error}`)
                }
            }
        }
    });
}

module.exports = { execInteractions };