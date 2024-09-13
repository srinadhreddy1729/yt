const nodeMailer = require('nodemailer')
const crypto = require('crypto')
const fs=require('fs')
const UserData = require('../models/UserDetailsModel')
const path=require('path')
const ejs=require('ejs')
const generateOTP = () => {
    return new Promise((reslove, reject) => {
        crypto.randomInt(1000, 10000, (error, success) => {
            if (success) reslove(success);
            else reject(error)
        });

    }
    )
}

const mailTrans = nodeMailer.createTransport(
    {
        secure: true,
        service: 'gmail',
        auth: {
            pass: 'yahc uuoc vqoi xlzv',
            user: "kiran124teja@gmail.com"

        }
    }
)

const sendOtp = async (request, response) => {
    const { userEmail } = request.body

    let OTPNumber;
    let OTPExpiry;
    if (!userEmail) {
        return response.status(404).json({ message: 'Email is required' });
    }
    try {
        OTPNumber = await generateOTP();
        OTPExpiry = (Date.now() + 10 * 60 * 1000).toString()

        let userData = await UserData.findOne({ userEmail });
        if (!userData) {
            userData = new UserData({
                userEmail: userEmail,
                userOtp: OTPNumber,  
                otpExpiry: OTPExpiry
            });
        }
        else {
            userData.userEmail = userEmail;
            userData.userOtp = OTPNumber;
            userData.otpExpiry = OTPExpiry;

        }
        await userData.save();
    }
    catch (error) {
        response.status(404).json({ message: error.message })
    }
    try {
        let template;
        const templatePath = path.resolve('C:\\Users\\HP\\Desktop\\dosthi_application_backend\\views\\email.ejs'); 
        try
        {
        
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found at ${templatePath}`);
        }
         template = fs.readFileSync(templatePath, 'utf-8');

    }
    catch(error)
    {
      response.json({message:error.message})
    }

        
      const email=ejs.render(template,
                  {  
            userName:`${userEmail}`,
            otpCode:`${OTPNumber}`
                  });
        const options = {
            to: `${userEmail}`,
            from: 'kiran124teja@gmail.com',
            subject: 'otp verification code',
            text: `opt sent`,
            html:email
        }
        await mailTrans.sendMail(options)
        response.status(200).json({ message: "email sent successfully..." })

    }
    catch (error) {
        console.log(error.message)
        response.status(500).json({ message: "Internal Server Error" })
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
        response.status(200).json({ message: 'OTP verified successfully' });
    }
    catch (error) {
        response.status(401).json({ message: error.message })
    }

}
const example=async (request,response)=>
    {
    response.json({message:"its running successfully..........."})
    }


module.exports = { sendOtp, verifyOTP,example }