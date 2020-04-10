const { db, Task, Note } = require('./model')
const { Op } = require('sequelize')

//add data

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
//     task.status = "incomplete"
//     task.save().then(() => {
//         console.log("after updating", task)
//     });

// }
// task()