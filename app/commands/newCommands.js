const { distube } = require("../libs/distube");

const { MessageEmbed, Permissions } = require('discord.js');
const { getCargos } = require("../api/api")

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

        if (interaction.commandName === 'update') {
            await interaction.reply("Atualizando...");
            var hasPermission = await validaPermissao(interaction, Permissions.FLAGS.MANAGE_CHANNELS);
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

async function validaPermissao(interaction, permission) {
    if (!interaction.memberPermissions.has(permission)) {
        interaction.reply("Você é fraco, lhe falta permissão para usar esse comando");
        return false;
    }

    return true;
}

async function addCargo(client, cargo, userId) {
    server = await client.guilds.cache.get(process.env.GUILD_ID)
    roleName = await getCargoBySimpleName(cargo);

    let role = await server.roles.cache.find(role => role.name === roleName);

    let users = await server.members.fetch()

    users.map((user, index) => {
        if (user.id == userId) {
            user.roles.add(role);
        }
    })
}

async function removeCargo(params) {

}

async function removeAllMembersFromRole(client, cargo) {
    server = client.guilds.cache.get(process.env.GUILD_ID)
    roleName = await getCargoBySimpleName(cargo);
    let role = server.roles.cache.find(role => role.name === roleName);

    members = role.members;

    members.map((membro, indice) => {
        membro.roles.remove(role);
    })

    return members;
}

async function getCargoBySimpleName(simpleName) {
    switch (simpleName) {
        case 'vip':
            return '💎 VIPs'

        case 'dono':
            return '👑 Donos'

        case 'admin':
            return '🧑‍💼 Admin'

        case 'moderador':
            return '👨‍✈️ Moderador'

        case 'construtor':
            return '👷🏻 Builder'

        case 'ajudante':
            return '🧑‍🔧 Ajudante'

        default:
            return null
    }
}

module.exports = { execInteractions };