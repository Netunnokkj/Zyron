export default {
  name: 'ready',
  async exec(client) {
    client.manager?.init(client.user.id);
    client.user.setPresence({ activities: [{ name: `Guilds: ${client.guilds.cache.size} | Users: ${Math.ceil(client.guilds.cache.map((g) => g.memberCount).reduce((b, a) => b + a)) / 1000}k | Ping: ${client.ws.ping}` }] });
  },
};
