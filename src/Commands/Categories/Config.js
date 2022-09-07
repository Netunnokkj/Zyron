import { EmbedBuilder, ButtonBuilder, PermissionsBitField, ActionRowBuilder, SelectMenuBuilder, Guild } from 'discord.js';

export default {
  name: 'config',
  description: '[ 🧰 › Settings ] › Configuration',
  type: 1,
  onlyDev: false,
  onlyManu: false,
  cooldown: 10,
  options: [],
  async exec(client, interaction) {
    try {
      let GuildDatabase = await client.db.guild.findOne({ _id: interaction.guild.id });
      if (!GuildDatabase) GuildDatabase = await client.db.guild.create({ _id: interaction.guild.id });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
          if (GuildDatabase.Lang === 'pt') {
            return interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Sem Permissão', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zx} **›** Você não possui a permissão de Gerenciar Servidor.`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })] });
          } if (GuildDatabase.Lang === 'en') {
            return interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Without Permission', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zx} **›** You do not have Manage Server permission.`).setFooter({ text: `› By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })] });
          }
        } else if (GuildDatabase.Lang === 'pt') {
          const Embed1 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configurações', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zconfig}${client.e.z}**Opções:**\n> **${client.e.zglob}${client.e.z}Idioma do Servidor**\n> **${client.e.zlog}${client.e.z}Sistema de Logs**`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          const ConfigMenu = new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId('config:menu').setPlaceholder('› Selecione aqui').addOptions([{ label: '› Idioma do Servidor', value: 'config:menu:language', emoji: client.e.zglob }, { label: '› Sistema de Logs', value: 'config:menu:logs', emoji: client.e.zlog }]));
          const MensagemConfig = await interaction.reply({ embeds: [Embed1], components: [ConfigMenu], fetchReply: true });

          const CollectorMenu = await MensagemConfig.createMessageComponentCollector({
            componentType: 3,
          });

          CollectorMenu.on('collect', async (i) => {
            if (interaction.user.id !== i.user.id) return;
            if (i.customId === 'config:menu') {
              if (i.values.toString() === 'config:menu:language') {
                  const Embed2 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configurar Idioma', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zglob}${client.e.z}Você entrou no modo de configuração de Idioma! Use os botões para continuar.\n${client.e.zinv}${client.e.z}**Idiomas Disponíveis:**\n> **${client.e.zpt}${client.e.z}Portuguese (pt_BR)**\n> **${client.e.zen}${client.e.z}English (en_US)**`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                  i.deferUpdate();

                  const MensagemConfigLang = await MensagemConfig.edit({ embeds: [Embed2], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('config:button:lang:pt').setEmoji(client.e.zpt).setStyle(2)).addComponents(new ButtonBuilder().setCustomId('config:button:lang:en').setEmoji(client.e.zen).setStyle(2))], fetchReply: true })
                  const CollectorLangs = await MensagemConfigLang.createMessageComponentCollector({ componentType: 2, });
          
                  CollectorLangs.on('collect', async (i) => {
                    if (interaction.user.id !== i.user.id) return i.reply({ content: `${client.e.zx} **› ${i.user.username}**, Você não pode usar isso!`, ephemeral: true });
                    if (i.customId === 'config:button:lang:pt') {
                      const Embed3 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Idioma Configurado', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zpt}${client.e.z}Certo, agora irei falar em Portuguese (pt_BR) neste servidor.`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                      MensagemConfigLang.edit({ embeds: [Embed3], components: [] });
                      GuildDatabase.Lang = 'pt';
                      GuildDatabase.save();
                    } else if (i.customId === 'config:button:lang:en') {
                      const Embed3 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configured Language', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zpt}${client.e.z}Okay, now I'm going to speak in English on this server.`).setFooter({ text: `› By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                      MensagemConfigLang.edit({ embeds: [Embed3], components: [] });
                      GuildDatabase.Lang = 'en';
                      GuildDatabase.save();
                    }
                  });

              } else if (i.values.toString() === 'config:menu:logs') { 
                const Embed4 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configurar Logs', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zlog}${client.e.z}Você entrou no modo de configuração das Logs! Use os botões para continuar.\n> ${client.e.zlist}${client.e.z}**Status: ${GuildDatabase.LogsStatus.replace('true', 'Ativado(a)').replace('false', 'Desativado(a)')}**\n> ${client.e.zchannel}${client.e.z}**Canal: ${GuildDatabase.LogsChannel.replace('false', 'Não definido(a)')}**`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                const Comp4 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('config:button:logs:status').setEmoji(client.e.zlist).setStyle(2)).addComponents(new ButtonBuilder().setCustomId('config:button:logs:channel').setEmoji(client.e.zchannel).setStyle(2))
                i.deferUpdate().catch(err => {});

                const MensagemConfigLogs = await MensagemConfig.edit({ embeds: [Embed4], components: [Comp4], fetchReply: true })
                const CollectorLogs = await MensagemConfigLogs.createMessageComponentCollector({ componentType: 2, });
        
                CollectorLogs.on('collect', async (i) => {
                  if (interaction.user.id !== i.user.id) return i.reply({ content: `${client.e.zx} **› ${i.user.username}**, Você não pode usar isso!`, ephemeral: true });
                  if (i.customId === 'config:button:logs:status') {

                    const Embed5 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configurando Logs', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zlog}${client.e.z}Você entrou no modo de configuração do Status das Logs! Use os botões para continuar.\n> ${client.e.z1b}${client.e.z}**Ativar**\n> ${client.e.z2b}${client.e.z}**Desativar**`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    MensagemConfigLogs.edit({ embeds: [Embed5], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('config:button:logs:status:on').setEmoji(client.e.z1b).setStyle(2)).addComponents(new ButtonBuilder().setCustomId('config:button:logs:status:off').setEmoji(client.e.z2b).setStyle(2)).addComponents(new ButtonBuilder().setCustomId('config:button:logs').setEmoji(client.e.zvoltar).setStyle(2))], fetchReply: true });
                    i.deferUpdate().catch(err => {});
                  
                    const CollectorLogs2 = await MensagemConfigLogs.createMessageComponentCollector({ componentType: 2, });
        
                    CollectorLogs2.on('collect', async (i) => {
                      if (interaction.user.id !== i.user.id) return i.reply({ content: `${client.e.zx} **› ${i.user.username}**, Você não pode usar isso!`, ephemeral: true });
                      if (i.customId === 'config:button:logs:status:on') {
                        if (GuildDatabase.LogsStatus === 'true') {
                          return i.reply({ content: `${client.e.zx}${client.e.z}**${i.user.username}**, As Logs já estão ativadas neste servidor!`, ephemeral: true })
                          i.deferUpdate().catch(err => {});
                        } else {
                          const Embed6 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Logs Status Configurado', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zlist}${client.e.z}Certo, ativei as logs neste servidor!`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                          i.reply({ embeds: [Embed6] })
                          GuildDatabase.LogsStatus = 'true';
                          await GuildDatabase.save()
                        }
                    } else if (i.customId === 'config:button:logs:status:off') {
                      if (GuildDatabase.LogsStatus === 'false') {
                        return i.reply({ content: `${client.e.zx}${client.e.z}**${i.user.username}**, As Logs já estão desativadas neste servidor!`, ephemeral: true });
                        i.deferUpdate().catch(err => {});
                      } else {
                        const Embed7 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Logs Status Configurado', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zlist}${client.e.z}Certo, desativei as logs neste servidor!`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        i.reply({ embeds: [Embed7] })
                        GuildDatabase.LogsStatus = 'false';
                        await  GuildDatabase.save()
                      }
                    } else if (i.customId === 'config:button:logs') {
                      let Guild = await client.db.guild.findOne({ _id: interaction.guild.id });
                      MensagemConfigLogs.edit({ embeds: [Embed4.setDescription(`${client.e.zlog}${client.e.z}Você entrou no modo de configuração das Logs! Use os botões para continuar.\n> ${client.e.zlist}${client.e.z}**Status: ${GuildDatabase.LogsStatus.replace('true', 'Ativado(a)').replace('false', 'Desativado(a)')}**\n> ${client.e.zchannel}${client.e.z}**Canal: ${Guild.LogsChannel.replace('false', 'Não definido(a)')}**`)], components: [Comp4], fetchReply: true })
                      i.deferUpdate().catch(err => {});
                    }
                    })
                  } else if (i.customId === 'config:button:logs:channel') {

                    if (interaction.user.id !== i.user.id) return i.reply({ content: `${client.e.zx} **› ${i.user.username}**, Você não pode usar isso!`, ephemeral: true });
                    if (i.customId === 'config:button:logs:channel') {
                      const Embed8 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configurando Logs', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zlog}${client.e.z}Você entrou no modo de configuração do Canal das Logs! Mencione um canal ou utilize o ID.`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                      const Message = await i.reply({ embeds: [Embed8], fetchReply: true })

                      const filter = MSG => MSG.author.id === interaction.user.id;
                      interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 }).on('collect', async (MSG) => {
                       const ChannelLog = MSG.mentions.channels.first() || interaction.guild.channels.cache.find((a) => a.name === a.content) || interaction.guild.channels.cache.get(MSG.content);
                       if (!ChannelLog) return Message.edit({ embeds: [], content: `${client.e.zx}${client.e.z}**${interaction.user}**, Não encontrei esse canal ou então ele não existe!`, ephemeral: true })
                       if (ChannelLog?.id === GuildDatabase.LogsChannel) return Message.edit({ embeds: [], content: `${client.e.zx}${client.e.z}**${interaction.user}**, O canal que você mandou já está definido!`, ephemeral: true })
                       const Embed9 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Canal de Logs Configurado', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zchannel}${client.e.z}Certo, o canal de Logs foi setado em <#${ChannelLog.id}>.`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                       await Message.edit({ embeds: [Embed9] })
                       await MensagemConfigLogs.edit({ embeds: [Embed4.setDescription(`${client.e.zlog}${client.e.z}Você entrou no modo de configuração das Logs! Use os botões para continuar.\n> ${client.e.zlist}${client.e.z}**Status: ${GuildDatabase.LogsStatus.replace('true', 'Ativado(a)').replace('false', 'Desativado(a)')}**\n> ${client.e.zchannel}${client.e.z}**Canal: ${ChannelLog}**`)], components: [Comp4], fetchReply: true })
                       await client.db.guild.findOneAndUpdate({ _id: interaction.guild.id }, { $set: { LogsChannel: `${ChannelLog}` } });
                    })
                  } 
                  }
                });
              };
            };
          });
        } else if (GuildDatabase.Lang === 'en') {
          
          const Embed1 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Settings', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zconfig}${client.e.z}**Options:**\n> **${client.e.zglob}${client.e.z}Server Language**\n> **${client.e.zlog}${client.e.z}Sistema de Logs**`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          const ConfigMenu = new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId('config:menu').setPlaceholder('› Select here').addOptions([{ label: '› Server Language', value: 'config:menu:language', emoji: client.e.zglob }, { label: '› Log System', value: 'config:menu:logs', emoji: client.e.zlog }]));
          const MensagemConfig = await interaction.reply({ embeds: [Embed1], components: [ConfigMenu], fetchReply: true });

          const CollectorMenu = await MensagemConfig.createMessageComponentCollector({
            componentType: 3,
          });

          CollectorMenu.on('collect', async (i) => {
            if (interaction.user.id !== i.user.id) return;
            if (i.customId === 'config:menu') {

              if (i.values.toString() === 'config:menu:language') {
                  const Embed2 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configure Language', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zglob}${client.e.z}You have entered Language setting mode! Use buttons to continue.\n${client.e.zinv}${client.e.z}**Available Languages:**\n> **${client.e.zpt}${client.e.z}Portuguese (pt_BR)**\n> **${client.e.zen}${client.e.z}English (en_US)**`).setFooter({ text: `› By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                  i.deferUpdate();

                  const MensagemConfigLang = await MensagemConfig.edit({ embeds: [Embed2], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('config:button:lang:pt').setEmoji(client.e.zpt).setStyle(2)).addComponents(new ButtonBuilder().setCustomId('config:button:lang:en').setEmoji(client.e.zen).setStyle(2))], fetchReply: true })
                  const CollectorLangs = await MensagemConfigLang.createMessageComponentCollector({ componentType: 2, });
          
                  CollectorLangs.on('collect', async (i) => {
                    if (interaction.user.id !== i.user.id) return i.reply({ content: `${client.e.zx} **› ${i.user.username}**, You can't use this!`, ephemeral: true });
                    if (i.customId === 'config:button:lang:en') {
                    const Embed3 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configured Language', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zpt}${client.e.z}Okay, now I'm going to speak in English on this server.`).setFooter({ text: `› By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    MensagemConfigLang.edit({ embeds: [Embed3], components: [] });
                    GuildDatabase.Lang = 'en';
                    GuildDatabase.save();
                  } else if (i.customId === 'config:button:lang:pt') {
                    const Embed3 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Idioma Configurado', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zpt}${client.e.z}Certo, agora irei falar em Portuguese (pt_BR) neste servidor.`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    MensagemConfigLang.edit({ embeds: [Embed3], components: [] });
                    GuildDatabase.Lang = 'pt';
                    GuildDatabase.save();
                  }
                  });
              } else if (i.values.toString() === 'config:menu:logs') { 
                const Embed4 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configure Logs', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zlog}${client.e.z}You have entered Logs configuration mode! Use buttons to continue.\n> ${client.e.zlist}${client.e.z}**Status: ${GuildDatabase.LogsStatus}**\n> ${client.e.zchannel}${client.e.z}**Channel: ${GuildDatabase.LogsChannel}**`).setFooter({ text: `› By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                const Comp4 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('config:button:logs:status').setEmoji(client.e.zlist).setStyle(2)).addComponents(new ButtonBuilder().setCustomId('config:button:logs:channel').setEmoji(client.e.zchannel).setStyle(2))
                i.deferUpdate().catch(err => {});

                const MensagemConfigLogs = await MensagemConfig.edit({ embeds: [Embed4], components: [Comp4], fetchReply: true })
                const CollectorLogs = await MensagemConfigLogs.createMessageComponentCollector({ componentType: 2, });
        
                CollectorLogs.on('collect', async (i) => {
                  if (interaction.user.id !== i.user.id) return i.reply({ content: `${client.e.zx} **› ${i.user.username}**, You can't use this!`, ephemeral: true });
                  if (i.customId === 'config:button:logs:status') {

                    const Embed5 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configuring Logs', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zlog}${client.e.z}You have entered Log Status configuration mode! Use buttons to continue.\n> ${client.e.z1b}${client.e.z}**Activate**\n> ${client.e.z2b}${client.e.z}**Disable**`).setFooter({ text: `› By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    MensagemConfigLogs.edit({ embeds: [Embed5], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('config:button:logs:status:on').setEmoji(client.e.z1b).setStyle(2)).addComponents(new ButtonBuilder().setCustomId('config:button:logs:status:off').setEmoji(client.e.z2b).setStyle(2)).addComponents(new ButtonBuilder().setCustomId('config:button:logs').setEmoji(client.e.zvoltar).setStyle(2))], fetchReply: true });
                    i.deferUpdate().catch(err => {});
                  
                    const CollectorLogs2 = await MensagemConfigLogs.createMessageComponentCollector({ componentType: 2, });
        
                    CollectorLogs2.on('collect', async (i) => {
                      if (interaction.user.id !== i.user.id) return i.reply({ content: `${client.e.zx} **› ${i.user.username}**, You can't use this!`, ephemeral: true });
                      if (i.customId === 'config:button:logs:status:on') {
                        if (GuildDatabase.LogsStatus === 'Ativado(a)') {
                          return i.reply({ content: `${client.e.zx}${client.e.z}**${i.user.username}**, Logs are already enabled on this server!`, ephemeral: true })
                          i.deferUpdate().catch(err => {});
                        } else {
                          const Embed6 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Logs Status Configured', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zlist}${client.e.z}Okay, I enabled logging on this server!`).setFooter({ text: `› By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                          i.reply({ embeds: [Embed6] })
                          GuildDatabase.LogsStatus = 'Ativado(a)';
                          await GuildDatabase.save()
                        }
                    } else if (i.customId === 'config:button:logs:status:off') {
                      if (GuildDatabase.LogsStatus === 'Desativado(a)') {
                        return i.reply({ content: `${client.e.zx}${client.e.z}**${i.user.username}**, Logs are already disabled on this server!`, ephemeral: true });
                        i.deferUpdate().catch(err => {});
                      } else {
                        const Embed7 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Logs Status Configured', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zlist}${client.e.z}Okay, I turned off logging on this server!`).setFooter({ text: `› By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                        i.reply({ embeds: [Embed7] })
                        GuildDatabase.LogsStatus = 'Desativado(a)';
                        await  GuildDatabase.save()
                      }
                    } else if (i.customId === 'config:button:logs') {
                      MensagemConfigLogs.edit({ embeds: [Embed4.setDescription(`${client.e.zlog}${client.e.z}You have entered Logs configuration mode! Use buttons to continue.\n> ${client.e.zlist}${client.e.z}**Status: ${GuildDatabase.LogsStatus}**\n> ${client.e.zchannel}${client.e.z}**Channel: ${GuildDatabase.LogsChannel}**`)], components: [Comp4], fetchReply: true })
                      i.deferUpdate().catch(err => {});
                    }
                    })
                  } else if (i.customId === 'config:button:logs:channel') {

                    if (interaction.user.id !== i.user.id) return i.reply({ content: `${client.e.zx} **› ${i.user.username}**, You can't use this!`, ephemeral: true });
                    if (i.customId === 'config:button:logs:channel') {
                      const Embed8 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configuring Logs', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zlog}${client.e.z}You have entered the Log Channel configuration mode! Mention a channel or use the ID.`).setFooter({ text: `› By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                      const Message = await i.reply({ embeds: [Embed8], fetchReply: true })

                      const filter = MSG => MSG.author.id === interaction.user.id;
                      interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 }).on('collect', async (MSG) => {
                       const ChannelLog = MSG.mentions.channels.first() || interaction.guild.channels.cache.find((a) => a.name === a.content) || interaction.guild.channels.cache.get(MSG.content);
                       if (!ChannelLog) return Message.edit({ embeds: [], content: `${client.e.zx}${client.e.z}**${interaction.user}**, I didn't find this channel or it doesn't exist!`, ephemeral: true })
                       if (ChannelLog?.id === GuildDatabase.LogsChannel) return Message.edit({ embeds: [], content: `${client.e.zx}${client.e.z}**${interaction.user}**, The channel you sent is already set!`, ephemeral: true })
                       const Embed9 = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: interaction.guild.name + ' › Configured Log Channel', iconURL: interaction.guild.iconURL({ dynamic: true }) }).setDescription(`${client.e.zchannel}${client.e.z}Okay, the Logs channel has been set to <#${ChannelLog.id}>.`).setFooter({ text: `› By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                       await Message.edit({ embeds: [Embed9] })
                       await MensagemConfigLogs.edit({ embeds: [Embed4.setDescription(`${client.e.zlog}${client.e.z}You have entered Logs configuration mode! Use buttons to continue.\n> ${client.e.zlist}${client.e.z}**Status: ${GuildDatabase.LogsStatus}**\n> ${client.e.zchannel}${client.e.z}**Channel: ${GuildDatabase.LogsChannel}**`)], components: [Comp4], fetchReply: true })
                       await client.db.guild.findOneAndUpdate({ _id: interaction.guild.id }, { $set: { LogsChannel: `${ChannelLog}` } });
                    })
                  } 
                  }
                });
              };
            };
          });
        }
    } catch (e) {
      console.log(e);
    }
  },
};
