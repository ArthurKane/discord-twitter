import { getRepository } from 'typeorm';
import { TwitterStreamersEntity } from '../../entities/twitter-streamers.entity';
import { twitterStreamers } from '../../twitter/streamers';
import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandIntegerOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { discordChannels } from '../channels';
import { isEmpty } from 'lodash';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addstreamer')
        .setDescription('Add a new Twitter account to stream.')
        .addStringOption((option: SlashCommandStringOption) => option.setName('handle').setDescription('Their Twitter @ screen name.'))
        .addIntegerOption((option: SlashCommandIntegerOption) => option.setName('rate').setDescription('Rate in minutes. How often we check for new tweets.'))
        .addIntegerOption((option: SlashCommandIntegerOption) =>
            option.setName('channelid').setDescription('Channel their Tweets will be sent to. /channels for IDs.'),
        ),
    async execute(interaction: CommandInteraction): Promise<void> {
        if (isEmpty(discordChannels.channels)) {
            return await interaction.reply({ content: 'You need to add a channel for streaming first.', ephemeral: true });
        }

        const handle = interaction.options.getString('handle');
        if (!handle) {
            return await interaction.reply({ content: 'No handle was provided.', ephemeral: true });
        }

        if (handle.startsWith('@')) {
            return await interaction.reply({ content: `Don't include a @ with the handle.`, ephemeral: true });
        }

        const rate = interaction.options.getInteger('rate');
        if (!rate || rate < 1) {
            return await interaction.reply({ content: 'Rate has to be at least 1 minute.', ephemeral: true });
        }

        const exists = twitterStreamers.streamers.find((s) => s.handle === handle);
        if (exists) {
            return await interaction.reply({ content: `@${handle} is already a Twitter streamer.`, ephemeral: true });
        }

        const channelId = interaction.options.getInteger('channelid');
        if (!channelId) {
            return await interaction.reply({ content: 'Channel not specified.', ephemeral: true });
        }
        const channel = discordChannels.channels.find((c) => c.id === channelId);
        if (!channel) {
            return await interaction.reply({ content: 'Channel not found.', ephemeral: true });
        }

        const added = await getRepository(TwitterStreamersEntity).insert({
            handle: handle,
            discord_channel: channelId,
            rate: rate,
        });

        if (!added) {
            return await interaction.reply({ content: `Database error occurred.`, ephemeral: true });
        }

        await twitterStreamers.reloadStreamers();
        await interaction.reply(`Added https://twitter.com/${handle} :white_check_mark: ` + 'Use `/setstreamchannel` to change where the Tweets go.');
    },
};
