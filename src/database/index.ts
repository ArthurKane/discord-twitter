import { Connection, createConnection } from 'typeorm';

export class DatabaseSystem {
    connection?: Connection | void;
    attempts = 0;

    async init(): Promise<void> {
        do {
            try {
                if (this.connection) {
                    await this.connection.connect();
                } else {
                    this.connection = await createConnection();
                }
            } catch (error) {
                if (this.attempts < 5) {
                    console.error(`[Database] `.yellow + `Connection unsuccessful, retrying ...`, error);
                    this.attempts++;
                } else {
                    console.error(`[Database] `.yellow + `Connection unsuccessful`, error);
                    process.exit();
                }
            }
        } while (!this.connection);

        console.log(`[Database] `.yellow + `Connection successful`.green);
    }
}

export const databaseSystem = new DatabaseSystem();
