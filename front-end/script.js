/*
Set Default date to tommorows date
*/
document.onload = getDate();

function getDate() {
    var date = new Date();
    document.getElementById("datePicker").value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
        '-' + (date.getDate() + 1).toString().padStart(2, 0);

};


/*
Change checkbox status text on the basis of checkbox - checked or unchecked state.
*/

function changeText() {
    var checkbox = document.getElementById("modalCheckbox");
    if (checkbox.checked) {
        document.getElementById("modalCheckbox-label").innerHTML = "Complete";
    } else {
        document.getElementById("modalCheckbox-label").innerHTML = "Incomplete";
    }
}


/** 
 * fetch the saved task data.
 */

document.onload = getTasks();
async function getTasks() {

    const resp = await fetch('/todos', { method: 'GET' })
    const todos = await resp.json(); //bas yahi pr sort kr dio
    document.querySelector("#accordion").innerHTML = "";
    for (let task of todos) {
        createTaskCard(task);
    }

}


//send the json data to save in DB.
document.getElementById('add').onclick = async function addTask() {
    event.preventDefault();
    /**
     * Get all the properties of task from the view.
     */
    let title, description, priority, dueDate, status = "Incomplete";
    title = document.getElementById("title").value;
    description = document.getElementById("description").value;
    dueDate = document.getElementById("datePicker").value;
    var priorityArr = document.getElementsByName('priority');
    for (i = 0; i < priorityArr.length; i++) {
        if (priorityArr[i].checked) {
            priority = priorityArr[i].value;
        }
    }
    /**
     * fetch API
     */
    const resp = await fetch('/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, status, dueDate, priority })
        })
        /**
         * if request is successful.
         */
    if (resp.status == 201) {
        document.getElementById("errorMessage").innerHTML = '';
        document.getElementById("errorMessage").style.display = "none";
        getTasks();
        document.getElementById("title").value = '';
        document.getElementById("description").value = '';
        getDate();
        document.getElementById("inlineCheckbox").checked = false;
        changeText();
        document.getElementsByName('priority')[1].checked = true

    }
    if (resp.status == 400) {
        document.getElementById("errorMessage").innerHTML = resp.statusText;
        document.getElementById("errorMessage").style.display = "block";

    }
}


//Add note
async function addNoteToTask(id) {
    let text = document.getElementById(`addNote-textbox${id}`).value;
    const resp = await fetch(`/todos/${id}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    })
    if (resp.status == 200) {
        getTasks();
    }
}


//get Task by id
async function getTaskById(id) {
    const resp = await fetch(`/todos/${id}`, { method: 'GET' });
    const task = resp.json();
}


//put data on update modal
function setUpUpdateModal(id) {

    fetch(`/todos/${id}`).then((data) => data.json().then((data) => {
        document.querySelector("#modal-title").value = data.title;
        document.querySelector("#modal-description").value = data.description;
        document.querySelector("#modal-datePicker").value = data.dueDate;
        if (data.priority === "Low")
            document.querySelector("#modal-low").checked = true;
        else if (data.priority === "Medium")
            document.querySelector("#modal-medium").checked = true;
        else
            document.querySelector("#modal-high").checked = true;
        if (data.status === "Complete") {
            document.querySelector("#modalCheckbox").checked = true;
            changeText();
        }
        document.querySelector("#addChanges").onclick = () => { updateTask(id); }
    }));
}


//update the properties of task.
async function updateTask(id) {
    let new_priority;
    var priorityArr = document.getElementsByName('m-priority');
    for (i = 0; i < priorityArr.length; i++) {
        if (priorityArr[i].checked) {
            new_priority = priorityArr[i].value;
        }
    }
    let data = {
        dueDate: document.querySelector("#modal-datePicker").value,
        priority: new_priority,
        status: document.querySelector("#modalCheckbox-label").innerHTML
    }
    let resp = await fetch(`/todos/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    $('#updateModal').modal('hide');
    if (resp.status == 200) {
        getTasks();
    }

}

//sort the tasks on the basis of specific task property.
function sortList(param) {
    fetch(`/todos`).then((data) => data.json().then((data) => {
        /**
         * sort the todo by dueDate.
         */
        if (param === 'dateAsc') {
            data.sort((obj1, obj2) => {
                if (obj1.dueDate < obj2.dueDate) return -1;
                else if (obj1.dueDate > obj2.dueDate) return 1;
                else return 0;
            })
            document.querySelector("#accordion").innerHTML = "";
            for (let task of data) {
                createTaskCard(task);
            }

        } else if (param === 'dateDesc') {
            data.sort((obj1, obj2) => {
                if (obj1.dueDate > obj2.dueDate) return -1;
                else if (obj1.dueDate < obj2.dueDate) return 1;
                else return 0;
            })
            document.querySelector("#accordion").innerHTML = "";
            for (let task of data) {
                createTaskCard(task);
            }

        }
        /**
         * sort the todo by priority.
         */
        else if (param === 'priority') {
            let dummyTaskList = data;
            for (let task of dummyTaskList) {
                if (task.priority == "Medium") {
                    task.priority = 2;
                } else if (task.priority == "High") {
                    task.priority = 1;
                } else {
                    task.priority = 3;
                }
            }
            dummyTaskList.sort((obj1, obj2) => {
                return obj1.priority - obj2.priority;
            });
            document.querySelector("#accordion").innerHTML = "";
            for (let task of dummyTaskList) {
                if (task.priority == 2) {
                    task.priority = "Medium";
                } else if (task.priority == 1) {
                    task.priority = "High";
                } else {
                    task.priority = "Low";
                }
                createTaskCard(task);
            }

        }
        /**
         * sort the todo by status.
         */
        else if (param === 'status') {
            let dummyTaskList = data;
            for (task of dummyTaskList) {
                if (task.status == "Complete") {
                    task.status = 0;
                } else if (task.status == "Incomplete") {
                    task.status = 1;
                }
            }
            dummyTaskList.sort((obj1, obj2) => {
                return obj1.status - obj2.status;
            });
            document.querySelector("#accordion").innerHTML = "";
            for (let task of dummyTaskList) {
                if (task.status == 0) {
                    task.status = "Complete";
                } else if (task.status == 1) {
                    task.status = "Incomplete";

                    createTaskCard(task);
                }
            }
        }
    }));
}



//create task card
function createTaskCard(task) {
    document.querySelector("#accordion").innerHTML += ` <div class="card" id=${task.id}>
    <div class="card-header" id="card-header">
        <button id="taskButton" class="card-link" type="button" data-toggle="collapse" data-target="#note${task.id}" aria-expanded="false" aria-controls="note${task.id}">
            <span class="collapsed"><p><b>></b></p></span>
            <span class="expanded"><p><b><</b></p></span>
          <b class="title-tag">${task.title}</b> <hr>
           Description: ${task.description}<br>
           Due Date: ${task.dueDate}<br>
           Status: ${task.status}<br>
           Priority: ${task.priority}</p>
          </button>
    </div>
    <div id="note${task.id}" class="collapse">
        <div class="card-body" id="${task.id}">
            <ul class="notes" id="list${task.id}">
            </ul>
            <textarea rows="1" cols="90" class="textarea" id="addNote-textbox${task.id}" placeholder="Add Note"></textarea>
            <input type="button" value="ADD" id="addNote" class="addNote" onclick="addNoteToTask(${task.id})">
        </div>
    </div>
    <input type="button" id="updateButton" value="Update" onclick="setUpUpdateModal(${task.id})" data-toggle="modal" data-target="#updateModal">
    </div>`
    for (let note of task.notes) {
        document.getElementById(`list${task.id}`).innerHTML += `<li>${note.text}</li>`
    }
}