import {
  EmbedBuilder, ApplicationCommandOptionType, SelectMenuBuilder, ActionRowBuilder, User,
} from 'discord.js';
import prettyMilliseconds from 'pretty-ms';

export default {
  name: 'economy',
  type: 1,
  description: '💸 › Economy Commands',
  onlyDev: false,
  onlyManu: true,
  cooldown: 1,
  options: [{
    name: 'profile',
    description: '[ 💸 Economy ] › User Profile',
    type: ApplicationCommandOptionType.Subcommand,
    options: [{
      name: 'user',
      description: '[ 🎈 ] › Select a User',
      type: ApplicationCommandOptionType.User,
      required: false,
    }],
  }, {
    name: 'daily',
    description: '[ 💸 › Economy ] › Collect your daily prize',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'rank',
    description: '[ 💸 › Economy ] › See the positions in the Rank',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'jobs',
    description: '[ 💸 › Economy ] › Look for a job',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'dismiss',
    description: '[ 💸 › Economy ] › Resign',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'times',
    description: '[ 💸 › Economy ] › Cooldowns',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'work',
    description: '[ 💸 › Economy ] › Get to work!',
    type: ApplicationCommandOptionType.Subcommand,
  }],
  async exec(client, interaction) {
    let Sub = interaction.options.getSubcommand();
    let UserTarget = interaction.options.getUser('user') || interaction.user;
    let GuildDatabase = await client.db.guild.findOne({ _id: interaction.guild.id });
    let UserDatabase = await client.db.economy.findOne({ _id: UserTarget.id });
    if (!UserDatabase) UserDatabase = await client.db.economy.create({ _id: UserTarget.id });
    await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { name: `${UserTarget.username}` } });

    if (Sub === 'profile') {
      try {
        const pMenu = new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId('pmenu').setPlaceholder('› Selecione uma opção').addOptions([
          {
            label: ' › Home', value: 'home', emoji: '1014224645450379422',
          },
          {
            label: ' › Estatísticas', value: 'estatisticas', emoji: '1012777600554385428',
          },
        ]));

const pP = new EmbedBuilder()
.setColor(client.color.default)
.setAuthor({ name: `› ${UserTarget.username} › Perfil › `, iconURL: 'https://cdn.discordapp.com/attachments/980478565088903231/1014224642413711490/unknown.png?size=4096' })
.setThumbnail(UserTarget.displayAvatarURL({ dynamic: true }))
.setDescription(`
> ${GuildDatabase.EconomyEmojiCrystals} **› Cristais › \`[ ${await client.disc.SymbolFormat(`${UserDatabase.Crystals}`)} ]\`**
> ${GuildDatabase.EconomyEmojiFlowers} **› Flores de Neve › \`[ ${await client.disc.SymbolFormat(`${UserDatabase.Flowers}`)} ]\`**
> <:job:1009211293133189261> **› Emprego › \`[ ${UserDatabase.Job.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')} ]\`**
> <:emblemas:1009220328737734666> **› Emblemas › [ ${UserDatabase.Badges} ]**
`)
.setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
.setImage(UserDatabase.ImageProfile)
.setTimestamp();

const pPE = new EmbedBuilder()
.setColor(client.color.default)
.setAuthor({ name: `› ${UserTarget.username} › Estatísticas › `, iconURL: 'https://cdn.discordapp.com/attachments/980478565088903231/1012777598079733760/unknown.png?size=4096' })
.setThumbnail(UserTarget.displayAvatarURL({ dynamic: true }))
.setDescription(`
> <:conquests:1009212491106099211> **› Conquistas › \`[ ${UserDatabase.Conquests}/0 ]\`**
> <:present:1009218909058121760> **› Diários › \`[ ${UserDatabase.DailyCount} ]\`**
> <:job:1009219382041378858> **› Trabalhos › \`[ ${UserDatabase.WorkCount} ]\`**
`)
.setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
.setTimestamp();

const msg = await interaction.reply({ embeds: [pP], components: [pMenu], fetchReply: true });

const collector = await msg.createMessageComponentCollector({
componentType: 3,
});

        collector.on('collect', async (i) => {
          if (i.customId === 'pmenu') {
            if (interaction.user.id !== i.user.id) return;
            if (i.values.toString() === 'estatisticas') {
              await i.deferUpdate();
              await msg.edit({ embeds: [pPE], components: [pMenu] });
            }
            if (i.values.toString() === 'home') {
              await i.deferUpdate();
              await msg.edit({ embeds: [pP], components: [pMenu] });
            }
          }
        });
      } catch (e) {
        console.log(e);
      }
    } else if (Sub === 'daily') {
      const TimeOut = 86400000;

      if (UserDatabase.DailyCc !== null && TimeOut - (`${Date.now()}` - UserDatabase.DailyCc) > 0) {
        const TimeLeftMs = prettyMilliseconds(TimeOut - (`${Date.now()}` - UserDatabase.DailyCc));

        if (GuildDatabase.Lang === 'pt') {
          return interaction.reply({ content: `<:ampulheta:1010585643367288953> › Você só poderá coletar seu Prêmio Diário novamente em \`[ ${TimeLeftMs} ]\``, ephemeral: true });
        } if (GuildDatabase.Lang === 'en') {
          return interaction.reply({ content: `<:ampulheta:1010585643367288953> › You will only be able to collect your Daily Prize again in \`[ ${TimeLeftMs} ]\``, ephemeral: true });
        }
      } else if (GuildDatabase.Server2x === true) {
        const Crystals = await client.disc.RandomNumber(6500, 9500);
        const Flowers = await client.disc.RandomNumber(2, 4);
        const CrystalsTotal = Crystals + await UserDatabase.Crystals;
        const FlowersTotal = Flowers + await UserDatabase.Flowers;
        const DailyCountSet = await UserDatabase.DailyCount + 1;
        const d2P = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Diário (2x)`, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setDescription(`> Você coletou seu **Prêmio Diário** e recebeu:\n > ${GuildDatabase.EconomyEmojiCrystals} **${Crystals} Cristais**\n > ${GuildDatabase.EconomyEmojiFlowers} **${Flowers} Flores de Neve**`)
          .setThumbnail('https://cdn.discordapp.com/attachments/980478565088903231/1009218906768031805/unknown.png?size=4096')
          .setFooter({ text: '› Espere 24 h para coletar seu Prêmio Diário novamente!', iconURL: 'https://cdn.discordapp.com/emojis/1010585643367288953.webp?size=4096&quality=lossless' })
          .setTimestamp();
        const d2E = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Daily (2x)`, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setDescription(`> You have collected your **Daily Prize** and received:\n > ${GuildDatabase.EconomyEmojiCrystals} **${Crystals} Crystals**\n > ${GuildDatabase.EconomyEmojiFlowers} **${Flowers} Snow Flowers**`)
          .setThumbnail('https://cdn.discordapp.com/attachments/980478565088903231/1009218906768031805/unknown.png?size=4096')
          .setFooter({ text: '› Wait 24 hours to collect your Daily Prize again!', iconURL: 'https://cdn.discordapp.com/emojis/1010585643367288953.webp?size=4096&quality=lossless' })
          .setTimestamp();

        await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, {
          $set: {
            DailyCount: `${DailyCountSet}`, DailyCc: `${Date.now()}`, Crystals: CrystalsTotal, Flowers: FlowersTotal,
          },
        });

        if (GuildDatabase.Lang === 'pt') {
          return interaction.reply({ embeds: [d2P] });
        } if (GuildDatabase.Lang === 'en') {
          interaction.reply({ embeds: [d2E] });
        }
      } else {
        const Crystals = await client.disc.RandomNumber(3500, 6500);
        const Flowers = await client.disc.RandomNumber(1, 3);
        const CrystalsTotal = UserDatabase.Crystals + Crystals;
        const FlowersTotal = UserDatabase.Flowers + Flowers;

        const d1P = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Diário (1x)`, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setDescription(`> Você coletou seu **Prêmio Diário** e recebeu:\n > ${GuildDatabase.EconomyEmojiCrystals} **${Crystals} Cristais**\n > ${GuildDatabase.EconomyEmojiFlowers} **${Flowers} Flores de Neve**`)
          .setThumbnail('https://cdn.discordapp.com/attachments/980478565088903231/1009218906768031805/unknown.png?size=4096')
          .setFooter({ text: '› Espere 24 h para coletar seu Prêmio Diário novamente!', iconURL: 'https://cdn.discordapp.com/emojis/1010585643367288953.webp?size=4096&quality=lossless' })
          .setTimestamp();
        const d1E = new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Daily (1x)`, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setDescription(`> You have collected your **Daily Prize** and received:\n > ${GuildDatabase.EconomyEmojiCrystals} **${Crystals} Crystals**\n > ${GuildDatabase.EconomyEmojiFlowers} **${Flowers} Snow Flowers**`)
          .setThumbnail('https://cdn.discordapp.com/attachments/980478565088903231/1009218906768031805/unknown.png?size=4096')
          .setFooter({ text: '› Wait 24 hours to collect your Daily Prize again!', iconURL: 'https://cdn.discordapp.com/emojis/1010585643367288953.webp?size=4096&quality=lossless' })
          .setTimestamp();

        await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { DailyCc: `${Date.now()}`, Crystals: CrystalsTotal, Flowers: FlowersTotal } });

        if (GuildDatabase.Lang === 'pt') {
          return interaction.reply({ embeds: [d1P] });
        } if (GuildDatabase.Lang === 'en') {
          interaction.reply({ embeds: [d1E] });
        }
      }
    } else if (Sub === 'rank') {
      await client.db.economy.find({}).sort({ Crystals: 'desc' }).limit(10)
        .then(async (economies) => {
          const Rank = new EmbedBuilder()
            .setColor(client.color.default)
            .setAuthor({ name: '› Classificação de Cristais', iconURL: 'https://cdn.discordapp.com/emojis/1010971939805868072.webp?size=4096&quality=lossless' })
            .setDescription('> Aqui está a Classificação das Top 10 pessoas que tem Cristais.');

          let i = 1;

          economies.forEach((TopRank) => {
            Rank.addFields({ name: `( ${i++} ) › ${TopRank.name}`, value: `[ Cristais: **${TopRank.Crystals}** ]` });
          });

          interaction.reply({ embeds: [Rank], fetchReply: true });
        });
    } else if (Sub === 'jobs') {
      try {
        const jMenuPt = new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId('jmenupt').setPlaceholder('› Selecione um emprego').addOptions([{ label: '[ 01 ] › Telefonista', value: '01' }, { label: '[ 02 ] › Vendedor(a)', value: '02' }, { label: '[ 03 ] › Motorista', value: '03' }, { label: '[ 04 ] › Professor(a)', value: '04' }, { label: '[ 05 ] › Médico(a)', value: '05' }, { label: '[ 06 ] › Programador(a)', value: '06' }, { label: '[ 07 ] › Aposentado(a)', value: '07' }]));
        const jMenuEn = new ActionRowBuilder().addComponents(new SelectMenuBuilder().setCustomId('jmenuen').setPlaceholder('› Select a job').addOptions([{ label: '[ 01 ] › Operator', value: '01' }, { label: '[ 02 ] › Salesperson', value: '02' }, { label: '[ 03 ] › Driver', value: '03' }, { label: '[ 04 ] › Teacher', value: '04' }, { label: '[ 05 ] › Doctor', value: '05' }, { label: '[ 06 ] › Programmer', value: '06' }, { label: '[ 07 ] › Retired', value: '07' }]));

const jP = new EmbedBuilder()
.setColor(client.color.default)
.setAuthor({ name: `› ${UserTarget.username} › Agência de Empregos › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) })
.setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless')
.setDescription(`
> <:olaa:1012434113153732640> **›** Olá, seja bem-vindo(a) a Agência de Empregos! Aqui você poderá ganhar seu futuro.\n
<:job:1009219382041378858> **› Lista de Empregos ›**\n
> \`[ 01 ]\` **›** Telefonista _( Salário: 500 - 1,000 Cristais, Requer: 0+ Experiência )_
> \`[ 02 ]\` **›** Vendedor(a) _( Salário: 1,075 - 2,175 Cristais, Requer: 5+ Experiência )_
> \`[ 03 ]\` **›** Motorista _( Salário: 2,350 - 3,200 Cristais, Requer: 15+ Experiência )_
> \`[ 04 ]\` **›** Professor(a) _( Salário: 3,260 - 3,870 Cristais, Requer: 25+ Experiência )_
> \`[ 05 ]\` **›** Médico(a) _( Salário: 3,890 - 4,400 Cristais, Requer: 42+ Experiência )_
> \`[ 06 ]\` **›** Programador(a) _( Salário: 4,470 - 4,999 Cristais, Requer: 65+ Experiência )_
> \`[ 07 ]\` **›** Aposentado(a) _( Salário: 5,100 - 5,980 Cristais, Requer: 88+ Experiência )_
`);

const jE = new EmbedBuilder()
.setColor(client.color.default)
.setAuthor({ name: `› ${UserTarget.username} › Employment Agency › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) })
.setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless')
.setDescription(`
> <:olaa:1012434113153732640> **›** Hello, welcome to the Employment Agency! Here you can earn your future.\n
<:job:1009219382041378858> **› Job List ›**\n
> \`[ 01 ]\` **›** Operator _( Salary: 500 - 1,000 Crystals, Requires: 0+ Experience )_
> \`[ 02 ]\` **›** Salesperson _( Salary: 1,075 - 2,175 Crystals, Requires: 5+ Experience )_
> \`[ 03 ]\` **›** Driver _( Salary: 2,350 - 3,200 Crystals, Requires: 15+ Experience )_
> \`[ 04 ]\` **›** Teacher _( Salary: 3,260 - 3,870 Crystals, Requires: 25+ Experience )_
> \`[ 05 ]\` **›** Doctor _( Salary: 3,890 - 4,400 Crystals, Requires: 42+ Experience )_
> \`[ 06 ]\` **›** Programmer _( Salary: 4,470 - 4,999 Crystals, Requires: 65+ Experience )_
> \`[ 07 ]\` **›** Retired _( Salary: 5,100 - 5,980 Crystals, Requires: 88+ Experience )_
`);

        if (GuildDatabase.Lang === 'pt') {
          const msg = await interaction.reply({ embeds: [jP], components: [jMenuPt], fetchReply: true });

          const collector = await msg.createMessageComponentCollector({
            componentType: 3,
          });

          collector.on('collect', async (i) => {
            if (interaction.user.id !== i.user.id) return;
            let JobNumber = i.values.toString();
            if (i.customId === 'jmenupt') {

              if (UserDatabase.Job === '07') {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você já foi aposentado!`, ephemeral: true })
              }

              if (i.values.toString() === '01') {
                if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) { 
                 return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você está trabalhando como ${UserDatabase.Job.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}, não é possível ter dois empregos!\n> Caso queira pedir demissão use </economy dismiss:1013486702158958734>`, ephemeral: true, });
                } else {
                 await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Agência de Empregos › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Parabéns! Você foi contratado para trabalhar de ${JobNumber.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}`)], components: [], });
                 await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
                }
              }

            if (i.values.toString() === '02') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você está trabalhando como ${UserDatabase.Job.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}, não é possível ter dois empregos!\n> Caso queira pedir demissão use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 5) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você não possui **[ 5+ ] Experiência!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Agência de Empregos › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Parabéns! Você foi contratado para trabalhar de ${JobNumber.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}`)], components: [], });
                await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
              }
            }
            if (i.values.toString() === '03') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você está trabalhando como ${UserDatabase.Job.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}, não é possível ter dois empregos!\n> Caso queira pedir demissão use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 15) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você não possui **[ 15+ ] Experiência!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Agência de Empregos › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Parabéns! Você foi contratado para trabalhar de ${JobNumber.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}`)], components: [], });
                await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
              }
            }
            if (i.values.toString() === '04') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você está trabalhando como ${UserDatabase.Job.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}, não é possível ter dois empregos!\n> Caso queira pedir demissão use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 25) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você não possui **[ 25+ ] Experiência!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Agência de Empregos › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Parabéns! Você foi contratado para trabalhar de ${JobNumber.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}`)], components: [], });
                await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
              }
            }
            if (i.values.toString() === '05') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você está trabalhando como ${UserDatabase.Job.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}, não é possível ter dois empregos!\n> Caso queira pedir demissão use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 42) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você não possui **[ 42+ ] Experiência!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Agência de Empregos › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Parabéns! Você foi contratado para trabalhar de ${JobNumber.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}`)], components: [], });
                await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
              }
            }
            if (i.values.toString() === '06') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você está trabalhando como ${UserDatabase.Job.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}, não é possível ter dois empregos!\n> Caso queira pedir demissão use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 65) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você não possui **[ 65+ ] Experiência!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Agência de Empregos › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Parabéns! Você foi contratado para trabalhar de ${JobNumber.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}`)], components: [], });
                await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
              }
            }
            if (i.values.toString() === '07') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você está trabalhando como ${UserDatabase.Job.replace('01', 'Telefonista').replace('02', 'Vendedor(a)').replace('03', 'Motorista').replace('04', 'Professor(a)').replace('05', 'Médico').replace('06', 'Programador(a)').replace('07', 'Aposentado(a)')}, não é possível ter dois empregos!\n> Caso queira pedir demissão use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 88) {
                return i.reply({ content: `${client.emoji.zx} **›** Agência de Empregos **›**\n> ${i.user}, Você não possui **[ 88+ ] Experiência!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Agência de Empregos › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription('> <:job:1009219382041378858> **›** Parabéns! Você recebeu a sua **Aposentadoria** e você recebeu **10k Cristais**.')], components: [], });
                await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber, Crystals: UserDatabase.Crystals + 10000 } });
              }
            }
          }
          });
        } else if (GuildDatabase.Lang === 'en') {
          const msg = await interaction.reply({ embeds: [jE], components: [jMenuEn], fetchReply: true });

          const collector = await msg.createMessageComponentCollector({
            componentType: 3,
          });

          collector.on('collect', async (i) => {
            if (interaction.user.id !== i.user.id) return;
            let JobNumber = i.values.toString();
            if (i.customId === 'jmenuen') {
              if (UserDatabase.Job === '07') {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, You have already been retired!`, ephemeral: true })
              }

              if (i.values.toString() === '01') {
                if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) { 
                 return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, Are you working like ${UserDatabase.Job.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}, It's not possible to have two jobs!\n> If you want to resign use </economy dismiss:1013486702158958734>`, ephemeral: true, });
                } else {
                 await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Employment Agency › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Congratulations! You were hired to work fo ${JobNumber.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}`)], components: [], });
                 await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
                }
              }

            if (i.values.toString() === '02') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, Are you working like ${UserDatabase.Job.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}, It's not possible to have two jobs!\n> If you want to resign use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 5) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, You don't own **[ 5+ ] Experience!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Employment Agency › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Congratulations! You were hired to work fo ${JobNumber.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}`)], components: [], });
                 await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
              }
            }
            if (i.values.toString() === '03') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, Are you working like ${UserDatabase.Job.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}, It's not possible to have two jobs!\n> If you want to resign use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 15) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, You don't own **[ 15+ ] Experience!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Employment Agency › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Congratulations! You were hired to work fo ${JobNumber.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}`)], components: [], });
                 await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
              }
            }
            if (i.values.toString() === '04') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, Are you working like ${UserDatabase.Job.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}, It's not possible to have two jobs!\n> If you want to resign use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 25) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, You don't own **[ 25+ ] Experience!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Employment Agency › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Congratulations! You were hired to work fo ${JobNumber.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}`)], components: [], });
                 await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
              }
            }
            if (i.values.toString() === '05') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, Are you working like ${UserDatabase.Job.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}, It's not possible to have two jobs!\n> If you want to resign use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 42) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, You don't own **[ 42+ ] Experience!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Employment Agency › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Congratulations! You were hired to work fo ${JobNumber.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}`)], components: [], });
                 await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
              }
            }
            if (i.values.toString() === '06') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, Are you working like ${UserDatabase.Job.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}, It's not possible to have two jobs!\n> If you want to resign use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 65) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, You don't own **[ 65+ ] Experience!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Employment Agency › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription(`> <:job:1009219382041378858> **›** Congratulations! You were hired to work fo ${JobNumber.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}`)], components: [], });
                 await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber } });
              }
            }
            if (i.values.toString() === '07') {
              if (['01', '02', '03', '04', '05', '06', '07'].some((Job) => Job === UserDatabase.Job)) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, Are you working like ${UserDatabase.Job.replace('01', 'Operator').replace('02', 'Salesperson').replace('03', 'Driver').replace('04', 'Teacher').replace('05', 'Doctor').replace('06', 'Programmer').replace('07', 'Retired')}, It's not possible to have two jobs!\n> If you want to resign use </economy dismiss:1013486702158958734>`, ephemeral: true, });
              } else if (UserDatabase.WorkXP < 88) {
                return i.reply({ content: `${client.emoji.zx} **›** Employment Agency **›**\n> ${i.user}, You don't own **[ 88+ ] Experience!**`, ephemeral: true });
              } else {
                await msg.edit({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: `› ${UserTarget.username} › Employment Agency › `, iconURL: UserTarget.displayAvatarURL({ dynamic: true }) }).setThumbnail('https://cdn.discordapp.com/emojis/1009211293133189261.webp?size=4096&quality=lossless').setDescription('> <:job:1009219382041378858> **›** Congratulations! You received your **Retirement** and you received **10k Crystals**.')], components: [], });
                 await client.db.economy.findOneAndUpdate({ _id: UserTarget.id }, { $set: { Job: JobNumber, Crystals: UserDatabase.Crystals + 10000 } });
              }
            }
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    } else if (Sub === 'dismiss') {
      if (UserDatabase.Job === 'Desempregado(a)') {
        return interaction.reply({ content: `${client.emoji.zx} **›** Você não trabalha, use </economy jobs:1013486702158958734> para conseguir um emprego.`, ephemeral: true })
      } else if (['07'].some((Job) => Job === UserDatabase.Job)) {
        return interaction.reply({ content: `${client.emoji.zx} **›** Você é aposentado, não foi possível pedir demissão.`, ephemeral: true })
      } else {
        return interaction.reply({ content: `${client.emoji.zy} **›** Você foi demitido! Use </economy jobs:1013486702158958734> para conseguir um emprego.`, ephemeral: true })
      }
    } else if (Sub === 'times') {
          let T1 = 86400000;
          let Time1 = 86400000;
            
          if (UserDatabase.DailyCc !== null && Time1 - (Date.now() - UserDatabase.DailyCc) > 0) {
              var TimeLeftMs = prettyMilliseconds(T1 - (`${Date.now()}` - UserDatabase.DailyCc));
            
              T1 = TimeLeftMs
            } else {
              T1 = 'Pronto para Usar.'
          }

          interaction.reply({ embeds: [new EmbedBuilder().setColor(client.color.default).setAuthor({ name: ' › Tempos de Espera › ', iconURL: 'https://cdn.discordapp.com/emojis/1010585643367288953.webp?size=4096&quality=lossless' }).setDescription(`> <:present:1009218909058121760> **›** Diário: **[ ${T1} ]**`).setFooter({ text: `› Por: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }) ] })
    } else if (Sub === 'work') {
      if (UserDatabase.Job === 'Desempregado(a)') {
        return interaction.reply({ content: `${client.emoji.zx} **›** Você não trabalha, use </economy jobs:1013486702158958734> para conseguir um emprego.`, ephemeral: true })
      } else {
        interaction.reply('.')
      }
    }
  },
};
