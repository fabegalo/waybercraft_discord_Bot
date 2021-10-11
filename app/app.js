const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents } = require('discord.js');

var { token, APPLICATION_ID, GUILD_ID } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const { SlashCommandBuilder } = require('@discordjs/builders');

const teste = [
    new SlashCommandBuilder().setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true)),
]   .map(command => command.toJSON());

async function initialize() {
    const commands = require("./commands.json");
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
    const { execCommands } = require('./commands/commands');
    const { execInteractions } = require('./commands/newCommands');
    
    //client.login(process.env.token); //prod
    client.login(token); //teste

    execInteractions(client);
    execCommands(client);
}

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

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

module.exports = { initialize, execute };