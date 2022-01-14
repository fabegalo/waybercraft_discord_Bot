async function enablePermissionsManager(client) {

    const GUILD_ID = process.env.GUILD_ID;

    if (!client.application?.owner) await client.application?.fetch();

    var commands = [];
    var cargos = [];

    var cargoDonoId;

    server = client.guilds.cache.get(GUILD_ID)

    perm = server.commands.permissions;

    await server.roles.fetch()
        .then((roles) => {
            cargos = roles;
        })
        .catch(console.error);

    cargos.map((valor, index) => {
        if (valor.name == '👑 Donos') {
            //console.log(valor.permissions.toArray())
            cargoDonoId = valor.id;
        }
    });

    //create the permissions objects
    const permissions2 = [{
        id: server.roles.everyone.id,
        type: 'ROLE',
        permission: true,
    }];

    const permissions1 = [{
        id: cargoDonoId,
        type: 'ROLE',
        permission: true,
    }];

    await client.guilds.cache.get(GUILD_ID).commands.fetch().then((teste) => {
        commands = teste;
    });

    commands.map((valor, index) => {
        if (valor.defaultPermission) {
            setCommandPermission(client, GUILD_ID, index, permissions2);
        } else {
            setCommandPermission(client, GUILD_ID, index, permissions1);
        }
    });
}

async function setCommandPermission(client, guildId, commandId, permissions) {
    const command = await client.guilds.cache.get(guildId)?.commands.fetch(commandId);
    await command.permissions.add({ permissions });
}

module.exports = { enablePermissionsManager };