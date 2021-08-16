import { getRepository } from 'typeorm';
import { discordClient } from '..';
import { DiscordChannelsEntity } from '../../entities/discord-channels.entity';
import { discordChannels } from '../channels';
import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addchannel')
        .setDescription('Register a new channel that can be used for Twitter streams.')
        .addStringOption((option: SlashCommandStringOption) => option.setName('alias').setDescription('Name of channel / alias.'))
        .addStringOption((option: SlashCommandStringOption) => option.setName('channelid').setDescription('ID of the channel.')),
    async execute(interaction: CommandInteraction): Promise<void> {
        const alias = interaction.options.getString('alias');
        if (!alias) {
            return await interaction.reply({ content: 'No alias was provided.', ephemeral: true });
        }

        const channelId = interaction.options.getString('channelid');
        if (!channelId) {
            return await interaction.reply({ content: 'No channel Id provided.', ephemeral: true });
        }

        const validateChannel = await discordClient.client.channels.fetch(`${channelId}`);
        if (!validateChannel) {
            return await interaction.reply({ content: 'Channel not found.', ephemeral: true });
        }

        if (!validateChannel.isText()) {
            return await interaction.reply({ content: 'Text based channels only.', ephemeral: true });
        }

        const exists = discordChannels.channels.find((c) => String(c.channel_id) === channelId);
        if (exists) {
            return await interaction.reply({ content: 'Already a registered channel.', ephemeral: true });
        }

        const added = await getRepository(DiscordChannelsEntity).insert({
            alias: alias,
            channel_id: BigInt(channelId),
        });

        if (!added) {
            return await interaction.reply({ content: `Database error occurred.`, ephemeral: true });
        }

        await discordChannels.reloadChannels();
        await interaction.reply(`Added channel ${alias} as Id ${added.raw.insertId} :white_check_mark:`);
    },
};
