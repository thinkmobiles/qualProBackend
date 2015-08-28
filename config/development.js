
process.env.DB_HOST = 'localhost';

process.env.HOST = 'http://localhost/';
process.env.PORT = 9797;
//process.env.DB_USER = "user";
//process.env.DB_PASS = "1q2w3e!@#";
process.env.DB_NAME = "qualPro";
process.env.DB_PORT = 27017;

exports.mongoConfig = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    //replset: { rs_name: 'myReplicaSetName' },
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    w: 1,
    j: true,
    mongos: false
};

exports.sessionConfig = {
    name: 'qualPro_main',
    key: "qualPro_main",
    secret: 'gE7FkGtEdF32d4f6h8j0jge4547hTThGFyJHPkJkjkGH7JUUIkj0HKh',
    resave: false,
    saveUninitialized: false
};