import { Client, GatewayIntentBits, Options } from 'discord.js';
import dotenv from "dotenv";
dotenv.config();

import run from "./images.js";
import getImages from './images2.js'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

import { setupCommands } from './commands.js';
setupCommands(client);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const sendingQueue = new Map();

let feedChannel;

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.channelId === feedChannel) {

        if (message.content.toLowerCase().startsWith('feed')) {
            try {
                let name;
                let lastName;
                let extraName;
                let imagesToSend = [];

                if(message.content.split(" ").length == 4) {
                    name = message.content.split(" ")[1];
                    lastName = message.content.split(" ")[2];
                    extraName = message.content.split(" ")[3]
                    imagesToSend = imagesToSend.concat(Array.from(await run(name + " " + lastName + " " + extraName)));
                    imagesToSend = imagesToSend.concat(Array.from(await getImages(name + " " + lastName + " " + extraName)));
                } else {
                    name = message.content.split(" ")[1];
                    lastName = message.content.split(" ")[2];
                    imagesToSend = imagesToSend.concat(Array.from(await run(name + " " + lastName)));
                    imagesToSend = imagesToSend.concat(Array.from(await getImages(name + " " + lastName)));
                }

                function shuffleArray(array) {
                array.sort(() => Math.random() - 0.5);
                return array;
                }

                shuffleArray(imagesToSend);

                let userId = message.author.id;
                sendingQueue.set(userId, imagesToSend);

                for (const item of imagesToSend) {
                    if (!sendingQueue.has(userId)) break;

                    message.reply({
                        content: item
                    });

                    await delay(13000)
                }
                sendingQueue.delete(userId);

            } catch (error) {
                console.error('Error fetching images:', error);
                message.reply({
                    content: 'An error occurred while fetching images.',
                });
            }
        } else if (message.content.toLowerCase() === 'stop') {
            sendingQueue.delete(message.author.id);
            message.reply({
                content: 'Feed stopped. Any more?',
            });
        } else if (message.content.includes('@1183025739474419823')) {
            message.reply({
                content: "Yes, I'm online and ready to feed!",
            });
        }
    }
});

client.on('interactionCreate', interaction => {
    let { commandName } = interaction

    if (commandName == "ping") {
        interaction.reply("Pong!!")

    } else if (commandName == "link") {
        let inviteLink = "https://discord.com/api/oauth2/authorize?client_id=1183025739474419823&permissions=8&scope=bot";
        interaction.reply(`${inviteLink}`)

    } else if (commandName == 'subscribe') {
        if (feedChannel == undefined) {

            let getChannel = interaction.options.get('channel');

            let option = getChannel.value;
            feedChannel = option;

            interaction.reply(`Successfully subscribed to: ${"<#" + feedChannel + ">"}`);

        } else {
            interaction.reply(`Cannot subscribe more than one channel!!\nsubscribed channel: ${"<#" + feedChannel + ">"}`)
        }

    } else if (commandName == 'unsubscribe') {
        interaction.reply(`Successfully unsubscribed: ${"<#" + feedChannel + ">"}`)
        feedChannel = undefined;
    }
});

client.login(process.env.BOT_TOKEN)