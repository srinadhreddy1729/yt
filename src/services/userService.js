const userModel = require('../models/User')

const sendUserDetails = async (request, response) => {
    const {email,
        profile,
        nickname,
        gender,
        dateofbirth } = request.body
        if(!request.body)
            {
               return response.json({message:'invalid body'}) 
            }
        else{
    const user = new userModel({
        email:email,
        profile:   profile,
        nickname: nickname,
        gender: gender,
        dateofbirth:dateofbirth
    });
    await user.save();
    return response.json({ message: 'profile created successfully.......' });

}

}


const getUserDetails=async (request,response)=>
    {
           const requsetId=request.params.id;
           const id=await userModel.findById(requsetId)

             if(!requsetId)
            {
                response.json({message:"id is required"})

             }
            else if(!id)
                {
                    response.json({message:'id is not valid'})
                }
                else
                {
             const data= await userModel.findById(requsetId);
             response.json({userdata:data})
                }

    }
module.exports = { sendUserDetails,getUserDetails }