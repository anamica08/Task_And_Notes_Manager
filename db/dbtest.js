// const { db, Task, Note } = require('./model')
// const { Op } = require('sequelize')

// //add data

// async function task() {
//     //await db.sync({ alter: true })
//     // await db.sync({ force: true })
//     await db.sync()
//     await Task.bulkCreate([
//         Task.create({
//             title: 'Groceries',
//             description: 'Buy groceries from joy store',
//             dueDate: '2020-04-10',
//             notes: [
//                 { text: 'Avoid Tina at the store ' }, { text: 'Only brown sugar ' }
//             ]
//         }, {
//             include: [Note]
//         }),
//         Task.create({
//             title: 'Soft Skills',
//             description: 'Train students',
//             dueDate: '2020-04-10',
//             notes: [
//                 { text: 'body language' }
//             ]
//         }, {
//             include: [Note]
//         }),
//         Task.create({
//             title: 'Maruti',
//             description: 'Project designing to be done',
//             status: 'complete',
//             dueDate: '2020-04-10',
//             priotity: 'high',
//             notes: [
//                 { text: 'Send mails to team members' }, { text: 'Location visit' }
//             ]
//         }, {
//             include: [Note]
//         })
//     ])
// }
// task()


//const { Op } = require('sequelize')


//read all
// async function task() {
//     await db.sync()
//     const tasks = await Task.findAll({ include: Note });
//     console.log(JSON.stringify(tasks, null, 2));

// }

//fetch by PK
// async function task() {
//     await db.sync()
//     const task = await Task.findByPk(1, { include: Note }); //just remove include:note to fetch only task data
//     console.log(JSON.stringify(task, null, 5));
// }

//updsate incomplete or complete
// async function task() {
//     await db.sync();
//     const task = await Task.findByPk(1);
//     task.status = "incomplete"  , priority , due date.
//     task.save().then(() => {
//         console.log("after updating", task)
//     });

// }
// task()


//sort by 

//add note to a task
// async function addTask() {
//     route.post('/add', async(req, res) => {
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
// }