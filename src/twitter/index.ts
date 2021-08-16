const Twitter = require('twit');

export class TwitterClient {
    client = Twitter;

    init(): void {
        try {
            this.client = new Twitter({
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token: process.env.TWITTER_ACCESS_TOKEN,
                access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
            });
            console.log('[Twitter Client] '.yellow + 'Twitter handle created.'.green);
        } catch (error) {
            console.log('[Twitter Client] '.yellow + 'Twitter handle creation failed. Error: '.red + error);
            process.exit(1);
        }
    }
}

export const twitterClient = new TwitterClient();
