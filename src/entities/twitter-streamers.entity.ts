import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tweeter } from '../twitter/tweeter';
import { DiscordChannelsEntity } from './discord-channels.entity';

@Entity('twitter-streamers')
export class TwitterStreamersEntity {
    @PrimaryGeneratedColumn() id: number;
    @Column({ type: 'varchar', nullable: false, length: 30 }) handle: string;
    @Column({ type: 'int', nullable: false, default: 1 }) rate: number;
    @Column({ type: 'int', nullable: false }) discord_channel: number;

    @OneToOne(() => DiscordChannelsEntity)
    @JoinColumn({
        name: 'discord_channel',
        referencedColumnName: 'id',
    })
    channel?: DiscordChannelsEntity;
    tweeter: Tweeter | undefined;
}
