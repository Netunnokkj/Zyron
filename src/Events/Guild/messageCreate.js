import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export default {
  name: 'messageCreate',
  async exec(client, message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (message.content == `<@${client.user.id}>`) {
      let GuildDatabase = await client.db.guild.findOne({ _id: message.guild.id });
      if (!GuildDatabase) GuildDatabase = await client.db.guild.create({ _id: message.guild.id });
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel('Invite').setStyle(ButtonStyle.Link).setURL('https://discord.com/api/oauth2/authorize?client_id=694901042986614805&permissions=0&scope=bot%20applications.commands'),
      );

      if (GuildDatabase.Lang === 'pt') {
        message.reply({ content: `<:hello_:1000107792734105742> **›** Olá, eu sou o **${client.user.username}**! Sou feito em <:dce_dSlash:1000108286881828936> **› Slash Commands**\n> Use </bot help:1010350650737037312> para ver meus comandos!`, components: [row] });
      } else if (GuildDatabase.Lang === 'en') {
        message.reply({ content: `<:hello_:1000107792734105742> **›** Hello i'm the **${client.user.username}**! I'm made in <:dce_dSlash:1000108286881828936> **› Slash Commands**\n> Use </bot help:1010350650737037312> to see my commands!`, components: [row] });
      }
    }

    if (message.channel.id === '786272202034380840') {
      message = await message.fetch();
      if (message.author.id !== '950548195056963584') return;
      const zy = message.embeds[0].data.title;
      const check = message.embeds[0].data.footer.text.split('_');
      let emj;
      if (check[1] == 1) emj = '<:likes:1004491426714890342>';
      if (check[1] == 2) emj = '<:diamante:1004491460776820856>';

      if (zy.includes(client.user.tag)) {
        let UserFetch = await client.users.fetch(check[0]);
        let GuildDatabase = await client.db.guild.findOne({ _id: message.guild.id });
        let UserDatabase = await client.db.economy.findOne({ _id: UserFetch.id });
        if (!UserDatabase) UserDatabase = await client.db.economy.create({ _id: UserFetch.id });
        await client.db.economy.findOneAndUpdate({ _id: UserFetch.id }, { $set: { name: `${UserFetch.username}` } });

        client.channels.fetch('1004489466867613786').then((x) => {
          x.send({ embeds: [new EmbedBuilder().setAuthor({ name: ` › ${UserFetch.tag} › `, iconURL: UserFetch.displayAvatarURL({ dynamic: true }) }).setColor(client.color.default).setDescription(`${emj} **›** **${UserFetch.tag}** votou em mim na **[Dev. Center](https://discord.gg/5rPdK9jNhJ)** e agora possuo ${check[2]} lá!`)] });
        });
        if (GuildDatabase.Lang === 'pt') {
          UserFetch.send({ content: `> <:olaa:1012434113153732640> **›** Olá ${UserFetch}, muito obrigado por ter votado em mim na **Dev. Center**! Com isso, você recebeu:\n> **[ 3,500 ] Cristais**\n> **[ 3 ] Flores de Neve**` }).catch(() => {});
        } else if (GuildDatabase.Lang === 'en') {
          UserFetch.send({ content: `> <:olaa:1012434113153732640> **›** Hello ${UserFetch}, thank you so much for voting for me on **Dev. Center**! With that, you received:\n> **[ 3,500 ] Crystals**\n> **[ 3 ] Snow Flowers**` }).catch(() => {});
        }
        UserDatabase.Crystals = UserDatabase.Crystals + 3500;
        UserDatabase.Flowers = UserDatabase.Flowers + 3;
        UserDatabase.save()
      }
    }

  },
};
