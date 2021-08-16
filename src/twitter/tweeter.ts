//@ts-nocheck
import { twitterClient } from '.';
import { TwitterStreamersEntity } from '../entities/twitter-streamers.entity';
import { isEmpty, isEqual } from 'lodash';

export class Tweeter {
    interval: NodeJS.Timeout | null;
    streamer: TwitterStreamersEntity;
    rate: number;
    tweetsSentAlready: [];
    currentTweets: [];

    constructor(streamer: TwitterStreamersEntity) {
        this.streamer = streamer;
        this.rate = streamer.rate * 60000;
        this.tweetsSentAlready = [];
        this.currentTweets = [];
        twitterClient.client!.get('statuses/user_timeline', { screen_name: streamer.handle, count: 10 }, this.fetchTimeline.bind(this));
    }

    fetchTimeline(error, data): void {
        for (let i = 0; i < data.length; i++) {
            if (!isEmpty[data[i]]) {
                this.tweetsSentAlready.push(data[i].id);
                this.currentTweets.push(data[i].id);
            }
        }

        console.log('[Tweeter] '.yellow + `Started watching @${this.streamer.handle} timeline`.cyan.bgBlack);
        this.startWatch();
    }

    updateTweetList(data): void {
        this.currentTweets = [];
        for (let i = 0; i < data.length; i++) {
            if (!isEmpty(data[i])) {
                this.currentTweets.push(data[i].id);
            }
        }
    }

    startWatch(): void {
        const _this = this;
        this.interval = setInterval(() => {
            twitterClient.client!.get('statuses/user_timeline', { screen_name: _this.streamer.handle, count: 10 }, function (error, data) {
                const newDataIDs = [];

                for (let i = 0; i < data.length; i++) {
                    if (!isEmpty(data[i])) {
                        newDataIDs.push(data[i].id);
                    }
                }

                if (!isEqual(_this.currentTweets, newDataIDs)) {
                    if (isEmpty(data)) {
                        _this.updateTweetList(data);
                        return;
                    }

                    for (let i = data.length; i > -1; i--) {
                        if (isEmpty(data[i])) {
                            continue;
                        }
                        if (!_this.tweetsSentAlready.includes(data[i].id)) {
                            _this.streamer.channel.onNewTweet(_this.streamer.handle, data[i]);
                            _this.tweetsSentAlready.push(data[i].id);
                        }
                    }

                    _this.updateTweetList(data);
                } else {
                    // No New Tweet
                }
            });
        }, _this.rate);
    }

    stopWatch(): void {
        clearInterval(this.interval);
        this.interval = null;
    }
}
