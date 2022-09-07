import { EmbedBuilder } from 'discord.js';

export default {
  name: 'messageUpdate',
  async exec(client, oldMessage, message) {
    if (!message.guild || message.author.bot) return;

    let GuildDatabase = await client.db.guild.findOne({ _id: message.guild.id });
    if (!GuildDatabase) GuildDatabase = await client.db.guild.create({ _id: message.guild.id });

    if (GuildDatabase.LogsStatus === 'true') {
      if (GuildDatabase.LogsChannel === 'false') return;
      const Channel = await message.guild.channels.fetch(GuildDatabase.LogsChannel.replace('<#', '').replace('>', ''));
      if (message.guild.members.me.permissionsIn(Channel).has('ViewChannel') === false) return;
      if (message.guild.members.me.permissionsIn(Channel).has('SendMessages') === false) return;
        const Embed = new EmbedBuilder().setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) }).setColor(client.color.default).setDescription(`${client.e.zlog}${client.e.z}**${message.author.username}** Editou uma mensagem no Canal: **${message.channel.toString()}**`).addFields({ name: `${client.e.zx}${client.e.z}Antiga mensagem:`, value: `\`\`\`\n${oldMessage.content.slice(0, 999).replaceAll('\`', '')}\n\`\`\``, inline: true, }, { name: `${client.e.zy}${client.e.z}Nova mensagem`, value: `\`\`\`\n${message.content.slice(0, 999).replaceAll('\`', '')}\n\`\`\``, inline: true, }).setFooter({ text: `ID do usuário: ${message.author.id}` }).setTimestamp();
        Channel.send({ embeds: [Embed] });
    }
  },
};