const Discord = require("discord.js");
const bot = new Discord.Client();
const ytdl = require("ytdl-core");
const PREFIX = "!";
var servers = {};

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

var musicURL = [];
//bot.registry.registerDefaults();
//bot.registry.registerCommandsIn(__dirname + "/commands");
var fightSong = "";
var townSong = "";
var victorySong = "";
var dangerSong = "";
bot.on("message", message => {
  let args = message.content.substring(PREFIX.length).split(" ");
  let setUrl = args[1];


  switch (args[0]) {
    case "play":

      function play(connection, message) {
        var server = servers[message.guild.id];

        server.dispatcher = connection.play(ytdl(server.queue[0], { filter: "audioonly" })
        );

        server.queue.shift();

        server.dispatcher.on("end", function () {
          if (server.queue[0]) {
            play(connection, message);
          } else {
            connection.disconnect();
          }
        });
      }
      if (!args[1]) {
        message.channel.send("Provide a link.");
        return;
      }
      if (!message.member.voice.channel) {
        message.channel.send("Need to be in a voice channel!");
        return;
      }

      if (!servers[message.guild.id])
        servers[message.guild.id] = {
          queue: []
        };

      var server = servers[message.guild.id];

      server.queue.push(args[1]);

      if (!message.member.voice.connection)
        message.member.voice.channel.join().then(function (connection) {
          play(connection, message);
          message.channel.send("Vibe time...");
        })


      break;

    case 'skip':
      var server = servers[message.guild.id];
      if (server.dispatcher) server.dispatcher.end();
      message.channel.send("skipping");
      break;

    case "stop":
      var server = servers[message.guild.id];
      if (message.guild.voice.connection) {
        for (var i = server.queue.length - 1; i >= 0; i--) {
          server.queue.splice(i, 1);
        }

        server.dispatcher.end();
        message.channel.send("Ending Queue Leaving VC");

      }
      if (message.guild.voice.connection) message.guild.voice.connection.disconnect();
      break;

    case "setfight":
      var server = servers[message.guild.id];

      message.channel.send("Set fight song to " + setUrl);
      fightSong = setUrl;

      if (!args[1]) {
        message.channel.send("Provide a link.");
        return;
      }
      if (!message.member.voice.channel) {
        message.channel.send("Need to be in a voice channel!");
        return;
      }
      break;
    case "fight":

      message.member.voice.channel.join().then(function (connection) {

        const stream = ytdl(fightSong, { filter: "audioonly" });
        const dispatcher = connection.play(stream);

        dispatcher.on('end', () => message.member.voice.channel.leave());
      });

      console.log("Going to play: " + fightSong);

      break;
    case "settown":
      var server = servers[message.guild.id];

      message.channel.send("Set town song to " + setUrl);
      townSong = setUrl;

      if (!args[1]) {
        message.channel.send("Provide a link.");
        return;
      }
      if (!message.member.voice.channel) {
        message.channel.send("Need to be in a voice channel!");
        return;
      }

      break;
    case "town":
      message.member.voice.channel.join().then(function (connection) {

        const stream = ytdl(townSong, { filter: "audioonly" });
        const dispatcher = connection.play(stream);

        dispatcher.on('end', () => message.member.voice.channel.leave());
      });

      console.log("Going to play: " + townSong);
      break;
    case "setdanger":
      var server = servers[message.guild.id];

      message.channel.send("Set danger song to " + setUrl);
      dangerSong = setUrl;

      if (!args[1]) {
        message.channel.send("Provide a link.");
        return;
      }
      if (!message.member.voice.channel) {
        message.channel.send("Need to be in a voice channel!");
        return;
      }
      break;
    case "danger":
      message.member.voice.channel.join().then(function (connection) {

        const stream = ytdl(dangerSong, { filter: "audioonly" });
        const dispatcher = connection.play(stream);

        dispatcher.on('end', () => message.member.voice.channel.leave());
      });

      break;
    case "setvictory":
      var server = servers[message.guild.id];

      message.channel.send("Set Victory song to " + setUrl);
      victorySong = setUrl;

      if (!args[1]) {
        message.channel.send("Provide a link.");
        return;
      }
      if (!message.member.voice.channel) {
        message.channel.send("Need to be in a voice channel!");
        return;
      }
      break;
    case "victory":
      message.member.voice.channel.join().then(function (connection) {

        const stream = ytdl(victorySong, { filter: "audioonly" });
        const dispatcher = connection.play(stream);

        dispatcher.on('end', () => message.member.voice.channel.leave());
      });

      break;
    case "clear":

      message.channel.bulkDelete(5);
      message.channel.send("Deleted " + 5 + " messages!")


      console.log("Trying to delete all messages");

      break;
    case "commands":
      message.channel.send("Commands are: !play, !skip, !stop, !clear, !town, !fight, !danger, !victory, !set...followed by (town, danger, victory, or fight). Ex: !settown");
      break;
  }
});


