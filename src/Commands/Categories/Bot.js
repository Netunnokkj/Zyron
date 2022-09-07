import {
  EmbedBuilder, ApplicationCommandOptionType, version, ActionRowBuilder, ButtonBuilder, ButtonStyle,
} from 'discord.js';

export default {
  name: 'bot',
  description: '[ 💦 › Information ] › Zyron Information Commands',
  type: 1,
  onlyDev: false,
  onlyManu: false,
  cooldown: 10,
  options: [{
    name: 'info',
    description: '[ 💦 › Information ] › See my information',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'help',
    description: '[ 💦 › Information ] › Command List',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'invite',
    description: '[ 💦 › Information ] › Call me to your server!',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'ping',
    description: '[ 💦 › Information ] › See my ping',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'shards',
    description: '[ 💦 › Information ] › See my Shards information',
    type: ApplicationCommandOptionType.Subcommand,
  }],
  async exec(client, interaction) {
    const GuildDatabase = await client.db.guild.findOne({ _id: interaction.guild.id });

    if (interaction.options.getSubcommand() === 'info') {
      try {
        const tempOn = ~~(client.readyTimestamp / 1e3);
        const BotInfoRow = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Invite').setStyle(ButtonStyle.Link).setURL('https://discord.com/api/oauth2/authorize?client_id=694901042986614805&permissions=2080374975&scope=bot%20applications.commands'),).addComponents(new ButtonBuilder().setLabel('Support').setStyle(ButtonStyle.Link).setURL('https://discord.gg/fXYYed8mh5'), );
const bP = new EmbedBuilder()
.setColor(client.color.default)
.setAuthor({ name: '› Minhas Informações', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
.setDescription(`
> <:coracao:1012433833209110588> **›** Olá, me chamo **${client.user.username}**, um bot feito em <:dce_dSlash:1000108286881828936> **› Slash Commands**. Criado <t:1647797618:R> por **${await client.users.fetch('823635200101580851').then((a) => a.tag)}**. Atualmente estou Gerenciando **${client.guilds.cache.size.toLocaleString()}** Servidores & **${client.guilds.cache.map((g) => g.memberCount).reduce((b, a) => b + a).toLocaleString()}** Usuários!\n\n<:quimic:1012435575963386026> **› Informações Adicionais ›**\n\n> Fui desenvolvido em **JavaScript** usando **NodeJS**.\n> Estou online <t:${tempOn}:R> na **Amazon Web Services**.\n> Memoria Usada **›** **${~~(process.memoryUsage().rss / 1024 / 1024)} MB**`)
.setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
.setTimestamp();

const bE = new EmbedBuilder()
.setColor(client.color.default)
.setAuthor({ name: '› My informations', iconURL: 'https://cdn.discordapp.com/attachments/980478565088903231/1012433829895618690/unknown.png?size=4096' })
.setDescription(`> <:olaa:1012434113153732640> **›** Hello, my name is **${client.user.username}** and I'm made in <:dce_dSlash:1000108286881828936> **› Slash Commands**\n
> <:coroa:1012434255114141836> **›** Creator **›** **[ ${await client.users.fetch('823635200101580851').then((a) => a.tag)} ]**
> <:servers:1012435055970365440> **›** Servers **›** **[ ${client.guilds.cache.size.toLocaleString()} ]**
> <:onibus:1012434489865154610> **›** Users **›** **[ ${client.guilds.cache.map((g) => g.memberCount).reduce((b, a) => b + a).toLocaleString()} ]**
> <:ampulheta:1010585643367288953> **›** Uptime **›** **[ <t:${tempOn}:R> ]**\n
<:quimic:1012435575963386026> **› Additional ›**\n
> <:lapis:1012435713725304894> **›** Library **›** **[ Discord.js ( ${version} ) ]**
> <:database:1012437384039780382> **›** Database **›** **[ MongoDB ]**
> <:globo:1012435199264567366> **›** VPS **›** **[ Amazon Web Services ]**
> <:calender:1012437650445176863> **›** Creation Date **›** **[ <t:1647797618:R> ]**
`)
.setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
.setTimestamp();

        if (GuildDatabase.Lang === 'en') {
          interaction.reply({ embeds: [bE], components: [BotInfoRow], });
        } else if (GuildDatabase.Lang === 'pt') {
          interaction.reply({ embeds: [bP], components: [BotInfoRow], });
        }
      } catch (e) {
        console.log(e);
      }
    } else if (interaction.options.getSubcommand() === 'help') {
      try {
const hP = new EmbedBuilder()
.setColor(client.color.default)
.setAuthor({ name: '› Zyron - Painel de Ajuda', iconURL: 'https://cdn.discordapp.com/attachments/980478565088903231/1012433829895618690/unknown.png?size=4096' })
.setDescription(`> <:olaa:1012434113153732640> **›** Olá, eu sou o \`${client.user.tag}\`! Aqui está a lista dos meus comandos.\n
<:onibus:1012434489865154610> **› Bot [ 05 ] ›**
**</bot help:1010350650737037312>, </bot invite:1010350650737037312>, </bot ping:1010350650737037312>, </bot info:1010350650737037312>, </bot shards:1010350650737037312>**

<:ferramenta:1013492684746412103> **› Configuração [ 01 ] ›**
**</config:1015399346470125658>**

<:porcorico:1012508646472695908> **› Economia [ 06 ] ›**
**</economy profile:1015399346470125660>, </economy daily:1015399346470125660>, </economy rank:1015399346470125660>, </economy jobs:1015399346470125660>, </economy dismiss:1015399346470125660>, </economy times:1015399346470125660>**

<:lapis:1012435713725304894> **› Utilidades [ 3 ] ›**
**</util avatar:1015399346470125661>, </util userinfo:1015399346470125661>, </util serverinfo:1015399346470125661>**
`)
.setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
.setTimestamp();

const hE = new EmbedBuilder()
.setColor(client.color.default)
.setAuthor({ name: '› Zyron - Help Panel', iconURL: 'https://cdn.discordapp.com/attachments/980478565088903231/1012433829895618690/unknown.png?size=4096' })
.setDescription(`> <:olaa:1012434113153732640> **›** Hello i'm the \`${client.user.tag}\`! Here is the list of my commands.\n
<:onibus:1012434489865154610> **› Bot [ 05 ] ›**
**</bot help:1010350650737037312>, </bot invite:1010350650737037312>, </bot ping:1010350650737037312>, </bot info:1010350650737037312>, </bot shards:1010350650737037312>**

<:ferramenta:1013492684746412103> **› Configuration [ 01 ] ›**
**</config:1015399346470125658>**

<:porcorico:1012508646472695908> **› Economy [ 06 ] ›**
**</economy profile:1015399346470125660>, </economy daily:1015399346470125660>, </economy rank:1015399346470125660>, </economy jobs:1015399346470125660>, </economy dismiss:1015399346470125660>, </economy times:1015399346470125660>**

<:lapis:1012435713725304894> **› Utilities [ 03 ] ›**
**</util avatar:1015399346470125661>, </util userinfo:1015399346470125661>, </util serverinfo:1015399346470125661>**
`)
.setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
.setTimestamp();

        if (GuildDatabase.Lang === 'en') {
          interaction.reply({ embeds: [hE] });
        } else if (GuildDatabase.Lang === 'pt') {
          interaction.reply({ embeds: [hP] });
        }
      } catch (e) {
        return console.log(e);
      }
    } else if (interaction.options.getSubcommand() === 'invite') {
      try {
        const InviteRow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Invite ( Perm++ )')
              .setStyle(ButtonStyle.Link)
              .setURL('https://discord.com/api/oauth2/authorize?client_id=694901042986614805&permissions=2080374975&scope=bot%20applications.commands'),
          )
          .addComponents(
            new ButtonBuilder()
              .setLabel('Invite ( Perm-- )')
              .setStyle(ButtonStyle.Link)
              .setURL('https://discord.com/api/oauth2/authorize?client_id=694901042986614805&permissions=0&scope=bot%20applications.commands'),
          )
          .addComponents(
            new ButtonBuilder()
              .setLabel('Support')
              .setStyle(ButtonStyle.Link)
              .setURL('https://discord.gg/fXYYed8mh5'),
          );

        if (GuildDatabase.Lang === 'en') {
          interaction.reply({ content: '<:aviaodepapel:1012505299413913710> **› Invitation and Support**\n> Invite me to your Server or join my Support server by interacting with the buttons.', components: [InviteRow] });
        } else if (GuildDatabase.Lang === 'pt') {
          interaction.reply({ content: '<:aviaodepapel:1012505299413913710> **› Convite & Suporte**\n> Me convide ao seu Servidor ou entre no meu servidor de Suporte interagindo com os botões.', components: [InviteRow] });
        }
      } catch (e) {
        console.log(e);
      }
    } else if (interaction.options.getSubcommand() === 'ping') {
      async function pMongoose() {
        const PingStart = process.hrtime();
        await client.db.guild.findOne({ _id: interaction.guild.id });
        const PingStop = process.hrtime(PingStart);
        const pMongoose = Math.round(((PingStop[0] * 1e9) + PingStop[1]) / 1e6);
        return pMongoose;
      }

      try {
        const tempOn = ~~(client.readyTimestamp / 1e3);

const pP = new EmbedBuilder()
.setColor(client.color.default)
.setAuthor({ name: `› ${client.user.username} › Latências`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
.setDescription(`
> <:cometa:1012499603272257596> **› Shard ›** \`[ ${interaction.guild.shard.id}/${client.ws.shards.size} ]\`
> <:foguete:1012499787779678248> **› WebSocket Ping ›** \`[ ${client.ws.ping}ms ]\`
> <:database:1012437384039780382> **› MongoDB ›** \`[ ${await pMongoose()}ms ]\`
> <:ampulheta:1010585643367288953> **› Uptime ›** **[ <t:${tempOn}:R> ]**`)
.setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
.setTimestamp()
.setThumbnail('https://cdn.discordapp.com/attachments/980478565088903231/1012502202050428928/unknown.png?size=4096');

const pE = new EmbedBuilder()
.setColor(client.color.default)
.setAuthor({ name: `› ${client.user.username} › Latencies`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
.setDescription(`
> <:cometa:1012499603272257596> **› Shard ›** \`[ ${interaction.guild.shard.id}/${client.ws.shards.size} ]\`
> <:foguete:1012499787779678248> **› WebSocket Ping ›** \`[ ${client.ws.ping}ms ]\`
> <:database:1012437384039780382> **› MongoDB ›** \`[ ${await pMongoose()}ms ]\`
> <:ampulheta:1010585643367288953> **› Uptime ›** **[ <t:${tempOn}:R> ]**`)
.setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
.setTimestamp()
.setThumbnail('https://cdn.discordapp.com/attachments/980478565088903231/1012502202050428928/unknown.png?size=4096');

        if (GuildDatabase.Lang === 'en') {
          interaction.reply({ embeds: [pE] });
        } else if (GuildDatabase.Lang === 'pt') {
          interaction.reply({ embeds: [pP] });
        }
      } catch (e) {
        console.log(String(e.stack).bgRed);
      }
    } else if (interaction.options.getSubcommand() === 'shards') {
      try {
        const ShardsMap = client.ws.shards.map((shard) => `Shard › ${shard.id} ( Guilds › ${client.guilds.cache.filter((y) => y.shardId === shard.id).size}, Ping › ${shard.ping}ms )`);

        interaction.reply({ content: `${interaction.user}\n\`\`\`${ShardsMap.join('\n')}\`\`\``, });
      } catch (e) {

      }
    }
  },
};
