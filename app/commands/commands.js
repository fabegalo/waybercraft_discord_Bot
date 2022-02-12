const { MessageEmbed, Permissions } = require('discord.js');

const { getPerfilApi, getLogs } = require("../api/api");

const { distube } = require("../libs/distube");

const { Servers, Embed, About } = require('../config.json');
	
const { Words } = require('../badWords.json');
const Badword = Words.toLowerCase().split(' ');

const { Commands } = require('../commands.json');

const { Messages } = require('../warnMessages.json');


//const fs = require('fs');
//const scores = require("../scores.json");
//typeof scores; // object


async function execCommands(client) {

	client.on('messageCreate', async message => {

		const ServerID = message.guild.id // Identificação automatica de servidor.


		if (ServerID in Servers['ID']) {
			var Prefix = Servers['ID'][ServerID]['Prefix'] // Identificação automatica de prefixo.
		} else {
			var Prefix = "!"
		}


		// Funções para auxiliar nas Embeds.
		function embTitle(Name, Permission) {
			if (typeof(Embed['Title'][Name]) == 'object') {
				var Title = Embed['Title'][Name].join('\n')
					.replaceAll('<ServerPrefix>', Prefix)
					.replaceAll('<SupportPrefix>', Servers["ID"]["705499998057398273"]["Prefix"])
					.replaceAll('<UserID>', message.author.id)
					.replaceAll('<WBServer>', About['Server']['Guild'])
					.replaceAll('<JavaURL>', About['Server']['JavaURL'])
					.replaceAll('<BedrockURL>', About['Server']['BedrockURL'])
					if(Permission != undefined) {
						var Title = Title.replaceAll('<Permission>', Servers["Permissions"][`${Permission}n`]["Name"])
					}
				}

			if (typeof(Embed['Title'][Name]) == 'string') {
				var Title = Embed['Title'][Name]
					.replace("<ServerPrefix>", Prefix)
					.replace("<SupportPrefix>", Servers["ID"]["705499998057398273"]["Prefix"])
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
			if (typeof(Embed['Description'][Name]) == 'object') {
				var Description = Embed['Description'][Name].join('\n')
					.replaceAll('<ServerPrefix>', Prefix)
					.replaceAll("<SupportPrefix>", Servers["ID"]["705499998057398273"]["Prefix"])
					.replaceAll('<UserID>', message.author.id)
					.replaceAll('<WBServer>', About['Server']['Guild'])
					.replaceAll('<JavaURL>', About['Server']['JavaURL'])
					.replaceAll('<BedrockURL>', About['Server']['BedrockURL'])
					if(Permission != undefined) {
						var Description = Description.replaceAll('<Permission>', Servers["Permissions"][`${Permission}n`]["Name"])
					}
				}

			if (typeof(Embed['Description'][Name]) == 'string') {
				var Description = Embed['Description'][Name]
					.replace('<ServerPrefix>', Prefix)
					.replace("<SupportPrefix>", Servers["ID"]["705499998057398273"]["Prefix"])
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
					.replaceAll('<ServerPrefix>', Prefix)
					.replaceAll("<SupportPrefix>", Servers["ID"]["705499998057398273"]["Prefix"])
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
					.replace('<ServerPrefix>', Prefix)
					.replace("<SupportPrefix>", Servers["ID"]["705499998057398273"]["Prefix"])
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
			var Out = Anything.replaceAll('<ServerPrefix>', Prefix)
				.replaceAll("<SupportPrefix>", Servers["ID"]["705499998057398273"]["Prefix"])
				.replaceAll('<UserID>', message.author.id)
				.replaceAll('<WBServer>', About['Server']['Guild'])
				.replaceAll('<JavaURL>', About['Server']['JavaURL'])
				.replaceAll('<BedrockURL>', About['Server']['BedrockURL'])
			return Out;
		}


		// Funções para gerenciar as permissões e cargos.
		async function validaPermissao(message, permission) {
			if (!message.member.permissions.has(permission)) {
				const validPermissionEmbed = new MessageEmbed()
					.setTitle(embTitle("validPermission", permission))
					.setDescription(embDescription("validPermission", permission))
					.setFooter({text: embFooter('UserID'), iconURL: About['Server']['IconURL']})
					.setColor(Embed["Colors"]["Blocked"])
					.setTimestamp()

				message.reply({embeds: [validPermissionEmbed] })
				setTimeout(() => message.delete(), 1800)
				return false;}
			return true;
		}
		
		async function validaPermissaoCargo(message, roleId) {
			//let role = await server.roles.cache.find(role => role.id === roleId);
			if (!await message.member.roles.cache.has(roleId)) {
				const validRoleEmbed = new MessageEmbed()
					.setTitle(embTitle('validRole'))
					.setDescription(embDescription('validRole').replace('<Roles>', roleId))
					.setColor(Embed["Colors"]["Blocked"])
					.setFooter({text: embFooter('UserID'), iconURL: About['Server']['IconURL']})
					.setTimestamp()
				await message.reply({embeds: [validRoleEmbed] })
				setTimeout(() => message.delete(), 1800)
				return false;
			}
			return true;
		}


		// Condição para tratar as mensagens dos usuarios e verificar se há palavrões
		if (!message.author.bot) {
			//isBadWord = false
			for (x = 0; x < Badword.length; x++) {
				if (message.content.toLowerCase().match('\\b' + Badword[x] + '\\b', 'gi') != null) {
					//isBadWord = true
					message.delete()
					message.channel.send(
						Messages[Math.floor(Math.random() * Messages.length)]
						.replaceAll('AuthorID',
							message.author.id));
					break
				}
			}
		}


		//-----------------Seção para tratar comandos dos usuarios------------------------------------------------------------------
		// ?: ↓↓↓
		// One line-break = New Command.
		// Two line-break = New Category.
		// 3 bars (/) = SubCategory


		const args = message.content.slice(Prefix.length).trim().split(' ');
		const command = args.shift().toLowerCase();

		if (!message.content.startsWith(Prefix) || message.author.bot) return;


		// Músicas.
		if (["tocar", "toca", "search", "s"].includes(command)) {
			if (!args.length) {
				return message.channel.send(`Faltam Argumentos , ${message.author}!`);
			}
			else {
				distube.play(message, args.join(" "));
				return;
			}
		}

		if (["parar", "sair", "desconectar", "stop", "quit"].includes(command)) {
			distube.stop(message);
			message.channel.send("Parou a música!");
		}

		if (["pular", "proxima", "next", "skip", "nextSong", "skipSong"].includes(command)) {
			distube.skip(message);
		}

		if (["lista", "musicas", "fila", "queue"].includes(command)) {
			let queue = distube.getQueue(message);

			if (queue == undefined) {
				message.channel.send('Lista Vazia!');
				return;
			}

			message.channel.send('Fila atual:\n' + queue.songs.map((song, id) =>
				`**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
			).slice(0, 10).join("\n"));
		}

		if (["autoplay", "recomendar", "recomendações"].includes(command)) {

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

		/// Avançados.
		if (["repeat", "repetir", "loop"].includes(command)) {
			message.channel.send("Filtro de fila atual:: " + ("Off" + '\n Filtros Disponiveis: ' + '\n 3d' + '\n bassboost' + '\n karaoke' + '\n nightcore' + '\n vaporwave'));
		}

		if (["3d", "bassboost", "echo", "karaoke", "nightcore", "vaporwave"].includes(command)) {
			let filter = distube.setFilter(message, command);
			message.channel.send("Filtro de fila atual: " + (filter || "Off"));
		}


		// Diversos
		if (["perfil", "minecraftinfo", "mineinfo", "miinfo"].includes(command)) {

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

		if (['ping', 'latency', 'temporesposta'].includes(command)) { // Check if message is "!ping"
			message.channel.send("Pinging ...") // Placeholder for pinging ... 
				.then((msg) => { // Resolve promise
					msg.edit("Ping: " + (Date.now() - msg.createdTimestamp)) // Edits message with current timestamp minus timestamp of message
				});
		}

		if (["users", "usuarios", "usuários"].includes(command)) {
			var list = [];
			var count = 0;
			message.guild.members.cache.each(function () {
				guild => list += guild.user.username + ' \n'
				count++;
			});
			message.channel.send('Quantidade: ' + count + '\n' + list);
			message.channel.send(`Online: ${client.guilds.cache.size}`);
		}


		// Moderação
		if (['limpar', 'clear', 'clearchat'].includes(command)) {

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

		if (["altura", "volume"].includes(command)) {
			var hasPermission = await validaPermissao(message, Permissions.FLAGS.MANAGE_CHANNELS);

			if (hasPermission) {
				distube.setVolume(message, parseInt(args[0]));
				message.channel.send("Alterou o volume! para: " + parseInt(args[0]));
			}
		}

		if (["avisos", "aviso", "anuncio", "announcement"].includes(command)) {
			if (message.type == 'REPLY') {
				if (await validaPermissaoCargo(message, Servers['ID'][ServerID]['AnnouncerRole'])) {
					
					var Message = await message.channel.messages.fetch(message.reference.messageId);

					if (args[0] == undefined) { var textChannel = 'Empty' }
						else { var textChannel = args[0]}


					try {
						if (textChannel.startsWith('<#') && textChannel.endsWith('>')){

							var announcePinging = await message.channel.send({ // Pinging...
								embeds: [new MessageEmbed()
									.setDescription(embDescription('Pinging'))
									.setColor(Embed['Colors']['Processing'])]
									}
								);

							var channelID = textChannel.replace(/\D/g, '');
							const channel = client.channels.cache.find(channel => channel.id === channelID);

							setTimeout(() => {
								announcePinging.edit({embeds: [new MessageEmbed()
									.setTitle(embTitle('announce'))
									.setDescription(embDescription('announce')
										.replace('<TextChannel>', textChannel)
										.replace('<Content>', replaceArg(Message.content)))
									.setColor(Embed['Colors']['Done'])
									.setFooter({text: embFooter('AnnouncerID')})
										]
									}
								)
							}, 3400);

							setTimeout(() => {
								channel.send({ embeds: [new MessageEmbed()
									.setTitle(embTitle('announce'))
									.setDescription(replaceArg(Message.content))
									.setColor(Embed['Colors']['Warning'])
									.setFooter({text: embFooter('AnnouncerID')})
									.setTimestamp()
										]
									}
								)
							}, 3800);
							message.delete()

						if (textChannel == 'Empty') {
							var announcePinging = await message.channel.send({
								embeds: [new MessageEmbed()
									.setDescription(embDescription('Pinging'))
									.setColor(Embed['Colors']['Processing'])
									.setTimestamp()]});

							setTimeout(() => {
								announcePinging.edit({embeds: [new MessageEmbed()
								.setTitle(embTitle('announce'))
								.setDescription(embDescription('announceErro'))
								.addField("Erro:", [
									"`Argumentos em falta, é nescessário mencionar um Canal de Texto",
									"para qual a mensagem será enviada!`"].join('\n'))
								.setColor(Embed['Colors']['Erro'])
								.setFooter({text: embFooter('AnnouncerID')})
								.setTimestamp()
										]
									}
								)
							}, 3400);
							message.delete()
						}

						} else {
								var announcePinging = await message.channel.send({
									embeds: [new MessageEmbed()
										.setDescription(embDescription('Ping'))
										.setColor(Embed['Colors']['Processing'])
										.setTimestamp()]});

								setTimeout(() => {
									announcePinging.edit({embeds: [new MessageEmbed()
									.setTitle(embTitle('announce'))
									.setDescription(embDescription('announceErro'))
									.addField("Erro:",
										"`<Channel> Não é um canal válido.`"
										.replace('<Channel>', textChannel))
									.setColor(Embed['Colors']['Erro'])
									.setFooter({text: embFooter('AnnouncerID')})
											]
										}
									)
								}, 3400);
								message.delete()
							}


					} catch(erro) {
						console.log(`AnnounceErro: ${erro}`)
						message.channel.send({ embeds: [new MessageEmbed()
							.setTitle(embTitle('announce'))
							.setDescription(embDescription('announceErro'))
							.addField("Erro:", "<Erro>".replace('<Erro>', erro))
							.setColor(Embed['Colors']['Erro'])
							.setFooter({text: embFooter('AnnouncerID')})]})
						message.delete()

					}
				}
			}
		}

		if (["logs", "log"].includes(command)) {
			if (message.guild != null && message.guild.id == '705499998057398273') {
				var hasPermission = validaPermissao(message, Permissions.FLAGS.MANAGE_CHANNELS)

				if (hasPermission) {
					const user = client.users.cache.get(message.author.id)
					var discordId = user.id;

					var logs = await getLogs(discordId, message.channel);
				}
			}
		}


		// Misc
		if (["comandos", "ajuda", "help"].includes(command)) {
			const user = client.users.cache.get(message.author.id)
			user.send('Olá, eu sou o waynerzito estou aqui para te ajudar \n' + 'Aqui esta a lista de comandos: \n' + ' \n !toca {url} \n !users \n !parar \n !sendTo {@mention} {msg here}');
		}



	});
}

module.exports = { execCommands };

// Other things, commands in tests or that were left out or unusable
		// if(command == 'send'){

		//     if (!args.length) {
		//         return message.channel.send(`Faltam Argumentos , ${message.author}!`);
		//     }else{
		//         const args = message.content.slice(Prefix.length).trim().split('send');
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

		// if (command == 'avatar') {
		//     const args = message.content.slice(Prefix.length).trim().split('avatar');
		//     const user = client.users.cache.get(message.author.id)

		//     const embed = new MessageEmbed()
		//         .setTitle('WayberCraft!')
		//         .setAuthor("Info", "https://waybercraft.com.br/images/icon_app.png")
		//         .setDescription("TESTE")
		//         .setThumbnail("https://waybercraft.com.br/images/icon_app.png")
		//         .setImage("https://waybercraft.com.br/images/header.png")
		//         .setFooter("by fabegalo :D")
		//         //.addField("Pontos: ", scores[message.author.tag] == undefined ? 0 : scores[message.author.tag].money)
		//         //.addField("Membros: ", message.guild.memberCount ?? "teste")
		//         .setColor('ORANGE')
		//         .setTimestamp()

		//     message.channel.send({ embeds: [embed] })
		// }

		// if (command == 'sendto') {
		//     if (!args.length) {
		//         return message.channel.send(`Faltam Argumentos , ${message.author}!`);
		//     } else {
		//         const user = message.mentions.users.first();
		//         if (user == undefined) {
		//             return message.reply('insira uma menção valida!');
		//         }
		//         message.delete({ timeout: 10 });
		//         const args = message.content.slice(Prefix.length).trim().split(`sendTo <@!${user.id}>`);
		//         user.send(args);
		//     }
		// }
//