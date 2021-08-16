import { Client, Intents } from 'discord.js';
import { delay } from '../util';

export class DiscordClient {
    client: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    clientReady = false;

    constructor() {
        this.client.once('ready', this.ready.bind(this));
    }

    async init(): Promise<void> {
        try {
            await this.client.login(process.env.DISCORD_TOKEN);
            let readyTries = 0;
            while (!this.clientReady) {
                await delay(500);
                readyTries++;
                if (readyTries >= 5) {
                    console.log('[Discord] '.yellow + 'Client still not ready after 5 tries.'.red);
                    process.exit(1);
                }
            }
        } catch (error) {
            console.log('[Discord] '.yellow + 'Client failed to login. Error: '.red + `${error}`.white);
            process.exit(1);
        }
    }

    ready(): void {
        this.clientReady = true;
        console.log('[Discord] '.yellow + 'Client is ready.'.green);
    }
}

export const discordClient = new DiscordClient();
