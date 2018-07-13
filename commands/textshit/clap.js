const command = require("discord.js-commando");

class FellasCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "clap",
            group: "textshit",
            memberName: "clap",
            description: "Replaces spaces with clap emojis.",
            examples: ["`!clap <text>`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();

        if(args.length > 0)
        {
            var stringToSend = args.toString().replace(/ /g, ":clap:")
            message.channel.send(stringToSend).catch(error => console.log("Send Error - " + error));
        }
        else
        {
            message.reply("please provide text after the command.").catch(error => console.log("Send Error - " + error));
        }

        message.channel.stopTyping();
    }
}

module.exports = FellasCommand;