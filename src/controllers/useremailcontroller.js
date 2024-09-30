const emailcontroller=require('../services/emailService')

function sendEmail(request,response)
{
 emailcontroller.sendEmail(request,response)
}
function verifyOTP(request,response)
{
    emailcontroller.verifyOTP(request,response)
}
module.exports={sendEmail,verifyOTP}