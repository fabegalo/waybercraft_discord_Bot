const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');

var token = process.env.TOKEN;
var APPLICATION_ID = process.env.APPLICATION_ID;
var GUILD_ID = process.env.GUILD_ID;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const { enablePermissionsManager } = require('./libs/permissionManager');
const { execCommands } = require('./commands/commands');
const { execInteractions } = require('./commands/newCommands');

//const { SlashCommandBuilder } = require('@discordjs/builders');

// const teste = [
//     new SlashCommandBuilder().setName('echo')
// 	.setDescription('Replies with your input!')
// 	.addStringOption(option =>
// 		option.setName('input')
// 			.setDescription('The input to echo back')
// 			.setRequired(true)),
// ]   .map(command => command.toJSON());

async function initialize() {
    const commands = require("./sources/commands.json");
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
}

async function execute() {
    client.login(token);

    execInteractions(client);
    execCommands(client);

    client.on("guildMemberUpdate", (oldMember, newMember) => {
        const oldStatus = oldMember.premiumSince;
        const newStatus = newMember.premiumSince;

        if (!oldStatus && newStatus) {
            client.channels.cache.get('894816314240143410').send(`${newMember.user.tag} Impulsionou o servidor!`);
            newMember.send('Obrigado por impulsionar o servidor!');
        }

        if (oldStatus && !newStatus) {
            client.channels.cache.get('894816314240143410').send(`${newMember.user.tag} Deixou de impulsionar o servidor`);
        }
    })
}

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.once('ready', () => {
    console.log('Ready Bot Online ! WayberCraft!');
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