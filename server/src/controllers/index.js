const { User, Task, UserTask } = require('../models');

module.exports = {
    // ========== GESTION DES UTILISATEURS ==========
    
    // Créer un utilisateur
    createUser: async (req, res) => {
        try {
            const { first_name, last_name, age } = req.body;
            
            if (!first_name || !last_name || !age) {
                return res.status(400).json({ 
                    error: "Tous les champs sont requis (first_name, last_name, age)" 
                });
            }

            const user = await User.create({
                first_name,
                last_name,
                age: parseInt(age)
            });

            res.status(201).json({
                message: "Utilisateur créé avec succès",
                user: user
            });
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur' });
        }
    },

    // Récupérer tous les utilisateurs
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                include: [{
                    model: Task,
                    as: 'tasks',
                    through: { attributes: [] }
                }]
            });

            res.status(200).json({
                message: "Utilisateurs récupérés avec succès",
                users: users
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs' });
        }
    },

    // Récupérer un utilisateur par ID
    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const user = await User.findByPk(id, {
                include: [{
                    model: Task,
                    as: 'tasks',
                    through: { attributes: [] }
                }]
            });

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            res.status(200).json({
                message: "Utilisateur récupéré avec succès",
                user: user
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'utilisateur' });
        }
    },

    // Mettre à jour un utilisateur
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { first_name, last_name, age } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            await user.update({
                first_name: first_name || user.first_name,
                last_name: last_name || user.last_name,
                age: age ? parseInt(age) : user.age
            });

            res.status(200).json({
                message: "Utilisateur mis à jour avec succès",
                user: user
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'utilisateur' });
        }
    },

    // Supprimer un utilisateur
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Supprimer les associations avec les tâches
            await UserTask.destroy({ where: { user_id: id } });
            
            // Supprimer l'utilisateur
            await user.destroy();

            res.status(200).json({
                message: "Utilisateur supprimé avec succès"
            });
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'utilisateur' });
        }
    },

    // ========== GESTION DES TÂCHES ==========

    // Créer une tâche
    createTask: async (req, res) => {
        try {
            const { name, description, due_date } = req.body;
            
            if (!name) {
                return res.status(400).json({ 
                    error: "Le nom de la tâche est requis" 
                });
            }

            const task = await Task.create({
                name,
                description: description || null,
                due_date: due_date ? new Date(due_date) : null
            });

            res.status(201).json({
                message: "Tâche créée avec succès",
                task: task
            });
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la création de la tâche' });
        }
    },

    // Récupérer toutes les tâches
    getAllTasks: async (req, res) => {
        try {
            const tasks = await Task.findAll({
                include: [{
                    model: User,
                    as: 'users',
                    through: { attributes: [] }
                }]
            });

            res.status(200).json({
                message: "Tâches récupérées avec succès",
                tasks: tasks
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des tâches:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches' });
        }
    },

    // Récupérer une tâche par ID
    getTaskById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const task = await Task.findByPk(id, {
                include: [{
                    model: User,
                    as: 'users',
                    through: { attributes: [] }
                }]
            });

            if (!task) {
                return res.status(404).json({ error: 'Tâche non trouvée' });
            }

            res.status(200).json({
                message: "Tâche récupérée avec succès",
                task: task
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de la tâche:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la récupération de la tâche' });
        }
    },

    // Mettre à jour une tâche
    updateTask: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, due_date } = req.body;

            const task = await Task.findByPk(id);
            if (!task) {
                return res.status(404).json({ error: 'Tâche non trouvée' });
            }

            await task.update({
                name: name || task.name,
                description: description !== undefined ? description : task.description,
                due_date: due_date ? new Date(due_date) : task.due_date
            });

            res.status(200).json({
                message: "Tâche mise à jour avec succès",
                task: task
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la tâche' });
        }
    },

    // Supprimer une tâche
    deleteTask: async (req, res) => {
        try {
            const { id } = req.params;

            const task = await Task.findByPk(id);
            if (!task) {
                return res.status(404).json({ error: 'Tâche non trouvée' });
            }

            // Supprimer les associations avec les utilisateurs
            await UserTask.destroy({ where: { task_id: id } });
            
            // Supprimer la tâche
            await task.destroy();

            res.status(200).json({
                message: "Tâche supprimée avec succès"
            });
        } catch (error) {
            console.error('Erreur lors de la suppression de la tâche:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la suppression de la tâche' });
        }
    },

    // ========== GESTION DES ASSOCIATIONS ==========

    // Assigner une tâche à un utilisateur
    assignTaskToUser: async (req, res) => {
        try {
            const { userId, taskId } = req.body;

            if (!userId || !taskId) {
                return res.status(400).json({ 
                    error: "userId et taskId sont requis" 
                });
            }

            // Vérifier que l'utilisateur et la tâche existent
            const user = await User.findByPk(userId);
            const task = await Task.findByPk(taskId);

            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            if (!task) {
                return res.status(404).json({ error: 'Tâche non trouvée' });
            }

            // Vérifier si l'association existe déjà
            const existingAssociation = await UserTask.findOne({
                where: { user_id: userId, task_id: taskId }
            });

            if (existingAssociation) {
                return res.status(400).json({ error: 'Cette tâche est déjà assignée à cet utilisateur' });
            }

            // Créer l'association
            await UserTask.create({
                user_id: userId,
                task_id: taskId
            });

            res.status(201).json({
                message: "Tâche assignée à l'utilisateur avec succès"
            });
        } catch (error) {
            console.error('Erreur lors de l\'assignation de la tâche:', error);
            res.status(500).json({ error: 'Erreur serveur lors de l\'assignation de la tâche' });
        }
    },

    // Désassigner une tâche d'un utilisateur
    unassignTaskFromUser: async (req, res) => {
        try {
            const { userId, taskId } = req.body;

            if (!userId || !taskId) {
                return res.status(400).json({ 
                    error: "userId et taskId sont requis" 
                });
            }

            const deleted = await UserTask.destroy({
                where: { user_id: userId, task_id: taskId }
            });

            if (deleted === 0) {
                return res.status(404).json({ error: 'Association non trouvée' });
            }

            res.status(200).json({
                message: "Tâche désassignée de l'utilisateur avec succès"
            });
        } catch (error) {
            console.error('Erreur lors de la désassignation de la tâche:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la désassignation de la tâche' });
        }
    }
};