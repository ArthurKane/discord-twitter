import { getRepository } from 'typeorm';
import { DiscordChannelsEntity } from '../entities/discord-channels.entity';
import { twitterStreamers } from '../twitter/streamers';

export class DiscordChannels {
    channels: DiscordChannelsEntity[] = [];

    async init(): Promise<void> {
        this.channels = await getRepository(DiscordChannelsEntity).find();

        console.log('[Discord Channels] '.yellow + `Found ${this.channels.length} channels.`.green);
    }

    async reloadChannels(): Promise<void> {
        this.channels = [];
        await this.init();
        await twitterStreamers.reloadStreamers();
    }
}

export const discordChannels = new DiscordChannels();
