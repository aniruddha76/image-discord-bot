import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from "dotenv";
dotenv.config();

import run from "./images.js";

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('feed')){
        try {
            const imageUrl = await run();
            imageUrl.forEach((item) => {
                message.reply({
                    content: item
                });
            })
        } catch (error) {
            console.error('Error fetching image:', error);
            message.reply({
                content: 'An error occurred while fetching the image.',
            });
        }
    } else {
        message.reply({
            content: 'Hi From bot',
        });
    }
});

client.on('interactionCreate', interaction => {
    // console.log(interaction)
    interaction.reply("Pong!!")
});

client.login(process.env.BOT_TOKEN)