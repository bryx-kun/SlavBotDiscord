const command = require("discord.js-commando");
const Jimp = require("jimp");
const shortid = require("shortid");
const fs = require('fs');
var resultHandler = function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file deleted");
    }
}
var CommandCounter = require("../../index.js")

class FailCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "fail",
            group: "imageshit",
            memberName: "fail",
            description: "***I have failed you.*** This command takes the last image uploaded, your avatar or the avatar of the user you have mentioned after the command.",
            examples: ["`!fail`", "`!fail avatar`", "`!fail @User`"]
        });
    }

    async run(message, args)
    {
        
        CommandCounter.addCommandCounter(message.author.id)

        var otherUser = false;
        var userID = "";
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }
        if(args.length > 0)
        {
            console.log("args are present");
            var getUser = false;
            for(var i = 0; i < args.length; i++)
            {
                if(getUser)
                {
                    if(args[i].toString() == ">")
                    {
                        i = args.length;
                        otherUser = true;
                    }
                    else
                    {
                        if(args[i].toString() != "@" && !isNaN(args[i].toString()))
                        {
                            userID = userID + args[i].toString();
                        }
                    }
                }
                else
                {
                    if(args[i].toString() == "<")
                    {
                         getUser = true;
                    } 
                }
            }
        }
        
        var url = "";
        console.log(url);

        if(args.toString().toLowerCase() != "avatar" && !otherUser)
        {
            message.channel.fetchMessages({ around: message.id })
            .then(messages => {
                var messageID = "";
                messages.filter(msg => {
                    if(msg.attachments.last() != undefined)
                    {
                        if(msg.attachments.last().height > 0)
                        {
                            if(messageID == "")
                            {
                                messageID = msg.id;
                                url = msg.attachments.last().url;
                            }
                        }
                    }
                    else if(msg.embeds[msg.embeds.length - 1] != undefined)
                    {
                        if(msg.embeds[msg.embeds.length - 1].image != null)
                        {
                            if(messageID == "")
                            {
                                messageID = msg.id;
                                url = msg.embeds[msg.embeds.length - 1].image.url;
                            }
                        }
                    }
                });

                if(messageID == "")
                {
                    message.channel.send("<@" + message.author.id + "> No image found, , use `" + commandPrefix + "help fail` for help.").catch(error => {console.log("Send Error - " + error); });
                    
                    return;
                }
                message.channel.send("***taking image***").catch(error => {console.log("Send Error - " + error); });
                Jimp.read("fail.png").then(function (FImage) {
                    console.log("got image");
                    Jimp.read(url).then(function (userImage) {
                        console.log("got avatar");
                        
                        var x = 250
                        var y = 20

                        userImage.cover(160, 240)                         
                        
        
                        var mergedImage = new Jimp(FImage.bitmap.width, FImage.bitmap.height).composite(userImage, x, y ).composite(FImage, 0, 0);
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("**I have failed you**", {
                                files: [file]
                            }).then(function(){
                                
                                fs.unlink(file, resultHandler);
                            }).catch(function (err) {
                                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                console.log(err.message);
                                
                                fs.unlink(file, resultHandler);
                            });
                            console.log("Message Sent");
                        });
                    }).catch(function (err) {
                        message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                        console.log(err.message);
                        
                    });
                }).catch(function (err) {
                    console.log(err.message);
                    
                });
            }).catch(function (err) {
                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                console.log(err.message);
                
            });
        }
        else if(args.toString().toLowerCase() == "avatar" || otherUser)
        {
            var promises = []
            if(otherUser)
            {
                console.log("other Fail");
                console.log(userID);
    
                promises.push(message.channel.client.fetchUser(userID)
                 .then(user => {
                     if(user.avatarURL != undefined && user.avatarURL != null)
                        url = user.avatarURL;
                    else
                        url = "no user"
                 }, rejection => {
                        console.log(rejection.message);
                        url = "no user";
                 }))
            }
            else
            {
                console.log("self Fail");
                userID = message.author.id;
                url = message.author.avatarURL;
            }

            Promise.all(promises).then(() => {
    Jimp.read("fail.png").then(function (FImage) {
                    console.log("got image");
                    
                    Jimp.read(url).then(function (userImage) {
                        console.log("got avatar");
                        
                        var x = 250
                        var y = 20

                        userImage.cover(160, 240)                        
                        
        
                        var mergedImage = new Jimp(FImage.bitmap.width, FImage.bitmap.height).composite(userImage, x, y ).composite(FImage, 0, 0);
                        var file = shortid.generate() + ".png"
                        mergedImage.write(file, function(error){
                            if(error) { console.log(error); return;};
                            console.log("got merged image");
                            console.log(file);
                            message.channel.send("**I have failed you** <@" + userID + ">", {
                                files: [file]
                            }).then(function(){
                                
                                fs.unlink(file, resultHandler);
                            }).catch(function (err) {
                                message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                                console.log(err.message);
                                
                                fs.unlink(file, resultHandler);
                            });
                            console.log("Message Sent");
                        });
                    }).catch(function (err) {
                        if(url == "no user")
                        {
                            message.channel.send("<@" + message.author.id + "> No avatar found.").catch(error => {console.log("Send Error - " + error); });
                        }
                        else
                            message.channel.send("Error - " + err.message).catch(error => {console.log("Send Error - " + error); });
                        console.log(err.message);
                        
                    });
                }).catch(function (err) {
                    console.log(err.message);
                    
                });
            }).catch((e) => {
                console.log("User Data Error - " + e.message);
                message.channel.send("User data not found").catch(error => console.log("Send Error - " + error));
            });
        }
    }
}

module.exports = FailCommand;
