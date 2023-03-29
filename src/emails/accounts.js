const sgMail = require('@sendgrid/mail')
//const sendgridAPIKey='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'

sgMail.setApiKey(process.env.sendgrid_api_key);

const welcomemail = (email,name)=>{
    sgMail.send({
   to:email,
   from:'avinashkumarkothapalli2002@gmail.com',
   subject:'Thanks for joining in!',
   text:`Welcome to tha app ${name}.Let me know how you get along with the app.`
    })
}
const cmail= (email,name)=>{
    sgMail.send({
        to:email,
        from:'avinashkumarkothapalli2002@gmail.com',
        subject:'sorry to see you go',
        text:`Goodbye ${name} hope to see you back soon`
    })
}
cmail('avinashkumarkothapalli2002@gmail.com','avi')

module.exports={
    welcomemail,
    cmail
}

//welcomemail('avinashkumarkothapalli2002@gmail.com','avinash')
// sgMail.send({
//     to:'avinashkumarkothapalli2002@gmail.com',
//     from:'avinashkumarkothapalli2002@gmail.com',
//     subject:'this is my first creation',
//     text:'hii this is avinash working on full stack'
// })