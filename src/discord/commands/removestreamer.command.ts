import { getRepository } from 'typeorm';
import { TwitterStreamersEntity } from '../../entities/twitter-streamers.entity';
import { twitterStreamers } from '../../twitter/streamers';
import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removestreamer')
        .setDescription('Remove Twitter account from stream.')
        .addStringOption((option: SlashCommandStringOption) => option.setName('handle').setDescription('Their Twitter @ screen name.')),
    async execute(interaction: CommandInteraction): Promise<void> {
        const handle = interaction.options.getString('handle');
        if (!handle) {
            return await interaction.reply({ content: 'No handle was provided.', ephemeral: true });
        }

        if (handle.startsWith('@')) {
            return await interaction.reply({ content: `Don't include a @ with the handle.`, ephemeral: true });
        }

        const exists = twitterStreamers.streamers.find((s) => s.handle === handle);
        if (!exists) {
            return await interaction.reply({ content: `@${handle} isn't being streamed.`, ephemeral: true });
        }

        await getRepository(TwitterStreamersEntity).delete({ id: exists.id });
        await twitterStreamers.reloadStreamers();
        await interaction.reply(`Removed https://twitter.com/${handle} :white_check_mark:`);
    },
};
