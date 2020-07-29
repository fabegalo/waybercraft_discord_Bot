const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const exampleEmbed = new Discord.MessageEmbed().setTitle('Some title');
const { prefix, token } = require('./config.json');

var calaboca = false;

client.login(process.env.token);
//client.login('NzM3NTQxNzkwNTQ2MTMzMDAy.Xx-3UQ.LOmxC8yXR9W7MPSKL9xvNrGOqHM');

client.once('ready', () => {
	console.log('Ready!');
});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.on('message', message => {

    //message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    if(calaboca){
        const user = client.users.cache.get(message.author.id);
        user.send('Fica queito MEU !!!');
    }
    
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if(command == 'calaboca'){
        if(calaboca == true){
            calaboca = false;
        }else{
            calaboca = true;
        }
        console.log(calaboca);
    }

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

    if(command == 'users'){
        var list = [];
        var count = 0;
        message.guild.members.cache.each(function(){
            //guild => list += guild.user.username + ' \n'
            count++;
        });

        message.channel.send('Quantidade: ' + count + '\n' + list);
    }

    if(command == 'toca'){
        if (!args.length) {
            return message.channel.send(`Faltam Argumentos , ${message.author}!`);
        }
        else {
            if (message.channel.type !== 'text') return;

            const args = message.content.slice(prefix.length).trim().split(' ');
            const command = args.shift().toLowerCase();
    
            const voiceChannel = message.member.voice.channel;
    
            if (!voiceChannel) {
                return message.reply('please join a voice channel first!');
            }
    
            voiceChannel.join().then(connection => {
                const stream = ytdl(args[0], { filter: 'audioonly' });
                const dispatcher = connection.play(stream);
    
                dispatcher.on('finish', () => voiceChannel.leave());
            });
        }
    }

    if(command == 'comandos'){
        const user = client.users.cache.get(message.author.id);
        user.send('Olá, eu sou o waynerzito estou aqui para te ajudar \n'+'Aqui esta a lista de comandos: \n'+ '!players \n !toca {url} \n !users \n !calaboca');
    }
});