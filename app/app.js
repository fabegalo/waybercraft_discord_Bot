const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Permissions } = require('discord.js');

var TOKEN = process.env.TOKEN;
var APPLICATION_ID = process.env.APPLICATION_ID;
var GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents:[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES]});

const { enablePermissionsManager } = require('./libs/permissionManager');
const { execCommands } = require('./commands/commands');
const { execInteractions } = require('./commands/slashCommands');

async function initialize() {
    const commands = require("./slashCommands.json");
    const rest = new REST({ version: '9' }).setToken(TOKEN);

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
}

async function execute() {
    client.login(TOKEN);

    execInteractions(client);
    execCommands(client);
}


process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.once('ready', () => {
    console.log('Ready, Bot is Now Online! WayBerCraft!');
    console.log(`Logged in as ${client.user.tag}!`);

    //gerenciador de permissões do app
    enablePermissionsManager(client);
});

client.once("reconnecting", () => {
    console.log("Reconnecting!");
});

client.once("disconnect", () => {
    console.log("Disconnect!");
});
module.exports = { initialize, execute };

