import {
  Client, Options, Collection, IntentsBitField, REST, Routes
} from 'discord.js';
import { Colors, Emojis, defMessages } from './Config.js';
import { pathToFileURL } from 'node:url';
import { readdirSync } from 'node:fs';
import { Database, connect } from './Database.js';
import utils from './Utils.js';
import disc from 'disc-functions';

const ZyronIntents = new IntentsBitField();
ZyronIntents.add([IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildIntegrations, IntentsBitField.Flags.GuildPresences]);

export default class ZyronClient extends Client {
  constructor() {
    super({
      makeCache: Options.cacheWithLimits({
        GuildManager: Infinity,
        GuildMemberManager: Infinity,
        BaseGuildEmojiManager: 0,
        ReactionManager: 0,
        ThreadMemberManager: 0,
        GuildInviteManager: 0,
        GuildStickerManager: 0,
        GuildScheduledEventManager: 0,
        ReactionUserManager: 0,
        StageInstanceManager: 0,
        ThreadManager: 0,
      }),
      intents: ZyronIntents,
      disableMentions: 'all',
      shardCount: 2,
      allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: false,
      },
    });

    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.db = new Database(this);
    this.color = Colors;
    this.e = Emojis;
    this.disc = disc;
    this.utils = utils;
    this.defMessages = defMessages;
    this.dev = ['823635200101580851'];
  }

  async init() {
    await super.login(process.env.TOKEN).catch((e) => console.log(e)).then(() => { console.log('< Client > Initiated!'); console.log(`< Client > ${this.ws.totalShards} Loaded!`) });
    await connect(process.env.DATABASE_URL).catch((e) => console.log(e)).then(() => { console.log('< Database > Connected!') });

    await this.loadCommands(`${process.cwd()}/src/Commands`);
    await this.loadEvents(`${process.cwd()}/src/Events`);
  }

  async loadCommands(path) {
    try {
      const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
      const slashsArray = [];

      readdirSync(`${path}`).forEach(async (dir) => {
        const files = readdirSync(`${path}/${dir}`).filter(file => file.endsWith('.js'));
        for (const file of files) {
          const pull = await import(`${pathToFileURL(`${path}/${dir}/${file}`)}`).then(r => r.default);

          slashsArray.push({
            name: pull.name,
            description: pull.description,
            type: pull.type,
            options: pull.options ? pull.options : null,
          });

          if (!pull.name) return;
          this.commands.set(pull.name, pull);
          
          this.on('ready', async () => {
            await rest.put(Routes.applicationCommands("694901042986614805"), { body: slashsArray });
          })
                  
         };
        });
      } catch (err) {
      return console.log(err);
    }
    return console.log('< Client > Comandos Carregados!');
  }

  async loadEvents(path) {
    readdirSync(`${path}`).forEach((dir) => {
      const files = readdirSync(`${path}/${dir}`).filter((x) => x.endsWith('.js'));
      files.forEach(async (file) => {
        const pull = await import(pathToFileURL(`${path}/${dir}/${file}`).toString());
        const { name, exec } = pull.default;
        this.on(name, exec.bind(null, this));
      });
    });
    return console.log('< Client > Eventos Carregados!');
  }
}