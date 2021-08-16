import * as colors from 'colors';
import { databaseSystem } from './database';
import { discordClient } from './discord';
import { discordChannels } from './discord/channels';
import { discordCommands } from './discord/commands';
import { twitterClient } from './twitter';
import { twitterStreamers } from './twitter/streamers';
import { config } from 'dotenv';

config();
colors.enable();

(async () => {
    await databaseSystem.init();
    await discordClient.init();
    await discordChannels.init();
    await twitterClient.init();
    await twitterStreamers.init();
    await discordCommands.init();
    console.log(`Started successfully! `.green + `Node.js ${process.version}`);
})();
