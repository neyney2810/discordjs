const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require("@discordjs/voice");

module.exports = class VoiceConnection {
	constructor(channelId, guild){

        const connection = joinVoiceChannel({
            channelId: channelId,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });

        connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
            console.log('Connection is in the Ready state!');
        });

        connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
                ])
            } catch (error) {
                connection.destroy();
            }
        })

        this.connection = connection;

	}

	subscribe(audioPlayer) {
        this.connection.subscribe(audioPlayer);
	}

    destroy() {
        this.connection.destroy();
    }
    
}