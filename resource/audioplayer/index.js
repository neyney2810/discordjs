const {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
    entersState,
} = require('@discordjs/voice');

const VoiceConnection = require('../voice');

module.exports = class AudioPlayer {
	constructor(channelId, guild){
        this.connection = new VoiceConnection(channelId, guild);
		const player = createAudioPlayer();

		player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
            console.log('Audio player is in the Playing state!');
        });

        player.on(AudioPlayerStatus.Idle, () => console.log("something"));

        player.on('error', error => console.error(error));

        this.player = player;
	}

	async play(resource) {
		this.player.play(resource);
		try {
            await entersState(this.player, AudioPlayerStatus.Playing, 5_000);
            this.connection.subscribe(this.player);            
            // The player has entered the Playing state within 5 seconds
            console.log('Playback has started!');
        } catch (error) {
            // The player has not entered the Playing state and either:
            // 1) The 'error' event has been emitted and should be handled
            // 2) 5 seconds have passed
            console.error(error);
        }
	}

    getAudioPlayer() {
        return this.player;
    }

    pause(timeout) {
        this.player.pause();
        if (timeout) setTimeout(() => this.player.unpause(), timeout);
    }

    stop() {
        this.player.stop();
    }
}