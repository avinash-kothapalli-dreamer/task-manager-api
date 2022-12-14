const express= require('express')
const router = new express.Router()
const Task = require('../models/tasks.js')
const auth = require('../middleware/auth')
const { SchemaTypeOptions } = require('mongoose')

router.post('/tasks',auth,async (req,res)=>{
    try{
        //const task = new Task(req.body)
        const task = new Task({
            ...req.body,
            owner:req.user.id
        })
        await task.save()
        res.status(201).send(task)
        
    }
   catch(e){
        res.status(400).send(e)
    }
})
router.get('/tasks',auth,async (req,res)=>{
    try{
        const match={}
        if(req.query.completed){
            match.completed = req.query.completed==='true'
        }
        const sort={}
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1]==='desc'?-1:1
        }
        //const tasks = await Task.find({owner:req.user._id})
       //console.log('hii')
       //console.log(req.user)
       
       //console.log(req.user.tasks)
       await req.user.populate({
        path:'tasks',
        match,
        options:{
           limit:parseInt(req.query.limit),
           skip:parseInt(req.query.skip),
           sort
        }
       })
       //console.log('hii')
       //console.log(tasks)
        res.send(tasks)

    }
   catch(e){
    console.log(e)
        res.status(500).send(e)
       
    }
})
router.get('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id
    try{
        const task =await  Task.findOne({_id,owner:req.user._id})
        task.save()
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }
   catch(e){
        res.status(500).send(e)
    }
 })
 router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
          //const task = await Task.findById(req.params.id)
          
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
            })
            await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/tasks/:id',auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


// app.listen(port,()=>{
//     console.log('server is listening to the port '+port)
// })



module.exports = router


