process.env.HOST = 'http://134.249.164.53:8091/';
process.env.DB_HOST = 'localhost';
process.env.PORT = 9797;

module.exports = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    //replset: { rs_name: 'myReplicaSetName' },
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    w: 'majority',
    j: true,
    mongos: true
};