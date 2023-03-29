const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp =require('sharp')
const {welcomemail,cmail} = require('../emails/accounts.js')
const upload = multer({
    //dest: 'avatar',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload a image  file'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/upload',auth,upload.single('avatar'), async (req, res) => {
    const buffer = sharp(req.file.buuffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/upload',auth, async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
router.get('/users/:id/upload',async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
    if(!user||!user.avatar){
        throw new Error()
    }
    res.set('content-Type','image/png')

    res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
})
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        welcomemail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})
router.post('/users/logout',auth,async (req,res)=>{
    try{
        //console.log(req.user.tokens)
        //console.log(req.token)
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        //console.log(req.user.tokens)
        })
        //console.log(req.user.tokens)
        await req.user.save()
        res.status(200).send()
    }catch(e){
        // console.log('hii')
        console.log(e)
      res.status(500).send()
    }
})
router.post('/users/logoutAll',auth,async (req,res)=>{
try{
  req.user.tokens=[]
  await req.user.save()
  res.send()
}catch(e){
  res.status(500).send()
}
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})



router.patch('/users/me', auth,async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        //const user = req.user

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        // if (!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id)

        // if (!user) {
        //     return res.status(404).send()
        // }
       // console.log(cmail.to)
        
        await req.user.remove()
        cmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

module.exports = router