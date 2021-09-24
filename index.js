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

    });

client.login(process.env.TOKEN);
