const { Sequelize, DataTypes } = require('sequelize');

// Configuration de la base de données
const sequelize = new Sequelize(
    process.env.DB_NAME || 'taskdb',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'test',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3307,
        dialect: 'mysql',
        logging: false
    }
);

// Modèle User
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false
});

// Modèle Task
const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'tasks',
    timestamps: false
});

// Modèle UserTask (table de liaison)
const UserTask = sequelize.define('UserTask', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    task_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Task,
            key: 'id'
        }
    }
}, {
    tableName: 'user_tasks',
    timestamps: false
});

// Définition des associations
User.belongsToMany(Task, { through: UserTask, foreignKey: 'user_id', as: 'tasks' });
Task.belongsToMany(User, { through: UserTask, foreignKey: 'task_id', as: 'users' });

module.exports = {
    sequelize,
    User,
    Task,
    UserTask
};