const jwt = require('jsonwebtoken')
const express = require('express')
require('./db/mongoose')

const app = express()
const port = process.env.PORT
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


const myFunction = async () => {
    // const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse')
    // console.log(token)

    // const data = jwt.verify(token, 'thisismynewcourse')
    // console.log(data)
}

//myFunction()
const Task = require('./models/tasks')
const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById('5c2e505a3253e18a43e612e6')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('638727d50f05e6d4585a97c3')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

//main()