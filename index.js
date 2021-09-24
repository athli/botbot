const fs = require('fs');
const Discord = require('discord.js');
// const config = require('./config.json');
const nightbot_id = "83010416610906112";

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command); 
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    });

client.on('message', msg => {
    // define args
    // define command
    var args;
    var command;

    if (msg.author.id === nightbot_id) {
        if (msg.content.includes("Congrats on winning absolutely nothing")) {
            args = true;
            command = "update_slots_lb";
        } else if (msg.content.includes("traffic light POGGERS")) {
            args = true;
            command = "update_traffic_lb";
        } else if (msg.content.includes(`You won ${/\d+/} points!`)) {
            args = true;
            command = "update_roulette_lb";
        } else {
            args = msg.content.slice(process.env.PREFIX.length).trim().split(/ +/);
            command = args.shift().toLowerCase();
        }
    }
    
    if (!client.commands.has(command)) {
        return;
    }

    try {
        client.commands.get(command).execute(msg,args);
    } catch (err) {
        console.error(err);
        msg.reply("oops, ping merpmerp");
    }

    if (msg.content == "derpbot, please") {
        msg.reply(":|");
        client.channels.get("825918595904438342").send("<@!505170018556706817> 26" + \n +
                                                       "<@!691804974719434822> 14" + \n + 
                                                       "<@!613719483051409419> 10" + \n +
                                                       "<@!716993756343042078> 10");
        msg.reply("i did it maybe");
    }

    });

client.login(process.env.TOKEN);
