const express = require('express');
const router = express.Router();
const taskController = require('../controllers/index');

// ========== ROUTES POUR LES UTILISATEURS ==========
router.get('/users', taskController.getAllUsers);
router.get('/users/:id', taskController.getUserById);
router.post('/users', taskController.createUser);
router.put('/users/:id', taskController.updateUser);
router.delete('/users/:id', taskController.deleteUser);

// ========== ROUTES POUR LES TÂCHES ==========
router.get('/tasks', taskController.getAllTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// ========== ROUTES POUR LES ASSOCIATIONS ==========
router.post('/assign-task', taskController.assignTaskToUser);
router.delete('/unassign-task', taskController.unassignTaskFromUser);

module.exports = router;