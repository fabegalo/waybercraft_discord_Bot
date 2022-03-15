// var { prefix } = require('../config.json'); // Removido
var { Servers } = require('../config.json'); // Adicionado

const { MessageEmbed, Permissions } = require('discord.js');

const { getPerfilApi, getLogs } = require("../api/api");

const { validaPermissao, validaPermissaoCargo } = require("../utils/functions");

const { Embed, About } = require('../sources/embed_info.json');

//const fs = require('fs');
//const scores = require("../scores.json");
//typeof scores; // object

const { badword } = require('../sources/bad_words.json');
const words = badword.split(' ');

const { distube } = require("../libs/distube");

const { messages } = require('../sources/bad_message.json');

const { DiscordTogether } = require('discord-together');
const { jogar } = require('../libs/games');


async function execCommands(client) {

    client.discordTogether = new DiscordTogether(client);

    client.on('messageCreate', async message => {

        //message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);

        // if (message.guild != null && message.guild.id == '354099395903488001') {
        //     prefix = ':>';
        // } else {
        //     prefix = '!';
        // }

        if (message.guild.id in Servers) {
            var prefix = Servers[message.guild.id]['Prefix']
        } else {
            var prefix = "!"
        }


        // Funções para auxiliar nas Embeds.
        function embTitle(Name, Permission) {
            if (typeof(Embed[Name]['Title']) == 'object') {
                var Title = Embed[Name]['Title'].join('\n')
                    .replaceAll('<ServerPrefix>', prefix)
                    .replaceAll('<SupportPrefix>', Servers["705499998057398273"]["Prefix"])
                    .replaceAll('<UserID>', message.author.id)
                    .replaceAll('<WBServer>', About['Server']['Guild'])
                    .replaceAll('<JavaURL>', About['Server']['JavaURL'])
                    .replaceAll('<BedrockURL>', About['Server']['BedrockURL'])
                    if(Permission != undefined) {
                        var Title = Title.replaceAll('<Permission>', Servers["Permissions"][`${Permission}n`]["Name"])
                    }
                }

            if (typeof(Embed[Name]['Title']) == 'string') {
                var Title = Embed[Name]['Title']
                    .replace("<ServerPrefix>", prefix)
                    .replace("<SupportPrefix>", Servers["705499998057398273"]["Prefix"])
                    .replace('<UserID>', message.author.id)
                    .replace('<WBServer>', About['Server']['Guild'])
                    .replace('<JavaURL>', About['Server']['JavaURL'])
                    .replace('<BedrockURL>', About['Server']['BedrockURL'])
                    if(Permission != undefined) {
                        var Title = Title.replace('<Permission>', Servers["Permissions"][`${Permission}n`]["Name"])
                    }
                }
            return Title;
        }

        function embDescription(Name, Permission) {
            if (typeof(Embed[Name]['Description']) == 'object') {
                var Description = Embed[Name]['Description'].join('\n')
                    .replaceAll('<ServerPrefix>', prefix)
                    .replaceAll("<SupportPrefix>", Servers["705499998057398273"]["Prefix"])
                    .replaceAll('<UserID>', message.author.id)
                    .replaceAll('<WBServer>', About['Server']['Guild'])
                    .replaceAll('<JavaURL>', About['Server']['JavaURL'])
                    .replaceAll('<BedrockURL>', About['Server']['BedrockURL'])
                    if(Permission != undefined) {
                        var Description = Description.replaceAll('<Permission>', Servers["Permissions"][`${Permission}n`]["Name"])
                    }
                }

            if (typeof(Embed[Name]['Description']) == 'string') {
                var Description = Embed[Name]['Description']
                    .replace('<ServerPrefix>', prefix)
                    .replace("<SupportPrefix>", Servers["705499998057398273"]["Prefix"])
                    .replace('<UserID>', message.author.id)
                    .replace('<WBServer>', About['Server']['Guild'])
                    .replace('<JavaURL>', About['Server']['JavaURL'])
                    .replace('<BedrockURL>', About['Server']['BedrockURL'])
                    if(Permission != undefined) {
                        var Description = Description.replace('<Permission>', Servers["Permissions"][`${Permission}n`]["Name"])
                    }
                }
            return Description;
        }

        function embFooter(Name, Permission) {
            if (typeof(Embed['Footer'][Name]) == 'object') {
                var Footer = Embed['Footer'][Name].join('\n')
                    .replaceAll('<ServerPrefix>', prefix)
                    .replaceAll("<SupportPrefix>", Servers["705499998057398273"]["Prefix"])
                    .replaceAll('<Powered>', About['Powered'])
                    .replaceAll('<UserID>', message.author.id)
                    .replaceAll('<WBServer>', About['Server']['Guild'])
                    .replaceAll('<JavaURL>', About['Server']['JavaURL'])
                    .replaceAll('<BedrockURL>', About['Server']['BedrockURL'])
                    .replaceAll('<AnnouncerID>', message.author.username)
                    if(Permission != undefined) {
                        var Footer = Footer.replaceAll('<Permission>', Servers["Permissions"][`${Permission}n`]["Name"])
                    }
                }

            if (typeof(Embed['Footer'][Name]) == 'string') {
                var Footer = Embed['Footer'][Name]
                    .replace('<ServerPrefix>', prefix)
                    .replace("<SupportPrefix>", Servers["705499998057398273"]["Prefix"])
                    .replace('<Powered>', About['Powered'])
                    .replace('<UserID>', message.author.id)
                    .replace('<WBServer>', About['Server']['Guild'])
                    .replace('<JavaURL>', About['Server']['JavaURL'])
                    .replace('<BedrockURL>', About['Server']['BedrockURL'])
                    .replace('<AnnouncerID>', message.author.username)
                    if(Permission != undefined) {
                        var Footer = Footer.replace('<Permission>', Servers["Permissions"][`${Permission}n`]["Name"])
                    }
                }
            return Footer;
        }

        function replaceArg(Anything) {
            var Out = Anything.replaceAll('<ServerPrefix>', prefix)
                .replaceAll("<SupportPrefix>", Servers["705499998057398273"]["Prefix"])
                .replaceAll('<UserID>', message.author.id)
                .replaceAll('<WBServer>', About['Server']['Guild'])
                .replaceAll('<JavaURL>', About['Server']['JavaURL'])
                .replaceAll('<BedrockURL>', About['Server']['BedrockURL'])
            return Out;
        }


        if (!message.author.bot) {
            for (x = 0; x < words.length; x++) {
                if (message.content.match('\\b' + words[x] + '\\b', 'gi') != null) {
                    message.delete({ timeout: 10 });
                    //message.channel.send(`O: ${message.author.username}\n <@!${message.author.id}> meça suas palavras parça`);

                    message.channel.send(messages[Math.floor(Math.random() * messages.length)].replaceAll('AuthorID', message.author.id));
                    break;
                }
            }
        }

        if (message.mentions.has(client.user.id)) {
            if (message.type == 'REPLY' && message.member.id != client.user.id && message.content.includes(`<@!${client.user.id}>`)) {

                var roleId = '829061318371573772';
                if (await validaPermissaoCargo(message, roleId)) {
                    var msg = await message.channel.messages.fetch(message.reference.messageId);

                    var textChannel = message.content.slice(prefix.length).trim().split(' ')[1];

                    if (textChannel == undefined) {
                        message.reply('Canal de texto Não encontrado !');
                    } else {
                        var channelID = textChannel.replace(/\D/g, '');
                        const channel = client.channels.cache.find(channel => channel.id === channelID);
                        channel.send(msg.content);
                        message.channel.send('Mensagem enviada com sucesso para canal ' + textChannel + ' ! : ```' + msg.content + '``` ');
                    }
                }
            }
        }

        //-----------------Seção para tratar comandos dos usuarios------------------------------------------------------------------
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();



        // //Se Mensagem for do servidor WayberCraft
        // if (message.guild != null && message.guild.id == '705499998057398273') {
        //     // if(message.content.match("^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.(?!$)|$)){4}$")){
        //     //     message.delete();
        //     //     message.channel.send(`<@!${message.author.id}> Você não pode enviar convites de outros servidores aqui!`);
        //     // }
        //     if (command == 'logs') {
        //         var hasPermission = validaPermissao(message, Permissions.FLAGS.MANAGE_CHANNELS)

        //         if (hasPermission) {
        //             const user = client.users.cache.get(message.author.id)
        //             var discordId = user.id;

        //             var logs = await getLogs(discordId, message.channel);
        //         }
        //     }
        // }



        // Music.
        if (command == "toca" || command == "tocar") {
            if (!args.length) {
                return message.channel.send(`Faltam Argumentos , ${message.author}!`);
            }
            else {
                distube.play(message.member.voice.channel, args.join(' '), {
                    message,
                    textChannel: message.channel,
                    member: message.member,
                });
                return;
            }
        }

        if (command == "parar") {
            distube.stop(message);
            message.channel.send("Parou a música!");
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

        if (command == "autoplay") {

            let queue = distube.getQueue(message);

            if (queue == undefined) {
                message.channel.send('Nenhuma Musica Tocando!');
                return;
            }

            let mode = distube.toggleAutoplay(message);
            message.channel.send("Set autoplay mode to `" + (mode ? "On" : "Off") + "`");
        }


        // Avançados.
        if (["repeat", "loop"].includes(command)) {
            distube.setRepeatMode(message, parseInt(args[0]));
        }

        if (command == 'filtros') {
            message.channel.send("Filtro de fila atual:: " + ("Off" + '\n Filtros Disponiveis: ' + '\n 3d' + '\n bassboost' + '\n karaoke' + '\n nightcore' + '\n vaporwave'));
        }

        if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
            let filter = distube.setFilter(message, command);
            message.channel.send("Filtro de fila atual: " + (filter || "Off"));
        }


        // Diversos.
        if (command == 'perfil') {

            var infoMsg

            var discordId;

            if (args.length > 0) {

                var hasPermission = await validaPermissao(message, Permissions.FLAGS.MANAGE_CHANNELS);

                if (hasPermission) {
                    const user = message.mentions.users.first();
                    if (user == undefined) {
                        return message.reply('insira uma menção valida!');
                    }
                    discordId = user.id;
                } else {
                    const user = client.users.cache.get(message.author.id)
                    discordId = user.id;
                }

            } else {
                const user = client.users.cache.get(message.author.id)
                discordId = user.id;
            }

            await message.channel.send("Procurando ...") // Placeholder for pinging ... 
                .then((msg) => { // Resolve promise
                    infoMsg = msg;
                });

            try {
                var profile = await getPerfilApi(discordId);
            } catch (error) {
                console.log(error);
                message.reply("Ocorreu um erro contate o suporte!");
                infoMsg.delete();
                return;
            }

            if (profile == false) {
                message.reply("Conta Discord Não Vinculada!, Vincule sua conta em: https://waybercraft.com.br/vincular_conta_minecraft");
                infoMsg.delete();
                return;
            }

            infoMsg.edit('Perfil Encontrado!');

            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            const profileEmbed = {
                color: 0x0099ff,
                title: 'Minecraft Perfil',
                url: 'https://www.waybercraft.com.br',
                author: {
                    name: profile.authme.realname,
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

        if (command == 'jogar') {
            message.reply('Este comando só funciona para DESKTOP!');

            if (message.member.voice.channel) {
                await jogar(client, message, args);
            } else {
                message.reply('Precisa estar em um canal de voz para executar esse comando!');
            };
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


        // Moderação.
        if (command == 'limpar') {

            if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
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

        if (command == "altura") {
            var hasPermission = await validaPermissao(message, Permissions.FLAGS.MANAGE_CHANNELS);

            if (hasPermission) {
                distube.setVolume(message, parseInt(args[0]));
                message.channel.send("Alterou o volume! para: " + parseInt(args[0]));
            }
        }

        if (command == 'nomembers') {
            var hasPermission = await validaPermissao(message, Permissions.FLAGS.MANAGE_CHANNELS);

            if (hasPermission) {
                server = await client.guilds.cache.get(process.env.GUILD_ID);
                let users = await server.members.fetch();

                var list = "";

                users.map((user, index) => {
                    if (!user.roles.cache.has("829061785084493834")) {
                        list = list + `<@${user.user.id}>` + "\n"
                    }
                })

                message.reply(list);
            }
        }

        if (["logs"].includes(command)) {
            if (message.guild != null && message.guild.id == About["Server"]["GuildID"]) {
                var hasPermission = validaPermissao(message, Permissions.FLAGS.MANAGE_CHANNELS)
                if (hasPermission) {
                    const user = client.users.cache.get(message.author.id)
                    var discordId = user.id;

                    var logs = await getLogs(discordId, message.channel);
                }
            }
        }


        // Misc.
        if (command == 'comandos') {
            const user = client.users.cache.get(message.author.id)
            user.send('Olá, eu sou o waynerzito estou aqui para te ajudar \n' + 'Aqui esta a lista de comandos: \n' + ' \n !toca {url} \n !users \n !parar \n !sendTo {@mention} {msg here}');
        }



////////// Comandos desabilitados.
        // if (command == 'testembed') {
        //     var PrimeiraEmbed = new MessageEmbed()
        //         .setDescription(embDescription('PrimeiraEmbed'))
        //         .setTitle(embTitle('PrimeiraEmbed'))
        //         .setFooter(embFooter('Default')) // Mais opções em "Footer" que está em embed_info.json
        //     message.channel.send({embeds: [PrimeiraEmbed]})
        // }


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


        // if (command == 'nickname') {
        //     let Guild = await client.guilds.cache.get(args[0]);
        //     if(!Guild){ return(false) } //Can't leave guild
        //     return Guild.leave();
        // }


        // if (!message.author.bot && command != "pontos") {
        //     if (!scores[message.author.tag]) {
        //         scores[message.author.tag] = {
        //             money: 0
        //         };
        //     }

        //     scores[message.author.tag].money += 25;
        //     fs.writeFileSync("../scores.json", JSON.stringify(scores));
        // }


        // if (command == "pontos") {

        //     if (!scores[message.author.tag]) {
        //         scores[message.author.tag] = {
        //             money: 0
        //         };
        //     }

        //     message.reply(`Seus pontos é: ${scores[message.author.tag].money}`);

        //     fs.writeFileSync("../scores.json", JSON.stringify(scores));
        // }


    });
}

module.exports = { execCommands };