// Поиск элементов на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
};

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {

    // Отмена отправки формы
    event.preventDefault();

    // Получаем текст задачи из поля ввода
    const taskText = taskInput.value;

    // Описание задачи в виде объекта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    // Добавление задачи в массив с задачами
    tasks.push(newTask);

    renderTask(newTask);

    // Очистка поля ввода
    taskInput.value = "";

    // Возврат фокуса на поле ввода
    taskInput.focus();

    checkEmptyList();

    // Сохраняем список задач в хранилище браузера localStorage
	saveToLocalStorage();
};

function deleteTask(event) {

    // Проверка если клик был не по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.list-group-item');

    // Определение id задачи
    const id = Number(parentNode.id);

    // Удаление задачи из массива с помощью фильтрации
    tasks = tasks.filter((task) => task.id !== id);

    // Сохраняем список задач в хранилище браузера localStorage
	saveToLocalStorage();

    // Удаление задачи из разметки
    parentNode.remove();

    checkEmptyList();
};

function doneTask (event) {

    // Проверяем что клик был НЕ по кнопке "задача выполнена"
    if (event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.list-group-item');

    // Определение id задачи
    const id = parentNode.id;
    const task = tasks.find((task) => task.id == id);
    task.done = !task.done;

    // Сохраняем список задач в хранилище браузера localStorage
	saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
};

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
                                   <img src="./img/trex_good.png" alt="Empty" width="100" class="mt-3">
                                   <div class="empty-list__title">Список дел пуст</div>
                               </li>`

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    };

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    };
};

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};


function renderTask(task) {
    // Формирование CSS класса
    const cssClass = task.done ? "task-title task-title--done" : "task-title";
        
    // Формирование разметки для новой задачи
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`

    // Добавление задачи на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
};

