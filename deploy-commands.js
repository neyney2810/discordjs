//Register a slash command against the discord api
const { readdirSync } = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const Ascii = require('ascii-table');
const { CLIENT_ID, GUILD_ID, token } = require('./config.json');


const commands = [];
const table = new Ascii("Command Deployment");
table.setHeading("Cmd", "Interaction", "Message");

readdirSync('./commands/').filter(dir => !dir.includes('.')).forEach(dir => {
  const commandFiles = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./commands/${dir}/${file}`);
    if (command.execute) commands.push(command.data.toJSON());
    table.addRow(command.data.name, command.execute?'✅':'❌', command.handleMessage?'✅':'❌');
  }
});

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
    console.log(table.toString())
  } catch (error) {
    console.error(error);
  }
})();
