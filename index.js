require('dotenv').config();
console.log(process.env);

const { readdirSync } = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { createPool } = require('mysql2/promise');

const { mysql: dbConfig } = require('./config.json');
const { MYSQL_USERNAME, MYSQL_PASSWORD, DISCORD_TOKEN } = process.env;

const client = new Client({ intents: [ 
  Intents.FLAGS.GUILDS, 
  Intents.FLAGS.GUILD_MESSAGES, 
  Intents.FLAGS.GUILD_VOICE_STATES, 
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS
]});

//Db connection
client.mysql = createPool({
  host: dbConfig.host,
  port: dbConfig.port || 3306,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: dbConfig.database,
  charset: dbConfig.charset
});

//Command files
client.commands = new Collection();
readdirSync('./commands/').filter(file => !file.includes('.')).forEach(dir => {
  const commandFiles = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./commands/${dir}/${file}`);
    client.commands.set(command.data.name, command);
  }
});

//Event files
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.handleEvent(...args));
  } else {
    client.on(event.name, (...args) => event.handleEvent(...args));
  }
}

//Button Handlers
client.buttonHandlers = new Collection();
readdirSync('./buttons/').filter(file => !file.includes('.')).forEach(dir => {
  const commandFiles = readdirSync(`./buttons/${dir}/`).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const button = require(`./buttons/${dir}/${file}`);
    client.buttonHandlers.set(button.label, button);
  }
});


client.login(DISCORD_TOKEN);