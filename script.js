
let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const columns = [todo, progress, done];

let dragelement = null;

// 1. Function to create a task
function addTask(title, desc, column) {
    const div = document.createElement("div");

    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `;

    column.appendChild(div);

    // Add drag event to newly created task
    addDragEventOnTask(div);

    // Delete task
    const deleteButton = div.querySelector("button");

    deleteButton.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    });

    return div;
}

// 2. Function to update task count and Local Storage
function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        tasksData[col.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            };
        });

        count.innerText = tasks.length;
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// 3. Restore tasks from Local Storage
if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data) {
        const column = document.querySelector(`#${col}`);

        if (column) {
            data[col].forEach(task => {
                addTask(task.title, task.desc, column);
            });
        }
    }
}

// Update counts after restoring tasks
updateTaskCount();

// 4. Drag event on individual tasks
function addDragEventOnTask(task) {
    task.addEventListener("dragstart", () => {
        dragelement = task;
    });
}

// 5. Drag events on columns
function addDragEventsOnColumn(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", (e) => {
        e.preventDefault();

        if (dragelement) {
            column.appendChild(dragelement);
            dragelement = null;
        }

        column.classList.remove("hover-over");

        updateTaskCount();
    });
}

// Apply drag events to all columns
columns.forEach(column => {
    addDragEventsOnColumn(column);
});

// 6. Modal functionality
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

// Open modal
toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

// Close modal
modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

// Add new task
addTaskButton.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title-input").value;
    const taskDesc = document.querySelector("#task-desc-input").value;

    addTask(taskTitle, taskDesc, todo);

    updateTaskCount();

    modal.classList.remove("active");

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";
});
