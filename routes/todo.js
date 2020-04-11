const { Router } = require('express')
const Model = require('../db/model')
    //console.log({ Model });

const route = Router()

//display
route.get('/', async(req, res) => {
        const tasks = await Model.Task.findAll({ include: Model.Note });
        console.log(JSON.stringify(tasks, null, 2));
        res.status(200).send(tasks);
    })
    // async function task() {
    //     await db.sync()
    //     const tasks = await Task.findAll({ include: Note });
    //     console.log(JSON.stringify(tasks, null, 2));

// }
// //create
// route.post('/add', async(req, res) => {
//         if (typeof req.body.task !== 'string' || req.body.task == '') {
//             return res.status(400).send({ error: 'Task name not provided' });
//         }
//         //done is validated in view .
//         const newTODO = await Todos.create({
//             task: req.body.task,
//             done: req.body.done,
//             due: req.body.due
//         })
//         console.log("Task Added");
//         res.status(201).send({ success: 'New task added' });
//     })
//     //update
// route.put('/status', async(req, res) => {
//     var idx = req.body.id;
//     var todoToChange = await Todos.findByPk(idx);
//     if (todoToChange == null) {
//         return res.status(404).send({ error: 'Todo with id not found.' });
//     }

//     var status = req.body.done;

//     console.log("update", todoToChange)
//     todoToChange.done = status;
//     todoToChange.save().then(() => {
//         console.log("after updating", todoToChange)
//     });
//     console.log("Status updated");
//     res.status(200).send({ success: 'Status updated', id: req.body.id, todoToChange });

// })


// //delete
// route.delete('/removedone', async(req, res) => {
//     let listOfTasks = req.body.tasklist;
//     for (let i = 0; i < listOfTasks.length; i++) {
//         let task = await Todos.findByPk(listOfTasks[i]);
//         await task.destroy({ force: true });
//     }
//     console.log("delete action executed succesfully");
//     res.status(200).send({ sucesss: 'Removed Succesfully' });
// })

module.exports = route;