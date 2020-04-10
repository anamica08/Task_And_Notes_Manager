const Sequelize = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/data.db'
});
/**
 * Title
o	Description
o	Due Date
o	Status: incomplete / completed
o	Priority: High / Medium / Low
•	Each task can have notes added to it as well
o	One task can have multiple notes under it
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