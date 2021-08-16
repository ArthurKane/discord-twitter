import { getRepository } from 'typeorm';
import { TwitterStreamersEntity } from '../../entities/twitter-streamers.entity';
import { twitterStreamers } from '../../twitter/streamers';
import { discordChannels } from '../channels';
import { SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setstreamchannel')
        .setDescription('Set which channel a new Tweet goes to for specific handle.')
        .addStringOption((option: SlashCommandStringOption) => option.setName('handle').setDescription('Their Twitter @ screen name.'))
        .addIntegerOption((option: SlashCommandIntegerOption) => option.setName('channel').setDescription('Registered channel index, not the channel ID.')),
    async execute(interaction: CommandInteraction): Promise<void> {
        const handle = interaction.options.getString('handle');
        if (!handle) {
            return await interaction.reply({ content: 'Handle not specified.', ephemeral: true });
        }
        const streamer = twitterStreamers.streamers.find((s) => s.handle === handle);
        if (!streamer) {
            return await interaction.reply({ content: 'Handle not found.', ephemeral: true });
        }

        const channelId = interaction.options.getInteger('channel');
        if (!channelId) {
            return await interaction.reply({ content: 'Channel not specified.', ephemeral: true });
        }
        const channel = discordChannels.channels.find((c) => c.id === channelId);
        if (!channel) {
            return await interaction.reply({ content: 'Channel not found.', ephemeral: true });
        }

        await getRepository(TwitterStreamersEntity).update(streamer.id, {
            discord_channel: channelId,
        });

        await twitterStreamers.reloadStreamers();
        await interaction.reply(`Set @${streamer.handle} to be sent to channel ${channel.alias} :white_check_mark:`);
    },
};
