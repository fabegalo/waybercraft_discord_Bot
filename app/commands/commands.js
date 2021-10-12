var { prefix } = require('../config.json');

const { MessageEmbed, Permissions } = require('discord.js');

const { getPerfilApi } = require("../api/api")

const fs = require('fs');
const scores = require("../scores.json");
typeof scores; // object

const { badword } = require('../bad_words.json');
const words = badword.split(' ');

const { distube } = require("../libs/distube");

async function execCommands(client) {

    client.on('messageCreate', async message => {

        //message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);

        //Se Mensagem for do servidor WayberCraft
        if (message.guild != null && message.guild.id == '705499998057398273') {
            // if(message.content.match("^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.(?!$)|$)){4}$")){
            //     message.delete();
            //     message.channel.send(`<@!${message.author.id}> Você não pode enviar convites de outros servidores aqui!`);
            // }
        }

        if (message.guild != null && message.guild.id == '354099395903488001') {
            prefix = ':>';
        } else {
            prefix = '!';
        }

        if (!message.author.bot) {
            for (x = 0; x < words.length; x++) {
                if (message.content.match('\\b' + words[x] + '\\b', 'gi') != null) {
                    message.delete({ timeout: 10 });
                    message.channel.send(`O: ${message.author.username}\n <@!${message.author.id}> meça suas palavras parça`);
                }
            }
        }

        //-----------------Seção para tratar comandos dos usuarios------------------------------------------------------------------
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();

        // if(command == 'send'){

        //     if (!args.length) {
        //         return message.channel.send(`Faltam Argumentos , ${message.author}!`);
        //     }else{
        //         const args = message.content.slice(prefix.length).trim().split('send');
        //         message.guild.members.cache.each(
        //             guild => guild.user.send(args)
        //         );
        //     }
        // }

        if (command == 'nickname') {

        }

        if (command == 'perfil') {

            const user = client.users.cache.get(message.author.id)
            var discordId = user.id;

            var profile = await getPerfilApi(discordId);

            if (profile == false) {
                message.reply("Conta Discord Não Vinculada!");
                return;
            }

            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            const profileEmbed = {
                color: 0x0099ff,
                title: 'Minecraft Perfil',
                url: 'https://www.waybercraft.com.br',
                author: {
                    name: 'Profile',
                    icon_url: 'https://www.waybercraft.com.br/images/icon_app.png',
                    url: 'https://www.waybercraft.com.br',
                },
                description: '**__INFORMAÇÕES DA CONTA__**',
                thumbnail: {
                    url: profile.avatarSkin,
                },
                fields: [
                    {
                        name: '•Claims',
                        value: profile.claims.length.toString()
                    },
                    // {
                    //     name: '\u200b',
                    //     value: '\u200b',
                    //     inline: false,
                    // },
                    {
                        name: '•Money',
                        value: formatter.format(profile.data.money),
                        inline: true,
                    },
                    {
                        name: '•Homes',
                        value: profile.data.homes == undefined ? "0" : Object.keys(profile.data.homes).length.toString(),
                        inline: true,
                    },
                    {
                        name: '•Tempo de Jogo',
                        value: profile.timeGame,
                        inline: true,
                    },
                ],
                image: {
                    url: profile.bodySkin,
                },
                timestamp: new Date(),
                footer: {
                    text: 'powered by fabegalo :D',
                    icon_url: 'https://www.waybercraft.com.br/images/icon_app.png',
                },
            };

            message.channel.send({ embeds: [profileEmbed] })
        }

        if (command == 'limpar') {

            if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
                return message.reply("Você é fraco, lhe falta permissão para Gerenciar Mensagens para usar esse comando");
            }

            const deleteCount = parseInt(args[0], 10);

            if (!deleteCount || deleteCount < 1 || deleteCount >= 100) {
                return message.reply("forneça um número de até 99 mensagens a serem excluidas");
            }

            try {
                if (message.guild != null) {
                    console.log("Delete Messages!")

                    //await message.delete();

                    await message.channel.messages.fetch({ limit: deleteCount }).then(messages => { // Fetches the messages
                        message.channel.bulkDelete(messages).then(messages => {
                            message.channel.send(`${messages.size} mensagens limpas nesse chat solicitado por <@!${message.author.id}>`).then(message => {
                                setTimeout(() => message.delete(), 8000)
                                message.react("👌");
                            });
                        }).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
                    });

                }
            } catch (err) {
                console.log(err);
            }
        }

        if (command == 'avatar') {
            const args = message.content.slice(prefix.length).trim().split('avatar');
            const user = client.users.cache.get(message.author.id)

            const embed = new MessageEmbed()
                .setTitle('WayberCraft!')
                .setAuthor("Info", "https://waybercraft.com.br/images/icon_app.png")
                .setDescription("TESTE")
                .setThumbnail("https://waybercraft.com.br/images/icon_app.png")
                .setImage("https://waybercraft.com.br/images/header.png")
                .setFooter("by fabegalo :D")
                //.addField("Pontos: ", scores[message.author.tag] == undefined ? 0 : scores[message.author.tag].money)
                //.addField("Membros: ", message.guild.memberCount ?? "teste")
                .setColor('ORANGE')
                .setTimestamp()

            message.channel.send({ embeds: [embed] })
        }

        if (command == "ping") { // Check if message is "!ping"
            message.channel.send("Pinging ...") // Placeholder for pinging ... 
                .then((msg) => { // Resolve promise
                    msg.edit("Ping: " + (Date.now() - msg.createdTimestamp)) // Edits message with current timestamp minus timestamp of message
                });
        }

        if (!message.author.bot && command != "pontos") {
            if (!scores[message.author.tag]) {
                scores[message.author.tag] = {
                    money: 0
                };
            }

            scores[message.author.tag].money += 25;
            fs.writeFileSync("../scores.json", JSON.stringify(scores));
        }

        if (command == "pontos") {

            if (!scores[message.author.tag]) {
                scores[message.author.tag] = {
                    money: 0
                };
            }

            message.reply(`Seus pontos é: ${scores[message.author.tag].money}`);

            fs.writeFileSync("../scores.json", JSON.stringify(scores));
        }

        if (command == 'sendto') {
            if (!args.length) {
                return message.channel.send(`Faltam Argumentos , ${message.author}!`);
            } else {
                const user = message.mentions.users.first();
                if (user == undefined) {
                    return message.reply('insira uma menção valida!');
                }
                message.delete({ timeout: 10 });
                const args = message.content.slice(prefix.length).trim().split(`sendTo <@!${user.id}>`);
                user.send(args);
            }
        }

        if (command == 'users') {
            var list = [];
            var count = 0;
            message.guild.members.cache.each(function () {
                guild => list += guild.user.username + ' \n'
                count++;
            });
            message.channel.send('Quantidade: ' + count + '\n' + list);
            message.channel.send(`Online: ${client.guilds.cache.size}`);
        }

        if (command == "toca" || command == "tocar") {
            if (!args.length) {
                return message.channel.send(`Faltam Argumentos , ${message.author}!`);
            }
            else {
                distube.play(message, args.join(" "));
                return;
            }
        }

        if (command == "autoplay") {

            let queue = distube.getQueue(message);

            if (queue == undefined) {
                message.channel.send('Nenhuma Musica Tocando!');
                return;
            }

            let mode = distube.toggleAutoplay(message);
            message.channel.send("Set autoplay mode to `" + (mode ? "On" : "Off") + "`");
        }

        if (["repeat", "loop"].includes(command)) {
            distube.setRepeatMode(message, parseInt(args[0]));
        }

        if (command == "parar") {
            distube.stop(message);
            message.channel.send("Parou a música!");
        }

        if (command == "altura") {
            distube.setVolume(message, parseInt(args[0]));
            message.channel.send("Alterou o volume! para: " + parseInt(args[0]));
        }

        if (command == "pular") {
            distube.skip(message);
        }

        if (command == "lista") {
            let queue = distube.getQueue(message);

            if (queue == undefined) {
                message.channel.send('Lista Vazia!');
                return;
            }

            message.channel.send('Fila atual:\n' + queue.songs.map((song, id) =>
                `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
            ).slice(0, 10).join("\n"));
        }

        if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
            let filter = distube.setFilter(message, command);
            message.channel.send("Filtro de fila atual: " + (filter || "Off"));
        }

        if (command == 'comandos') {
            const user = client.users.cache.get(message.author.id)
            user.send('Olá, eu sou o waynerzito estou aqui para te ajudar \n' + 'Aqui esta a lista de comandos: \n' + ' \n !toca {url} \n !users \n !parar \n !sendTo {@mention} {msg here}');
        }

        if (command == 'filtros') {
            message.channel.send("Filtro de fila atual:: " + ("Off" + '\n Filtros Disponiveis: ' + '\n 3d' + '\n bassboost' + '\n karaoke' + '\n nightcore' + '\n vaporwave'));
        }

    });
}

module.exports = { execCommands };