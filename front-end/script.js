/*
Set Default date to tommorows date
*/

var date = new Date();
document.getElementById("datePicker").value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
    '-' + (date.getDate() + 1).toString().padStart(2, 0);

/*
Change checkbox status text on the basis of checked or unchecked
*/

document.onload = function changeText() {
    var checkbox = document.getElementById("inlineCheckbox");
    if (checkbox.checked) {
        document.getElementById("checkbox-label").innerHTML = "Complete";
    } else {
        document.getElementById("checkbox-label").innerHTML = "Incomplete";
    }
}

/** 
 * fetch the saved tasks
 */
document.onload = getTodos();
async function getTodos() {

    const resp = await fetch('/todos', { method: 'GET' })
    const todos = await resp.json()
    document.querySelector("#accordion").innerHTML = "";
    for (let task of todos) {

        document.querySelector("#accordion").innerHTML += ` <div class="card" id=${task.id}>
        <div class="card-header" id="card-header">
            <button id="taskButton" class="card-link" type="button" data-toggle="collapse" data-target="#note${task.id}" aria-expanded="false" aria-controls="note${task.id}">
                <span class="collapsed"><p><b>></b></p></span>
                <span class="expanded"><p><b><</b></p></span>
              <b>${task.title}</b> <br>
               Description: ${task.description}<br>
               Due Date: ${task.dueDate}<br>
               Status: ${task.status}<br>
               Priority: ${task.priority}</p>
              </button>
        </div>
        <div id="note${task.id}" class="collapse">
            <div class="card-body">
                <ul class="notes" id="list${task.id}">
                    
                    
                </ul>
                <textarea rows="1" cols="90" id="addNote-textbox" placeholder="Add Note"></textarea>

                <input type="button" value="ADD" id="addNote" class="addNote">
            </div>
        </div>
        <input type="button" value="Update" onclick="updateData(task.id)">
        </div>`
        for (let note of task.notes) {
            // let task_id = `list${task.id}`;
            document.getElementById(`list${task.id}`).innerHTML += `<li>${note.text}</li>`
        }
    }
}