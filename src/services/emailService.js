const nodemailer = require('nodemailer')
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const crypto = require('crypto')
const UserData=require('../models/OTP')
const transport = nodemailer.createTransport({
    secure: true,
    service: 'gmail',
    auth: {
        pass: 'yahc uuoc vqoi xlzv',
        user: "kiran124teja@gmail.com"
    }
});
const generateOTP = () => {
    return new Promise((reslove, reject) => {
        crypto.randomInt(1000, 10000, (error,response) => {
            if (error) reject(error);
            else reslove(response)

        })

    });
}

// const sendEmail = async (request, response) => {
//     console.log("callled........")
//     let template;
//     const { email } = request.body;
//     let OTPNumber;

//     try {
     
//      OTPNumber=await generateOTP()

//         const filePath = path.resolve('C://Users//HP//Downloads//dosthi-backend//dosthi-backend//views//email.ejs')
//         if (!fs.existsSync(filePath)) {
//             return response.status(404).json({ message: 'file not found' })
//         }
//         if (!request.body) {
//             return response.status(401).json({ mesasge: 'invalid body' });
//         }
//         else if (request.body) {


            
//             template = fs.readFileSync(filePath, 'utf-8')
//             const file = ejs.render(template, {email:email,OTP:OTPNumber })
//             const options = {
//                 from: 'kiran124teja@gmail.com',
//                 to: `${email}`,
//                 subject: 'here is your opt',
//                 text: 'data',
//                 html: file
//             }

//             await transport.sendMail(options);
//             return response.status(201).json({ message: "mail sent successfully" });

//         }
//     }
//     catch (error) {
//         return response.status(404).json({ error: error.message })
//     }
// }










const sendEmail = async (request, response) => {
    const { email } = request.body
    let OTPNumber;
    let OTPExpiry;
    if (!email) {
        return response.status(404).json({ message: 'Email is required' });
    }
    try {
        OTPNumber = await generateOTP();
        OTPExpiry = (Date.now() + 10 * 60 * 1000).toString()

        let userData = await UserData.findOne({ email });
        if (!userData) {
            userData = new UserData({
                userEmail: email,
                userOtp: OTPNumber,
                otpExpiry: OTPExpiry
            });
        }
        else {
            userData.userEmail =email;
            userData.userOtp = OTPNumber;
            userData.otpExpiry = OTPExpiry;

        }
        await userData.save();
   
    
        let template;
        // const templatePath = path.resolve('C:\\Users\\HP\\Desktop\\dosthi_application_backend\\views\\email.ejs');
        // try {

        //     if (!fs.existsSync(templatePath)) {
        //         throw new Error(`Template file not found at ${templatePath}`);
        //     }
        //     // template = fs.readFileSync(templatePath, 'utf-8');

        // }
        // catch (error) {
        //    return response.json({ message: error.message })
        // }


        // const emailPath= ejs.render(template,
        //     {
        //         userName: `${email}`,
        //         otpCode: `${OTPNumber}`
        //     });
        const options = {
            to: `${email}`,
            from: 'kiran124teja@gmail.com',
            subject: 'otp verification code',
            text: `opt sent`,
            html:`<h1>${OTPNumber}</h1>`
        }
        await transport.sendMail(options)
        return response.status(200).json({ message: "email sent successfully...",status:200})

    }
    catch (error) {
        console.log(error.message)
        return response.status(500).json({ message: "Internal Server Error" })
    }

}

const verifyOTP = async (request, response) => {
    const { userOtp } = request.body
    const userData = await UserData.findOne({ userOtp });
    if (!userOtp) {
        return response.status(400).json({ message: "OTP is required" })
    }
    try {
        if (!userData) {
            return response.status(400).json({ message: "Invalid  OTP" })

        }
        else if (Date.now() > Number(userData.otpExpiry) || userData.userOtp !== String(userOtp)) {
            return response.status(400).json({ message: 'expired OTP' });

        }

        userData.userOtp = null;
        userData.otpExpiry = null;
        await userData.save();
        return response.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (error) {
        return response.status(401).json({ message: error.message })
    }

}


module.exports = { sendEmail, verifyOTP}