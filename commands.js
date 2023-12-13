import { REST, Routes } from 'discord.js';
import dotenv from "dotenv";
dotenv.config();

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'link',
    description: 'Get invite link'
  },
  {
    name: 'subscribe',
    description: 'subscribe a channel for feed',
    options: [
      {
        name: 'channel',
        description: 'Id of channel to subscribe',
        type: 7,
        required: true,
      }
    ]
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

async function setupCommands() {

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_TOKEN), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

export { setupCommands };