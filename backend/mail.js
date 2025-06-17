const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config()


const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

function sendMail(to,subject,text){
    const mailoptions ={
        from:"prasad8790237@gmail.com",
        to:to,
        subject:subject,
        text:text
        
    }
    try{
        const info=transport.sendMail(mailoptions);
        console.log('Email send:',info)


    }
    catch(err){
        console.log("error occurs during send email",err)

    }
}

module.exports=sendMail;