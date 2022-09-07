import {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, ApplicationCommandOptionType, EmbedBuilder, RequestManager, Embed,
} from 'discord.js';
import undici from 'undici';

export default {
  name: 'util',
  description: '[ ⭐ › Utilities ] › Utils Commands',
  type: 1,
  onlyDev: false,
  onlyManu: false,
  cooldown: 1,
  options: [{
    name: 'avatar',
    description: '[ ⭐ › Utilities ] › Show Avatar',
    type: ApplicationCommandOptionType.Subcommand,
    options: [{
      name: 'user',
      description: '[ 🎈 ] › Select a User',
      type: ApplicationCommandOptionType.User,
      required: false,
    }],
  }, {
    name: 'serverinfo',
    description: '[ ⭐ › Utilities ] › View server information',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'userinfo',
    description: '[ ⭐ › Utilities ] › View a users key information',
    type: ApplicationCommandOptionType.Subcommand,
    options: [{
      name: 'user',
      description: '[ 🎈 ] › Select a User',
      type: ApplicationCommandOptionType.User,
      required: false,
    }],
  }],
  async exec(client, interaction) {
    const GuildDatabase = await client.db.guild.findOne({ _id: interaction.guild.id });

    if (interaction.options.getSubcommand() === 'avatar') {
      try {
        const user = interaction.options.getUser('user') || interaction.user;
        const aP = new EmbedBuilder()
          .setColor(client.color.default)
          .setAuthor({ name: `› ${user.username} › Avatar`, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setDescription(`<:iasdvhdljas1287:1000080647928422461> **› Avatar de [${user.username}](${user.displayAvatarURL({ dynamic: true, size: 2048 })})**`)
          .setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
          .setTimestamp();

        const aE = new EmbedBuilder()
          .setColor(client.color.default)
          .setAuthor({ name: `› ${user.username} › Avatar`, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setDescription(`<:iasdvhdljas1287:1000080647928422461> **› Avatar of [${user.username}](${user.displayAvatarURL({ dynamic: true, size: 2048 })})**`)
          .setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
          .setTimestamp();

        if (GuildDatabase.Lang === 'en') {
          interaction.reply({ embeds: [aE] });
        } else if (GuildDatabase.Lang === 'pt') {
          interaction.reply({ embeds: [aP] });
        }
      } catch (e) {
        console.log(e);
      }
    } else if (interaction.options.getSubcommand() === 'serverinfo') {
      try {
        const Guild = interaction.guild;
        let BoostCount = Guild.premiumSubscriptionCount === 0 ? "Sem Impulsos" : `${Guild.premiumSubscriptionCount} Impulsos ( Nível do Servidor: ${Guild.premiumTier} )`;

       const EmbedSP = new EmbedBuilder().setColor(client.color.default).setThumbnail(Guild.iconURL({ dynamic: true })).setAuthor({ name: `Informações do Servidor - ${Guild.name}`, iconURL: Guild.iconURL({ dynamic: true }) }).addFields({ name: `${client.e.zcoroa}${client.e.z}Dono(a):`, value: `${await client.users.fetch(Guild.ownerId)} | \`${Guild.ownerId}\``, inline: false }, { name: `${client.e.zid}${client.e.z}ID:`, value: `\`${Guild.id}\``, inline: false }, { name: `${client.e.zmembers}${client.e.z}Membros:`, value: `\`${Guild.memberCount.toLocaleString()}\``, inline: false }, { name: `${client.e.zboost}${client.e.z}Impulsos:`, value: `\`${BoostCount}\``, inline: false }, { name: `${client.e.zcalender}${client.e.z}Criado em:`, value: `<t:${~~(Guild.createdTimestamp / 1e3 )}> ( <t:${~~(Guild.createdTimestamp / 1e3 )}:R> )`, inline: false })

       interaction.reply({ embeds: [EmbedSP] })
      } catch (e) {
        console.log(e);
      }
    } else if (interaction.options.getSubcommand() === 'userinfo') {
      try {
        const user1 = interaction.options.getUser('user') || interaction.user;

        let user2;
        if (interaction.options.getMember('user') !== null) {
          user2 = await interaction.options.getMember('user').fetch();
        } else user2 = interaction.member;

        const createContaTime = ~~(client.users.fetch(user1.id).createdTimestamp / 1e3);

        if (interaction.guild.members.cache.get(user1.id) === undefined) {
          const uCE = new EmbedBuilder()
            .setColor(client.color.default)
            .setAuthor({ name: ' › User information ›', iconURL: 'https://cdn.discordapp.com/emojis/1000110472261013594.webp?size=80&quality=lossless' })
            .setDescription(`<:formado:1000109218558386346> **› User Tag ›** \`[ ${user1.tag} ]\`
<:laps:1000121158936580208> **› User ID ›** \`[ ${user1.id} ]\`
<:calender:1000187024948600893> **› Account created in ›** **[ <t:${createContaTime}:f> ]**
`)
            .setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setThumbnail(user1.displayAvatarURL({ dynamic: true }));

          const uCP = new EmbedBuilder()
            .setColor(client.color.default)
            .setAuthor({ name: ' › Informações de Usuário ›', iconURL: 'https://cdn.discordapp.com/emojis/1000110472261013594.webp?size=80&quality=lossless' })
            .setDescription(`<:formado:1000109218558386346> **› Tag de Usuário ›** \`[ ${user1.tag} ]\`
<:laps:1000121158936580208> **› ID do Usuário ›** \`[ ${user1.id} ]\`
<:calender:1000187024948600893> **› Conta criada em ›** **[ <t:${createContaTime}:f> ]**`)
            .setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setThumbnail(user1.displayAvatarURL({ dynamic: true }));

          if (GuildDatabase.Lang === 'en') {
            interaction.reply({ embeds: [uCE] });
          } else if (GuildDatabase.Lang === 'pt') {
            interaction.reply({ embeds: [uCP] });
          }
        } else {
          const pSvr = ~~(interaction.guild.members.cache.get(user2.id).premiumSinceTimestamp / 1e3);
          const joinServerTime = ~~(interaction.guild.members.cache.get(user2.id).joinedTimestamp / 1e3);
          const cargoMember = user2.roles.cache.sort((a, b) => -1 * user2.guild.roles.comparePositions(a, b)).first();
          if (!pSvr) {
            const uSP = new EmbedBuilder()
              .setColor(client.color.default)
              .setAuthor({ name: ' › Informações de Usuário ›', iconURL: 'https://cdn.discordapp.com/emojis/1000110472261013594.webp?size=80&quality=lossless' })
              .setDescription(`<:formado:1000109218558386346> **› Tag de Usuário ›** \`[ ${user1.tag} ]\`
<:laps:1000121158936580208> **› ID do Usuário ›** \`[ ${user1.id} ]\`
<:calender:1000187024948600893> **› Conta criada em ›** **[ <t:${createContaTime}:f> ]**
<:casa:1000187445435965441> **› Entrou no servidor em ›** **[ <t:${joinServerTime}:f> ]**
<:fogeyue:1000188722844803183> **› Maior cargo no servidor ›** **[ ${cargoMember} ]**`)
              .setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
              .setTimestamp()
              .setThumbnail(user1.displayAvatarURL({ dynamic: true }));

            const uSE = new EmbedBuilder()
              .setColor(client.color.default)
              .setAuthor({ name: ' › User information ›', iconURL: 'https://cdn.discordapp.com/emojis/1000110472261013594.webp?size=80&quality=lossless' })
              .setDescription(`<:formado:1000109218558386346> **› User Tag ›** \`[ ${user1.tag} ]\`
<:laps:1000121158936580208> **› User ID ›** \`[ ${user1.id} ]\`
<:calender:1000187024948600893> **› Account created in ›** **[ <t:${createContaTime}:f> ]**
<:casa:1000187445435965441> **› Joined the server in ›** **[ <t:${joinServerTime}:f> ]**
<:fogeyue:1000188722844803183> **› Greater role on the server ›** **[ ${cargoMember} ]**`)
              .setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
              .setTimestamp()
              .setThumbnail(user1.displayAvatarURL({ dynamic: true }));

            if (GuildDatabase.Lang === 'en') {
              interaction.reply({ embeds: [uSE] });
            } else if (GuildDatabase.Lang === 'pt') {
              interaction.reply({ embeds: [uSP] });
            }
          } else {
            const uSP = new EmbedBuilder()
              .setColor(client.color.default)
              .setAuthor({ name: ' › Informações de Usuário ›', iconURL: 'https://cdn.discordapp.com/emojis/1000110472261013594.webp?size=80&quality=lossless' })
              .setDescription(`<:formado:1000109218558386346> **› Tag de Usuário ›** \`[ ${user1.tag} ]\`
<:laps:1000121158936580208> **› ID do Usuário ›** \`[ ${user1.id} ]\`
<:calender:1000187024948600893> **› Conta criada em ›** **[ <t:${createContaTime}:f> ]**
<:casa:1000187445435965441> **› Entrou no servidor em ›** **[ <t:${joinServerTime}:f> ]**
<:fogeyue:1000188722844803183> **› Maior cargo no servidor ›** **[ ${cargoMember} ]**
<:w_boosterSN:954875327862149210> **› Impulsionando desde ›** **[ <t:${pSvr}:f> ]**`)
              .setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
              .setTimestamp()
              .setThumbnail(user1.displayAvatarURL({ dynamic: true }));

            const uSE = new EmbedBuilder()
              .setColor(client.color.default)
              .setAuthor({ name: ' › User information ›', iconURL: 'https://cdn.discordapp.com/emojis/1000110472261013594.webp?size=80&quality=lossless' })
              .setDescription(`<:formado:1000109218558386346> **› User Tag ›** \`[ ${user1.tag} ]\`
<:laps:1000121158936580208> **› User ID ›** \`[ ${user1.id} ]\`
<:calender:1000187024948600893> **› Account created in ›** **[ <t:${createContaTime}:f> ]**
<:casa:1000187445435965441> **› Joined the server in ›** **[ <t:${joinServerTime}:f> ]**
<:fogeyue:1000188722844803183> **› Greater role on the server ›** **[ ${cargoMember} ]**
<:w_boosterSN:954875327862149210> **› Boosting Since ›** **[ <t:${pSvr}:f> ]**`)
              .setFooter({ text: `› ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
              .setTimestamp()
              .setThumbnail(user1.displayAvatarURL({ dynamic: true }));

            if (GuildDatabase.Lang === 'en') {
              interaction.reply({ embeds: [uSE] });
            } else if (GuildDatabase.Lang === 'pt') {
              interaction.reply({ embeds: [uSP] });
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
};
