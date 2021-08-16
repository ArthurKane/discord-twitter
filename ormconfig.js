module.exports = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: '',
    password: '',
    database: 'discord',
    entities: [__dirname + '/build/entities/*.js'],
    logging: ['error', 'warn'],
    logger: "advanced-console",
    maxQueryExecutionTime: 10000
};
