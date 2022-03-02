async function jogar(client, message, args) {
    switch (args[0]) {
        case 'youtube':
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
                return message.channel.send(`${invite.code}`);
            });
            break;

        case 'xadrez':
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'chess').then(async invite => {
                return message.channel.send(`${invite.code}`);
            });
            break;

        case 'poker':
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'poker').then(async invite => {
                return message.channel.send(`${invite.code}`);
            });
            break;

        case 'sketchheads':
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'sketchheads').then(async invite => {
                return message.channel.send(`${invite.code}`);
            });
            break;

        default:
            message.reply('Opção Invalida!');
            message.reply('Opções: \n youtube \n xadrez \n poker \n sketchheads \n');
            break;
    }
}

module.exports = { jogar };