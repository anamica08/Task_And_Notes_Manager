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
    const todos = await resp.json();
    document.querySelector("#accordion").innerHTML = "";
    if (todos.length == 0) {
        let accordion = document.getElementById("accordion");
        let div = document.createElement("div");
        accordion.appendChild(div);
        div.append("Task List is Empty. Nothing to dipslay.")

    } else {
        for (let task of todos) {
            createTaskCard(task);
        }
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
        getTasks();
        document.getElementById("title").value = '';
        document.getElementById("description").value = '';
        getDate();
        document.getElementById("inlineCheckbox").checked = false;
        changeText();
        document.getElementsByName('priority')[1].checked = true

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
            console.log(dummyTaskList)
            for (task of dummyTaskList) {
                if (task.status == "Complete") {
                    task.status = 1;
                } else if (task.status == "Incomplete") {
                    task.status = 2;
                }
            }
            dummyTaskList.sort((obj1, obj2) => {
                return obj2.status - obj1.status;
            });
            document.querySelector("#accordion").innerHTML = "";
            for (let task of dummyTaskList) {
                if (task.status == 1) {
                    task.status = "Complete";
                } else if (task.status == 2) {
                    task.status = "Incomplete";
                }
                createTaskCard(task);
            }
        }
    }));
}



//create task card
function createTaskCard(task) {
    let accordion = document.getElementById("accordion");
    let card = document.createElement("div");


    card.className = "card";
    card.id = `${task.id}`;

    var child1 = document.createElement("div");
    child1.className = "card-header";
    child1.id = "card-header";
    var button = document.createElement("button");
    button.id = "taskButton";
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", `#note${task.id}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `note${task.id}`);
    button.className = "card-link";
    button.type = "button";
    //button.append("hello world")
    child1.appendChild(button);
    card.appendChild(child1);


    let child2 = document.createElement("div");
    child2.className = "collapse";
    child2.id = `note${task.id}`;

    //card-body
    var cardBody = document.createElement("div");
    cardBody.id = `${task.id}`;
    cardBody.className = "card-body";
    var ul = document.createElement("ul");
    ul.className = "notes";
    ul.id = `list${task.id}`;
    cardBody.appendChild(ul);
    var textarea = document.createElement("textarea");
    textarea.setAttribute("rows", "1");
    textarea.setAttribute("cols", "90");
    textarea.className = "textarea";
    textarea.id = `addNote-textbox${task.id}`;
    textarea.placeholder = "Add Note";
    cardBody.appendChild(textarea);
    var addbtn = document.createElement("input");
    addbtn.type = "button";
    addbtn.value = "Add";
    addbtn.id = "addNote";
    addbtn.className = "addNote";
    addbtn.setAttribute("onclick", `addNoteToTask(${task.id})`);
    cardBody.appendChild(addbtn);

    child2.appendChild(cardBody);
    card.appendChild(child2);


    let child3 = document.createElement("input");
    child3.id = "updateButton";
    child3.value = "Click to Change";
    child3.type = "button";
    child3.setAttribute("onclick", `setUpUpdateModal(${task.id})`);
    child3.setAttribute("data-toggle", "modal");
    child3.setAttribute("data-target", "#updateModal");
    card.appendChild(child3);

    //span child of card button

    var span1 = document.createElement("span");
    span1.className = "collapsed";
    var p1 = document.createElement("p");
    var b1 = document.createElement("b");
    b1.textContent = ">";
    span1.appendChild(p1);
    p1.appendChild(b1);

    var span2 = document.createElement("span");
    span2.className = "expanded";
    var p2 = document.createElement("p");
    var b2 = document.createElement("b");
    b2.textContent = "<";
    span2.appendChild(p2);
    p2.appendChild(b2);

    button.appendChild(span1);
    button.appendChild(span2);

    //button text
    var taskTitle = document.createElement("b");
    taskTitle.className = "title-tag";
    taskTitle.innerHTML = `${task.title}`;
    var hr = document.createElement("hr");
    button.appendChild(taskTitle);
    button.appendChild(hr);
    var desc = document.createElement("textContent");
    desc.innerText = `Description ==> ${task.description}`;
    var br1 = document.createElement("br");
    var br2 = document.createElement("br");
    var br3 = document.createElement("br");


    var due = document.createElement("textContent");
    due.innerText = `Due Date ==> ${task.dueDate}`;
    var status1 = document.createElement("textContent");
    status1.innerText = `Status ==> ${task.status}`;
    var priority = document.createElement("textContent");
    priority.innerText = `Priority ==> ${task.priority}`;

    button.appendChild(desc);
    button.appendChild(br1);
    button.appendChild(due);
    button.appendChild(br2);
    button.appendChild(status1);
    button.appendChild(br3);
    button.appendChild(priority);
    accordion.appendChild(card);


    for (let note of task.notes) {
        var li = document.createElement("li");
        li.append(`${note.text}`);

        document.getElementById(`list${task.id}`).appendChild(li);
    }
}