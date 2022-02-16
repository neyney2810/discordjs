module.exports = {
  name: 'interactionCreate',
  async handleEvent(interaction) {

    try {
      if (interaction.isButton()) {
        //Handle button interaction
        const buttonName = interaction.message.components[0].components[0].label;
        const buttonHandler = interaction.client.buttonHandlers.get(buttonName.toLowerCase());
        return await buttonHandler.execute(interaction);
        
      } else if (interaction.isCommand()) {
        //Handle command interaction

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        return await command.execute(interaction);
      }
    } catch (error) {
      console.error(error);
      if (!interaction.replied) {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  },
};