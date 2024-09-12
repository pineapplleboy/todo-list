class Task {
    constructor(text, block, status) {
        this.text = text;
        this.block = block;
        this.textElement = block.querySelector('.taskText');
        this.status = status;
    }

    editText = function(text){
        this.text = text;
        this.textElement.textContent = text;
    }
}

const createTaskElement = function(text, status){
    const taskBlock = document.createElement('div');
    taskBlock.className = 'taskBlock';

    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.class = 'taskCheckbox';

    const taskText = document.createElement('p');
    taskText.className = 'taskText';
    taskText.textContent = text;

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';

    const editButton = document.createElement('button');
    editButton.className = 'editButton';
    editButton.textContent = 'Редактировать';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';
    deleteButton.textContent = 'Удалить';

    editButton.addEventListener('click', () => editTask(taskBlock))
    deleteButton.addEventListener('click', () => deleteTask(taskBlock))

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(deleteButton);

    taskBlock.appendChild(taskCheckbox);
    taskBlock.appendChild(taskText);
    taskBlock.appendChild(buttonsDiv);

    
    let task = new Task(text, taskBlock, status);
    tasks.push(task);
    taskCheckbox.addEventListener('change', (event) => changeStatus(task, event.target.checked));

    changeStatus(task, status);
    taskCheckbox.checked = status;

    return taskBlock;
}

const JSONToFile = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

const createTask = function(){
    createTaskElement(inputValue.value, false);
    inputValue.value = '';
}

const loadTask = function(task){
    createTaskElement(task.text, task.status);
}

const deleteTask = function(taskBlock){
    const id = tasks.findIndex(task => task.block === taskBlock);
    tasks.splice(id, 1);

    taskBlock.remove();
}

const editTask = function(taskBlock){
    const id = tasks.findIndex(task => task.block === taskBlock);
    const task = tasks[id];
    const taskTextElement = task.textElement;

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = task.text;
    inputField.className = 'editInput';

    taskTextElement.replaceWith(inputField);
    inputField.focus();

    inputField.addEventListener('blur', () => {
        task.editText(inputField.value);
        inputField.replaceWith(taskTextElement);
    });

    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            task.editText(inputField.value);
            inputField.replaceWith(taskTextElement);
        }
    });
}

const save = function(){
    
    JSONToFile(tasks, 'tasks');
}

const load = function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const jsonData = JSON.parse(e.target.result);

            tasks = [];

            document.querySelectorAll('.taskBlock').forEach(element => element.remove());

            jsonData.forEach(taskData => loadTask(taskData));
        };

        reader.readAsText(file);
    }

    this.value = '';
};

const changeStatus = function(task, status){
    task.status = status;
    if(!status){
        document.body.querySelector('#incompleteTasks').appendChild(task.block);
    }
    else{
        document.body.querySelector('#completedTasks').appendChild(task.block);
    }
}

let inputButton = document.getElementById('inputButton');
let saveButton = document.getElementById('saveButton');
let loadButton = document.getElementById('loadButton');

let inputValue = document.getElementById('inputValue');

let tasks = [];

inputButton.addEventListener('click', createTask);

saveButton.addEventListener('click', save);

loadButton.addEventListener('change', load);