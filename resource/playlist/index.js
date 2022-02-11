const { createAudioResource, StreamType } = require("@discordjs/voice");
const ytdl = require("ytdl-core");

module.exports = class Playlist {
    constructor() {
        this.list = [];
    }

    add(resource) {
        this.list.push(resource);
    }

    addURL(url) {
        const youtubeRegex = /(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?/;
        if (url.search(youtubeRegex) < 0) {
            throw new Error('Please enter a valid url');
        } 
		const stream = ytdl(url, {filter: 'audioonly'});
		const resource = createAudioResource(stream, {inputType: StreamType.Arbitrary});
        this.list.push(resource);
    }

    getList() {
        return this.list;
    }

    getNextResource() {
        return this.list.shift();
    }

}