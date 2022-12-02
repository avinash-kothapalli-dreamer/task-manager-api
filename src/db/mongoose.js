const mongoose = require('mongoose')
const validator = require('validator')
mongoose.connect(process.env.mongo_url,{
    useNewUrlParser:true
})



// const me = new User({
//     name:'avin',
//     age: 7,
//     email:'avi@gmail.com',
//     password:'avinash@123'
// })

// me.save().then(()=>{
// console.log(me)
// }).catch((e)=>{
//   console.log(e)
// })
// const Task = mongoose.model('tasks',{
//     description:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
// })
// const task = new Task({
//     description:'complete the nodejs',
//     completed:false
// })
// task.save().then(()=>{
//     console.log(task)
// }).catch((e)=>{
//     console.log(e)
// })

