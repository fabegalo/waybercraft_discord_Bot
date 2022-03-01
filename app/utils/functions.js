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

async function validaPermissao(message, permission) {
    if (!message.member.permissions.has(permission)) {
        await message.reply("Você é fraco, lhe falta permissão para usar esse comando");
        message.delete({ timeout: 10 });
        return false;
    }

    return true;
}

async function validaPermissaoInteraction(interaction, permission) {
    if (!interaction.memberPermissions.has(permission)) {
        interaction.reply("Você é fraco, lhe falta permissão para usar esse comando");
        return false;
    }

    return true;
}

async function validaPermissaoCargo(message, roleId) {
    //let role = await server.roles.cache.find(role => role.id === roleId);

    if (!await message.member.roles.cache.has(roleId)) {
        await message.reply("Você é fraco, lhe falta cargo para usar esse comando");
        message.delete({ timeout: 10 });
        return false;
    }

    return true;
}


module.exports = { getCargoBySimpleName, removeAllMembersFromRole, removeCargo, addCargo, validaPermissao, validaPermissaoInteraction, validaPermissaoCargo };