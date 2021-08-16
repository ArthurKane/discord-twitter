import { Collection, CommandInteractionOption, Interaction } from 'discord.js';
import { discordClient } from '.';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';
import { config } from '../config';

export class DiscordCommands {
    commands: CommandInteractionOption[] = [];
    commandsExec = new Collection();

    constructor() {
        discordClient.client.on('interactionCreate', this.commandReceived.bind(this));
    }

    async init(): Promise<void> {
        const commandFiles = fs.readdirSync(__dirname + '/commands/').filter((file) => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = await import(__dirname + `/commands/${file}`);
            this.commands.push(command.data.toJSON());
            this.commandsExec.set(command.data.name, command);
        }

        //@ts-ignore
        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
        try {
            await rest.put(Routes.applicationGuildCommands(config.botClientId, config.guildId), { body: this.commands });

            console.log('[Discord Commands] '.yellow + 'Loaded commands.'.green);
        } catch (error) {
            console.log('[Discord Commands] '.yellow + 'Failed to load commands. Error: '.red + error);
        }
    }

    async commandReceived(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) {
            return;
        }

        const { commandName } = interaction;

        if (!this.commandsExec.has(commandName)) {
            return;
        }

        try {
            //@ts-ignore
            await this.commandsExec.get(commandName).execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}

export const discordCommands = new DiscordCommands();
