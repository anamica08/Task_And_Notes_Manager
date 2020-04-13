const { Router } = require('express')
const Model = require('../db/model')
    //console.log({ Model });

const route = Router()

//display
route.get('/', async(req, res) => {
    const tasks = await Model.Task.findAll({ include: Model.Note });
    res.status(200).send(tasks);
})

//add a task
route.post('/', async(req, res) => {
    if (typeof req.body.title !== 'string' || req.body.title == '') {
        return res.status(400).send({ message: 'Task name not provided' })
    }
    if (req.body.dueDate == '') {
        return res.status(400).send({ message: 'dueDate not provided' });
    }
    const task = await Model.Task.create({
        title: req.body.title,
        description: req.body.description,
        status: 'incomplete',
        dueDate: req.body.dueDate,
        priority: req.body.priority

    })
    console.log('Task Added: ', task, null, 2);
    res.status(201).send({ success: 'New task added' });
})


//add notes to a task
route.post('/:id/notes', async(req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
            error: 'task id must be an integer'
        })
    }
    let idx = Number(req.params.id);
    const task = await Model.Task.findByPk(idx, { include: Model.Note });
    await Model.Note.create({
        text: req.body.text,
        taskId: idx
    });
    res.status(200).send();
})

//get task by id
route.get('/:id', async(req, res) => {
    if (isNaN(Number(req.params.id))) {
        return res.status(400).send({
            error: 'task id must be an integer'
        })
    }
    const task = await Model.Task.findByPk(req.params.id);
    if (task == null) {
        res.status(404).send({ error: "No task with this id exists" });
    } else {
        res.status(200).send({
            id: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status
        })

    }

})

//update task
route.patch('/:id', async(req, res) => {
    const task = await Model.Task.findByPk(req.params.id);
    if (task == null) {
        res.status(404).send({ error: "No task with this id exists" })
    };
    task.dueDate = req.body.dueDate;
    task.priority = req.body.priority;
    task.status = req.body.status;
    task.save().then(() => {
        console.log("after updating", task)
    })
    res.status(200).send({ success: 'Succesfully updated' + req.params.id });
})



module.exports = route;