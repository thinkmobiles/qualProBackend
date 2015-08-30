
process.env.DB_HOST = 'localhost';

process.env.HOST = 'http://localhost:9797';
process.env.PORT = 9797;
//process.env.DB_USER = "user";
//process.env.DB_PASS = "1q2w3e!@#";
process.env.DB_NAME = "qualPro";
process.env.DB_PORT = 27017;

exports.mongoConfig = {
    db: {
        native_parser: false
    },
    server: { poolSize: 5 },
    //replset: { rs_name: 'myReplicaSetName' },
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    w: 1,
    j: true,
    mongos: false
};

exports.sessionConfig = {
    db: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    resave: false,
    saveUninitialized: false,
    reapInterval: 500000
};