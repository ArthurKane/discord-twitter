import { TextChannel } from 'discord.js';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { discordClient } from '../discord';
import * as Discord from 'discord.js';

@Entity('discord-channels')
export class DiscordChannelsEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'bigint' }) channel_id: bigint;
    @Column({ type: 'varchar', length: 30, nullable: true }) alias: string;

    channel: TextChannel;

    async getChannel(): Promise<TextChannel> {
        this.channel = (await discordClient.client.channels.fetch(`${this.channel_id}`)) as TextChannel;
        return this.channel;
    }

    async onNewTweet(handle: string, tweet: any): Promise<void> {
        const embedded = new Discord.MessageEmbed()
            .setFooter(`${tweet.created_at}`, 'https://image.flaticon.com/icons/png/512/124/124021.png')
            .setColor(0x7289da)
            .setTitle(tweet.text.replace('&amp;', '&'))
            .setURL(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
            .setAuthor(
                `${tweet.user.name} (@${tweet.user.screen_name})`,
                `${tweet.user.profile_image_url}`,
                `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
            )
            .addFields(
                { name: 'Followers', value: `${tweet.user.followers_count}`, inline: true },
                { name: 'Retweets', value: `${tweet.retweet_count}`, inline: true },
            );

        try {
            await this.channel.send({
                embeds: [embedded],
            });
        } catch (error) {
            console.log('[New Tweet] '.yellow + 'Failed to send tweet, error: '.red + error);
        }
    }
}
