import {
  ActionRowBuilder, ModalBuilder, TextInputBuilder, ApplicationCommandOptionType, EmbedBuilder,
} from 'discord.js';
import { exec } from 'child_process';

const REGEX = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

export default {
  name: 'dev',
  description: '[ 👑 › Developer ] › Commands for the Developer',
  type: 1,
  onlyDev: true,
  onlyManu: false,
  cooldown: 1,
  options: [{
    name: 'eval',
    description: '[ 👑 › Developer ] › Only for my developer',
    type: ApplicationCommandOptionType.Subcommand,
  }, {
    name: 'blacklist',
    description: '[ 👑 › Developer ] › Only for my developer',
    type: ApplicationCommandOptionType.Subcommand,
    options: [{
      name: 'user',
      description: '[ 🎈 ] › Select a User',
      type: ApplicationCommandOptionType.User,
      required: true,
    }, {
      name: 'reason',
      description: '[ 🎈 ] › Select a Reason',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [{ name: ' › Enjoy the Bugs/Errors', value: '1' }, { name: ' › Humiliate/disrespect other users', value: '2' }, { name: ' › Made Fake-News using Zyron name', value: '3' }, { name: ' › Used Alternative Accounts', value: '4' }, { name: ' › Plagiarized Zyron', value: '5' }, { name: ' › Used Zyron to generate Spam/Flood', value: '6' }, { name: ' › Other', value: '7' }],
    }, {
      name: 'evidences',
      description: '[ 🎈 ] › Add the Evidences',
      type: ApplicationCommandOptionType.String,
      required: true,
    }, {
      name: 'other',
      description: '[ 🎈 ] › Add a Reason',
      type: ApplicationCommandOptionType.String,
      required: false,
    }],
  }, {
    name: 'shell',
    description: '[ 👑 › Developer ] › Only for my developer',
    type: ApplicationCommandOptionType.Subcommand,
    options: [{
      name: 'exec',
      description: '[ 🎈 ] › Exec',
      type: ApplicationCommandOptionType.String,
      required: true
    }],
  }],
  async exec(client, interaction) {
    if (interaction.options.getSubcommand() === 'eval') {
      await interaction.showModal(new ModalBuilder().setTitle('👑 › Evaluate em JavaScript').setCustomId('modal-eval').addComponents([new ActionRowBuilder().addComponents([new TextInputBuilder().setCustomId('code-eval').setLabel('👑 › Zyron - Eval').setStyle(2)
        .setPlaceholder('✍ › Código aqui...')
        .setRequired(true)])]));
    } else if (interaction.options.getSubcommand() === 'blacklist') {
      let User = await client.db.user.findOne({ _id: interaction.options.getUser('user').id });
      if (!User) User = await client.db.user.create({ _id: interaction.options.getUser('user').id });

      const reasons = interaction.options.get('reason').value.replace('1', 'Aproveitou-se de Bugs/Erros').replace('2', 'Humilhou/Desrespeitou outros Usuários').replace('3', 'Fez Fake-News usando o nome do Zyron').replace('4', 'Usou Contas Alternativas')
        .replace('5', 'Plagiou o Zyron')
        .replace('6', 'Usou o Zyron para gerar Spam/Flood')
        .replace('7', `${interaction.options.getString('other') || 'Not'}`);
      const att = interaction.options.getString('evidences');
      const bP = new EmbedBuilder()
        .setColor(client.color.default)
        .setImage(att)
        .setAuthor({ name: ` › ${interaction.options.getUser('user').tag} ›`, iconURL: interaction.options.getUser('user').displayAvatarURL({ dynamic: true }) })
        .setDescription(`<:ban_emoji:1007424063653818378> **› O Usuário ›** \`[ ${interaction.options.getUser('user').tag} / ${interaction.options.getUser('user').id} ]\` foi banido de usar meus comandos.\n<:fogeyue:1000188722844803183> **› Motivo ›** \`[ ${reasons} ]\`\n<:calender:1000187024948600893> **› Data › [ <t:${~~(Date.now() / 1e3)}> ]**`)
        .setFooter({ text: ` › ${interaction.user.tag} › `, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

      interaction.reply({ embeds: [bP] });

      User.BlackList.Status = true;
      User.BlackList.Reason = `${reasons}`;
      User.BlackList.Time = `${~~(Date.now() / 1e3)}`;
      User.BlackList.Evidences = `${att}`;
      User.BlackList.AuthorID = `${interaction.user.id}`;

      await User.save();
    } else if (interaction.options.getSubcommand() === 'shell') {

      const shell = interaction.options.getString('exec');

          exec(shell, (err, res) => {
            if (err) {
              return interaction.reply({
                content: `\`\`\`${err}\`\`\``,
                ephemeral: false
              });
            } else {
              return interaction.reply({
                content: `\`\`\`\n${res.replace(REGEX, '').slice(0, 1900)}\`\`\``,
                ephemeral: false
              });
            }
          });
    }
  },
};
