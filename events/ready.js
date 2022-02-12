module.exports = {
    name: "ready",
    once: true,
    handleEvent(client) {
        console.log(`Logged in as ${client.user.tag}!`);

        client.user.setPresence({
          activities: [{
            name: "as NeyNey",
            type: "PLAYING"
          }],
          status: "online"
        });

        
    }
}