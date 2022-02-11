module.exports = {
    name: "ready",
    once: true,
    execute(client) {
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