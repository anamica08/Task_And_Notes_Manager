const Sequelize = require('sequelize');


/**
 * Connector to sqlite
 */
const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/data.db'
});



/**
 * @Definition
 * Model : Note 
 */
const Note = db.define('note', {
    note_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: Sequelize.STRING(500),
        allowNull: false
    }
});


/**
 * @Definition
 * Model : Task 
 */
const Task = db.define('task', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    description: {
        type: Sequelize.STRING(500),
        allowNull: true

    },
    status: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'incomplete'
    },
    dueDate: {
        type: Sequelize.DATEONLY
    },
    priority: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'medium'
    }
});


/**One task has many notes. This will add taskid to each note */
Task.hasMany(Note)






module.exports = {
    db,
    Task,
    Note
}