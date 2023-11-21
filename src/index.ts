import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

const list = document.querySelector('#list') as HTMLUListElement;
const form = document.querySelector('#new-task-form') as HTMLFormElement | null;
const input = document.querySelector('#new-task-title') as HTMLInputElement;
const mainInfo = document.querySelector('#empty') as HTMLParagraphElement;
const tasks: Task[] = loadTasks();

if (tasks.length === 0) mainInfo.textContent = 'No tasks!';

tasks.forEach((task) => {
  if (tasks.length > 0) mainInfo.classList.add('hidden');
  addListItem(task);
});

form
  ? addEventListener('submit', (event) => {
      event.preventDefault();

      if (input?.value === '' || input?.value === null) return;

      const newTask: Task = {
        id: uuidv4(),
        title: input.value,
        completed: false,
        createdAt: new Date(),
      };
      tasks.push(newTask);
      addListItem(newTask);
      input.value = '';
    })
  : null;

function addListItem(task: Task) {
  mainInfo.classList.add('hidden');
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  const buttonBox = document.createElement('div');
  const deleteBtn = document.createElement('button');

  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = !task.completed;
    saveTasks();
    if (task.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          y: 0.6,
        },
      });
      label.classList.add('completed');
      item.classList.add('completed');
    }
  });

  saveTasks();

  buttonBox.classList.add('button-box');

  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete');
  deleteBtn.addEventListener('click', () => {
    removeTask(task.id);
    item.remove();
    if (tasks.length === 0) mainInfo.classList.remove('hidden');
    mainInfo.textContent = 'No tasks!';
  });

  label.append(task.title);
  buttonBox.append(checkbox, deleteBtn);
  item.append(label, buttonBox);
  list?.append(item);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  console.log(tasks);
}

function removeTask(id: string) {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) return;

  tasks.splice(taskIndex, 1);
  saveTasks();
}

function loadTasks(): Task[] {
  const tasksJSON = localStorage.getItem('tasks');
  if (tasksJSON === null) return [];
  const savedTasks: Task[] = JSON.parse(tasksJSON);

  return JSON.parse(tasksJSON);
}

//localStorage.clear();
