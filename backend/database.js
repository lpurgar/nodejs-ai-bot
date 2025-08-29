const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './database.sqlite',
//   logging: false,
//   sync: true
// });

const sequelize = new Sequelize("mydb", "user", "pass", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false,
});

module.exports = sequelize;