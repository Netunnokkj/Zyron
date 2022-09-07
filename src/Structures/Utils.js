import { Collection } from 'discord.js';

function ReplaceMessages(Text, o = {}) {
  if (!Text || Text == undefined || Text == null) throw '';
  const options = Object(o);
  if (!options || options == undefined || options == null) return String(Text);
  return String(Text)
    .replace(/%{timeleft}%/gi, options && options.timeLeft ? options.timeLeft.toFixed(1) : '%{timeleft}%')
    .replace(/%{botPermC}%/gi, options && options.command && options.command.botPerm ? options.command.botPerm.map((c) => `\`${c}\``).join(',') : '%{botPermC}%');
}

function onCoolDown(message, command) {
  if (!message || !message.client) throw '';
  if (!command || !command.name) throw '';
  const { client } = message;
  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection());
  }
  const DateNow = Date.now();
  const Time = client.cooldowns.get(command.name);
  const CooldownTime = (command.cooldown || 1000) * 1000;
  if (Time.has(message.member.id)) {
    const ExpTime = Time.get(message.member.id) + CooldownTime;
    if (DateNow < ExpTime) {
      const timeLeft = (ExpTime - DateNow) / 1000;
      return timeLeft;
    }
    Time.set(message.member.id, DateNow);
    setTimeout(() => Time.delete(message.member.id), CooldownTime);
    return false;
  }
  Time.set(message.member.id, DateNow);
  setTimeout(() => Time.delete(message.member.id), CooldownTime);
  return false;
}

export default {
  onCoolDown,
  ReplaceMessages,
};