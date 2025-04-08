/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/tasks').then((data) => setTasks(data));
  }, [api]);
  //const handleFetchTasks = async () => setTasks(await api.get('/tasks'));

  const handleSaveTask = async () => {
    if (!newTaskName.trim()) return;

    if (editingTask) {
      const updatedTask = await api.patch(`/tasks/${editingTask.id}`, {
        name: newTaskName,
      });
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } else {
      const createdTask = await api.post('/tasks', { name: newTaskName });
      setTasks((prev) => [...prev, createdTask]);
    }

    setNewTaskName('');
    setEditingTask(null);
  };

  const handleDelete = async (id: number) => {
    // @todo IMPLEMENT HERE : DELETE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  const handleSave = async () => {
    // @todo IMPLEMENT HERE : SAVE THE TASK & REFRESH ALL THE TASKS, DON'T FORGET TO ATTACH THE FUNCTION TO THE APPROPRIATE BUTTON
    if (!newTaskName.trim()) return;

    if (editingTask) {
      const updatedTask = await api.patch(`/tasks/${editingTask.id}`, {
        name: newTaskName,
      });
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } else {
      const createdTask = await api.post('/tasks', { name: newTaskName });
      setTasks((prev) => [...prev, createdTask]);
    }

    setNewTaskName('');
    setEditingTask(null);
  }

  const startEditing = (task: Task) => {
    setNewTaskName(task.name);
    setEditingTask(null);
  };
  
  const isButtonDisabled =
    !newTaskName.trim() ||
    (editingTask ? newTaskName === editingTask.name : false);

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Todo List
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="Task Name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSaveTask}
          disabled={isButtonDisabled}
        >
          {editingTask ? 'Update' : 'Add'} Task
        </Button>
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Search Tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {filteredTasks.map((task) => (
        <Box key={task.id} display="flex" alignItems="center" mb={1}>
          <Typography flex={1}>{task.name}</Typography>
          <IconButton onClick={() => startEditing(task)}>
            <Check />
          </IconButton>
          <IconButton onClick={() => handleDelete(task.id)}>
            <Delete />
          </IconButton>
        </Box>
      ))}
    </Container>
  );
};

export default TodoPage;