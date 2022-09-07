import {
  EmbedBuilder, codeBlock, ActionRowBuilder, ButtonBuilder,
} from 'discord.js';
import { inspect } from 'node:util';

export default {
  name: 'interactionCreate',
  async exec(client, interaction) {
    if (interaction.type === 2) {
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp,
      } = interaction;
      const {
        guild,
      } = member;

      if (interaction.user.bot) return;
      if (!interaction.member) return;

      let User = await client.db.user.findOne({ _id: interaction.user.id });
      if (!User) User = await client.db.user.create({ _id: interaction.user.id });
      let Guild = await client.db.guild.findOne({ _id: interaction.guild.id });
      if (!Guild) Guild = await client.db.guild.create({ _id: interaction.guild.id });

      const command = client.commands.get(interaction.commandName);

      try {
        const GuildDatabase = await client.db.guild.findOne({ _id: interaction.guild.id });
        const UserDatabase = await client.db.user.findOne({ _id: interaction.user.id });

        if (GuildDatabase.Lang === 'pt' && UserDatabase.BlackList.Status === true) {
          return interaction.reply({
            embeds: [new EmbedBuilder().setColor(client.color.default).setImage(UserDatabase.BlackList.Evidences).setAuthor({ name: ` › ${interaction.user.tag} ›`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
              .setDescription(`<:ban_emoji:1007424063653818378> **› Você foi banido de usar meus comandos.\n<:fogeyue:1000188722844803183> › Motivo › \`[ ${UserDatabase.BlackList.Reason} ]\`\n<:calender:1000187024948600893> › Data › [ <t:${UserDatabase.BlackList.Time}> ]**`)
              .setFooter({ text: ` › Banido por › ${await client.users.fetch(`${UserDatabase.BlackList.AuthorID}`).then((a) => a.tag)} › `, iconURL: `${await client.users.fetch(`${UserDatabase.BlackList.AuthorID}`).then((a) => a.displayAvatarURL({ dynamic: true }))}` })
              .setTimestamp()],
          });
        }
        if (GuildDatabase.Lang === 'en' && UserDatabase.BlackList.Status === true) {
          return interaction.reply({
            embeds: [new EmbedBuilder().setColor(client.color.default).setImage(UserDatabase.BlackList.Evidences).setAuthor({ name: ` › ${interaction.user.tag} ›`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
              .setDescription(`<:ban_emoji:1007424063653818378> **› You have been banned from using my commands.\n<:fogeyue:1000188722844803183> › Reason › \`[ ${UserDatabase.BlackList.Reason} ]\`\n<:calender:1000187024948600893> › Date › [ <t:${UserDatabase.BlackList.Time}> ]**`)
              .setFooter({ text: ` › Banned by › ${await client.users.fetch(`${UserDatabase.BlackList.AuthorID}`).then((a) => a.tag)} › `, iconURL: `${await client.users.fetch(`${UserDatabase.BlackList.AuthorID}`).then((a) => a.displayAvatarURL({ dynamic: true }))}` })
              .setTimestamp()],
          });
        }
      } catch (e) {
        return console.log(e);
      }

      if (client.utils.onCoolDown(interaction, command)) {
        return interaction.reply({
          ephemeral: true,
          content: `${client.utils.ReplaceMessages(client.defMessages.cooldown, {
            command,
            timeLeft: client.utils.onCoolDown(interaction, command),
          })}`,
        });
      }

      client.channels.fetch('1006637133857030214').then((a) => {
        const ExecCommandTime = ~~(Date.now() / 1e3);
        a.send({ content: `> <:dce_dSlash:1000108286881828936> **› Comando \`${command.name}\` executado no Servidor \`${interaction.guild.name} ( ${interaction.guild.id} )\` por \`${interaction.user.tag} ( ${interaction.user.id} )\` [ <t:${ExecCommandTime}> ]**` });
      });

      if (command.onlyManu === true) {
        const UserDatabase = await client.db.user.findOne({ _id: interaction.user.id });
        if (UserDatabase.betaTester === false) return interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder().setColor(client.color.default).setDescription(`${client.e.zx} **›** Comando em Manutenção!`).setAuthor({ name: `${interaction.user.username} › Manutenção`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })] });
      }

      if (command.onlyDev === true && !client.dev.some((id) => id === interaction.user.id)) return interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder().setColor(client.color.default).setDescription(`${client.e.zx} **›** Comando disponível apenas para meu Desenvolvedor.`).setAuthor({ name: `${interaction.user.username} › Sem Permissão`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}` })] });
      await command.exec(client, interaction).catch((e) => console.log(e));
    } else if (interaction.type === 5) {
      if (interaction.customId === 'modal-eval') {
        let res;
        let code;

        try {
          code = interaction.fields.getTextInputValue('code-eval');
          res = await eval(code);
          res = inspect(res, { depth: 0 }).replace(client.token, '[ TOKEN ]').replace(process.env.DATABASE_URL, '[ DATABASE_URL ]');
        } catch (e) {
          res = e.toString();
        }

        const msg = await interaction.reply({ content: `<:labs:1000119867736862882> **› Entrada ›**\n${codeBlock('js', code)}\n<:abc_:1000086599092150363> **› Resultado ›**\n${codeBlock('js', res)}`, components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('eval:delete').setEmoji(client.e.zx).setStyle(2))], fetchReply: true });

        const collector = await msg.createMessageComponentCollector({
          componentType: 2,
        });

        collector.on('collect', async (i) => {
          if (interaction.user.id !== i.user.id) return i.reply({ content: `${client.e.zx} **› ${i.user.username}**, Você não pode usar isso!`, ephemeral: true });
          if (i.customId === 'eval:delete') {
            msg.edit({ content: `${client.e.zx} **› ${i.user.username}**, Eval deletado com sucesso!`, components: [] });
            setTimeout(() => {
              msg.delete();
            }, 750);
          }
        });
      }
    }
  },
};
