import * as Discord from 'discord.js';
import { discordChannels } from '../channels';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder().setName('channels').setDescription('List of registered channels for Twitter streaming.'),
    async execute(interaction: CommandInteraction): Promise<void> {
        const fields: {
            name: string;
            value: string;
            inline: true;
        }[] = [];

        discordChannels.channels.forEach((c) => {
            fields.push({
                name: c.alias,
                value: `ID: ${c.id}, Channel_ID: ${c.channel_id}`,
                inline: true,
            });
        });

        const embedded = new Discord.MessageEmbed()
            .setFooter(`Discord-Twitter`, 'https://image.flaticon.com/icons/png/512/124/124021.png')
            .setColor(0x7289da)
            .setURL('https://twitter.com')
            .setAuthor('Brought to you by ArthurKane', 'https://avatars.githubusercontent.com/u/7927869?v=4', 'https://github.com/ArthurKane')
            .setTitle('List of current channels:')
            .addFields(fields);

        await interaction.reply({ embeds: [embedded] });
    },
};
