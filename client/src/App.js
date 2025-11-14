import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/App.css';

const API_BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001/api';

function App() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);

  // États pour les formulaires
  const [userForm, setUserForm] = useState({
    first_name: '',
    last_name: '',
    age: ''
  });
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    due_date: ''
  });
  const [assignForm, setAssignForm] = useState({
    userId: '',
    taskId: ''
  });

  // Charger les données au démarrage
  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  // ========== FONCTIONS API ==========
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      alert('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      alert('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/users`, userForm);
      setUserForm({ first_name: '', last_name: '', age: '' });
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      alert(error.response?.data?.error || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/tasks`, taskForm);
      setTaskForm({ name: '', description: '', due_date: '' });
      fetchTasks();
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      alert(error.response?.data?.error || 'Erreur lors de la création de la tâche');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        alert(error.response?.data?.error || 'Erreur lors de la suppression de l\'utilisateur');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
        fetchTasks();
      } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
        alert(error.response?.data?.error || 'Erreur lors de la suppression de la tâche');
      } finally {
        setLoading(false);
      }
    }
  };

  const assignTask = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/assign-task`, assignForm);
      setAssignForm({ userId: '', taskId: '' });
      fetchUsers();
      fetchTasks();
    } catch (error) {
      console.error('Erreur lors de l\'assignation:', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'assignation');
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER ==========
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Gestionnaire de Tâches</h1>
        <p>Gérez vos utilisateurs et leurs tâches facilement</p>
      </header>

      <div className="container">
        {/* Navigation */}
        <div className="tabs">
          <button 
            className={activeTab === 'users' ? 'tab active' : 'tab'} 
            onClick={() => setActiveTab('users')}
          >
            👥 Utilisateurs
          </button>
          <button 
            className={activeTab === 'tasks' ? 'tab active' : 'tab'} 
            onClick={() => setActiveTab('tasks')}
          >
            📝 Tâches
          </button>
          <button 
            className={activeTab === 'assign' ? 'tab active' : 'tab'} 
            onClick={() => setActiveTab('assign')}
          >
            🔗 Assigner
          </button>
        </div>

        {loading && <div className="loader">Chargement...</div>}

        {/* Section Utilisateurs */}
        {activeTab === 'users' && (
          <div className="section">
            <h2>Gestion des Utilisateurs</h2>
            
            {/* Formulaire de création d'utilisateur */}
            <div className="form-section">
              <h3>Ajouter un utilisateur</h3>
              <form onSubmit={createUser} className="form">
                <input
                  type="text"
                  placeholder="Prénom"
                  value={userForm.first_name}
                  onChange={(e) => setUserForm({...userForm, first_name: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Nom"
                  value={userForm.last_name}
                  onChange={(e) => setUserForm({...userForm, last_name: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Âge"
                  value={userForm.age}
                  onChange={(e) => setUserForm({...userForm, age: e.target.value})}
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  Ajouter Utilisateur
                </button>
              </form>
            </div>

            {/* Liste des utilisateurs */}
            <div className="list-section">
              <h3>Liste des utilisateurs ({users.length})</h3>
              <div className="cards">
                {users.map(user => (
                  <div key={user.id} className="card">
                    <div className="card-header">
                      <h4>{user.first_name} {user.last_name}</h4>
                      <span className="age-badge">{user.age} ans</span>
                    </div>
                    <div className="card-body">
                      <p><strong>Tâches assignées:</strong> {user.tasks?.length || 0}</p>
                      {user.tasks && user.tasks.length > 0 && (
                        <ul className="task-list">
                          {user.tasks.map(task => (
                            <li key={task.id}>{task.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="card-actions">
                      <button 
                        onClick={() => deleteUser(user.id)} 
                        className="btn btn-danger"
                        disabled={loading}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section Tâches */}
        {activeTab === 'tasks' && (
          <div className="section">
            <h2>Gestion des Tâches</h2>
            
            {/* Formulaire de création de tâche */}
            <div className="form-section">
              <h3>Ajouter une tâche</h3>
              <form onSubmit={createTask} className="form">
                <input
                  type="text"
                  placeholder="Nom de la tâche"
                  value={taskForm.name}
                  onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                  required
                />
                <textarea
                  placeholder="Description (optionnelle)"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                />
                <input
                  type="datetime-local"
                  placeholder="Date d'échéance"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  Ajouter Tâche
                </button>
              </form>
            </div>

            {/* Liste des tâches */}
            <div className="list-section">
              <h3>Liste des tâches ({tasks.length})</h3>
              <div className="cards">
                {tasks.map(task => (
                  <div key={task.id} className="card">
                    <div className="card-header">
                      <h4>{task.name}</h4>
                      {task.due_date && (
                        <span className="date-badge">
                          {new Date(task.due_date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                    <div className="card-body">
                      {task.description && <p>{task.description}</p>}
                      <p><strong>Assignée à:</strong> {task.users?.length || 0} utilisateur(s)</p>
                      {task.users && task.users.length > 0 && (
                        <ul className="user-list">
                          {task.users.map(user => (
                            <li key={user.id}>{user.first_name} {user.last_name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="card-actions">
                      <button 
                        onClick={() => deleteTask(task.id)} 
                        className="btn btn-danger"
                        disabled={loading}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section Assignation */}
        {activeTab === 'assign' && (
          <div className="section">
            <h2>Assigner des Tâches</h2>
            
            <div className="form-section">
              <h3>Assigner une tâche à un utilisateur</h3>
              <form onSubmit={assignTask} className="form">
                <select
                  value={assignForm.userId}
                  onChange={(e) => setAssignForm({...assignForm, userId: e.target.value})}
                  required
                >
                  <option value="">Sélectionner un utilisateur</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name}
                    </option>
                  ))}
                </select>
                <select
                  value={assignForm.taskId}
                  onChange={(e) => setAssignForm({...assignForm, taskId: e.target.value})}
                  required
                >
                  <option value="">Sélectionner une tâche</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  Assigner Tâche
                </button>
              </form>
            </div>

            {/* Informations sur les assignations actuelles */}
            <div className="list-section">
              <h3>Assignations actuelles</h3>
              <div className="assignments-overview">
                {users.length === 0 && tasks.length === 0 ? (
                  <p>Aucun utilisateur ou tâche disponible.</p>
                ) : (
                  <div className="summary-cards">
                    <div className="summary-card">
                      <h4>📊 Résumé</h4>
                      <p>Utilisateurs: {users.length}</p>
                      <p>Tâches: {tasks.length}</p>
                      <p>Tâches assignées: {tasks.filter(task => task.users && task.users.length > 0).length}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
