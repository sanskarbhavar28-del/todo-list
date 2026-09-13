// =========================
// GET HTML ELEMENTS
// =========================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll(".filter-btn");


// =========================
// APPLICATION STATE
// =========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

let editingTaskId = null;


// =========================
// SAVE TASKS
// =========================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// =========================
// DISPLAY TASKS
// =========================

function displayTasks() {

    taskList.innerHTML = "";


    // Filter tasks

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {
            return !task.completed;
        });

    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {
            return task.completed;
        });

    }


    // Show empty message

    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    // Create task elements dynamically

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.dataset.id = task.id;


        // Checkbox

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;

        checkbox.dataset.action = "toggle";


        // Task text

        const span = document.createElement("span");

        span.className = "task-text";

        span.textContent = task.text;


        // Edit button

        const editButton = document.createElement("button");

        editButton.className = "edit-btn";

        editButton.textContent = "Edit";

        editButton.dataset.action = "edit";


        // Delete button

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.dataset.action = "delete";


        // Add elements to li

        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(editButton);

        li.appendChild(deleteButton);


        // Add li to list

        taskList.appendChild(li);

    });


    updateTaskCount();

}


// =========================
// ADD TASK
// =========================

function addTask() {

    const text = taskInput.value.trim();


    // Don't allow empty task

    if (text === "") {

        alert("Please enter a task.");

        return;

    }


    // Create new task

    const newTask = {

        id: Date.now(),

        text: text,

        completed: false

    };


    // Add task to state

    tasks.push(newTask);


    // Save to localStorage

    saveTasks();


    // Update screen

    displayTasks();


    // Clear input

    taskInput.value = "";

    taskInput.focus();

}


// =========================
// UPDATE TASK
// =========================

function editTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {
        return;
    }


    const newText = prompt("Edit your task:", task.text);


    if (newText === null) {
        return;
    }


    const updatedText = newText.trim();


    if (updatedText === "") {

        alert("Task cannot be empty.");

        return;

    }


    // Update task

    task.text = updatedText;


    // Save

    saveTasks();


    // Display updated task

    displayTasks();

}


// =========================
// DELETE TASK
// =========================

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


// =========================
// TOGGLE TASK
// =========================

function toggleTask(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {
        return;
    }


    task.completed = !task.completed;


    saveTasks();

    displayTasks();

}


// =========================
// EVENT DELEGATION
// =========================

// One event listener handles all task buttons

taskList.addEventListener("click", function(event) {

    const action = event.target.dataset.action;


    if (!action) {
        return;
    }


    const taskElement = event.target.closest(".task");


    if (!taskElement) {
        return;
    }


    const id = Number(taskElement.dataset.id);


    if (action === "edit") {

        editTask(id);

    }


    if (action === "delete") {

        deleteTask(id);

    }

});


// Checkbox event delegation

taskList.addEventListener("change", function(event) {

    if (event.target.dataset.action !== "toggle") {
        return;
    }


    const taskElement = event.target.closest(".task");

    const id = Number(taskElement.dataset.id);


    toggleTask(id);

});


// =========================
// FILTER TASKS
// =========================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Remove active class

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Add active class

        button.classList.add("active");


        // Change filter

        currentFilter = button.dataset.filter;


        // Display filtered tasks

        displayTasks();

    });

});


// =========================
// CLEAR COMPLETED
// =========================

clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {

        return !task.completed;

    });


    saveTasks();

    displayTasks();

});


// =========================
// ADD BUTTON
// =========================

addTaskBtn.addEventListener("click", addTask);


// =========================
// ENTER KEY
// =========================

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// =========================
// TASK COUNT
// =========================

function updateTaskCount() {

    const remainingTasks = tasks.filter(function(task) {

        return !task.completed;

    }).length;


    if (remainingTasks === 1) {

        taskCount.textContent = "1 task remaining";

    } else {

        taskCount.textContent =
            remainingTasks + " tasks remaining";

    }

}


// =========================
// INITIAL DISPLAY
// =========================

// Load saved tasks when page opens

displayTasks();