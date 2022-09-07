import pkg from 'mongoose';

const { Schema, model, connect } = pkg;

const Guild = model('Guilds', new Schema({
    _id: { type: String, default: null },
    Server2x: { type: Boolean, default: false },
    Lang: { type: String, default: 'pt' },
    EconomyEmojiCrystals: { type: String, default: '<:Cristais:1010971939805868072>' },
    EconomyEmojiFlowers: { type: String, default: '<:flores:1010982008912105592>' },
    LogsStatus: { type: String, default: 'false' },
    LogsChannel: { type: String, default: 'false' },
}));

const User = model('Users', new Schema({
    _id: { type: String, default: null },
    betaTester: { type: Boolean, default: false },
    BlackList: {
      Status: { type: Boolean, default: false },
      Reason: { type: String, default: null },
      Time: { type: String, default: null },
      Evidences: { type: String, default: null },
      AuthorID: { type: String, default: null },
    },
}));

const Economy = model('Economy', new Schema({
    _id: { type: String, default: null },
    name: { type: String, default: null },
    DailyCc: { type: String, default: null },
    Conquests: { type: Number, default: '0' },
    Badges: { type: String, default: '<:Zyron_Icon:1009225349609033788>' },
    Crystals: { type: Number, default: '0' },
    Flowers: { type: Number, default: '0' },
    Job: { type: String, default: 'Desempregado(a)' },
    WorkXP: { type: Number, default: '0' },
    DailyCount: { type: Number, default: '0' },
    WorkCount: { type: Number, default: '0' },
    ImageProfile: { type: String, default: 'https://cdn.discordapp.com/attachments/734166656728694824/1010987085890584597/unknown.png?size=4096' },
}));

class Database {
  constructor(client) {
    this.client = client;
    this.guild = Guild;
    this.user = User;
    this.economy = Economy;
  }

  async ping() {
    const pingStart = process.hrtime();
    await this.guild?.findOne({ _id: this.client.user.id });
    const pingStop = process.hrtime(pingStart);

    return Math.round(((pingStop[0] * 1e9) + pingStop[1]) / 1e6);
  }
}

export { Database, connect };