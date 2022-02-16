/**
 * Set mode: 
 * study: 25 learning, 5p pause
 */

const { SlashCommandBuilder } = require('@discordjs/builders');

const { checkAudioCommandPermission, checkPlayerRunning } = require('../../resource/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mode')
    .setDescription('Set play mode !')
    .addStringOption(option =>
      option.setName("mode")
        .setDescription("Specified mode")
        .setRequired(true)
        .addChoice("study", "study")
        .addChoice("off", "off")),
  async execute(interaction) {
    if (!checkAudioCommandPermission(interaction))
      return await interaction.reply({ content: "You have not joined a channel or I'm playing in another channel!", ephemeral: true });

    if (!checkPlayerRunning(interaction))
      return await interaction.reply({ content: "Can not set mode as no player is active!", ephemeral: true });

    const queue = interaction.client.player.getQueue(interaction.guild);

    const mode = interaction.options.getString("mode");
    switch (mode) {
      case "study":
        const timeStudy = 25 * 60 * 1000;
        const timePause = 5 * 60 * 1000;
        setTimeout(() => {
          queue.setPaused(true);
          interaction.channel.send({ content: "Break time!", ephemeral: true });
        }, timeStudy);

        interaction.client.currentSession = setInterval(() => {
          interaction.channel.send({ content: "Next session!", ephemeral: true });
          queue.setPaused(false);
          interaction.client.currentBreak = setTimeout(() => {
            queue.setPaused(true);
            interaction.channel.send({ content: "Break time!", ephemeral: true });
          }, timeStudy);
        }, timeStudy + timePause);
        break;

      case "off":
        if (interaction.client.currentSession) clearInterval(interaction.client.currentSession);
        if (interaction.client.currentBreak) clearTimeout(interaction.client.currentBreak);
        break;

      default:
        break;
    }

    return await interaction.reply(` 👌 | Set mode to **${mode}**! `);
  },


  // handleMessage(message) {
  //     this.execute(message);
  // },
};