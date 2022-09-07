export default {
  name: 'guildDelete',
  async exec(client, guild) {
    client.channels.fetch('1006631790515064852').then((a) => {
      a.send({ content: `\`\`\`< Client > Fui removido de [ ${guild.name} - ${guild.id} ( Owner: ${guild.ownerId} ) ]\`\`\`` });
    });
    console.log(`< Client > Fui removido de [ ${guild.name} - ${guild.id} ( Owner: ${guild.ownerId} ) ]`);
  },
};
