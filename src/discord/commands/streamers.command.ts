import { twitterStreamers } from '../../twitter/streamers';
import * as Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder().setName('streamers').setDescription('List of Twitter accounts being streamed.'),
    async execute(interaction: CommandInteraction): Promise<void> {
        const fields: {
            name: string;
            value: string;
            inline: true;
        }[] = [];

        twitterStreamers.streamers.forEach((s) => {
            fields.push({
                name: s.handle,
                value: s.channel!.alias,
                inline: true,
            });
        });

        const embedded = new Discord.MessageEmbed()
            .setFooter(`Discord-Twitter`, 'https://image.flaticon.com/icons/png/512/124/124021.png')
            .setColor(0x7289da)
            .setURL('https://twitter.com')
            .setAuthor('Brought to you by ArthurKane', 'https://avatars.githubusercontent.com/u/7927869?v=4', 'https://github.com/ArthurKane')
            .setTitle('List of current Twitter streamed:')
            .addFields(fields);

        await interaction.reply({ embeds: [embedded] });
    },
};
