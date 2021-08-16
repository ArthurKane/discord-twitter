import { getRepository } from 'typeorm';
import { TwitterStreamersEntity } from '../entities/twitter-streamers.entity';
import { Tweeter } from './tweeter';

export class TwitterStreamers {
    streamers: TwitterStreamersEntity[] = [];
    async init(): Promise<void> {
        this.streamers = await getRepository(TwitterStreamersEntity)
            .createQueryBuilder('streamers')
            .leftJoinAndSelect('streamers.channel', 'channel')
            .getMany();

        console.log(`[Twitter Streamers] `.yellow + `Found streamers! `.green + `[${this.streamers.map((s) => s.handle).join(', ')}]`.white);

        for (const streamer of this.streamers) {
            await streamer.channel?.getChannel();
            streamer.tweeter = new Tweeter(streamer);
        }
    }

    async reloadStreamers(): Promise<void> {
        this.streamers.forEach((s) => {
            s.tweeter?.stopWatch();
            delete s.tweeter;
        });

        this.streamers = [];
        await this.init();
    }
}

export const twitterStreamers = new TwitterStreamers();
