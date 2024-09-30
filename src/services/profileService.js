const profileModel = require('../models/User')
const crypto=require('crypto')
const generateUserId = () => {
    return new Promise((reslove, reject) => {
        crypto.randomInt(100000, 1000000, (error,response) => {
            if (error) reject(error);
            else reslove(response)

        })

    });
}

const saveProfileDetails = async (request, response) => {

    try {
        const userId=await generateUserId();

        const {
            usernumber,
            phonenumber, email, nickname,
            gender, dateofbirth, logourl,
            status, isOnline } = request.body;
        // console.log("goot")
        let User = new profileModel({
            usernumber: usernumber, profileid: `#${userId}`,
            phonenumber: phonenumber, email: email, nickname: nickname,
            gender: gender, dateofbirth: dateofbirth, logourl: logourl,
            status: status, isOnline: isOnline
        })
        if (!request.body) {
            return response.status(404).json({ message: "fields are required" })
        }
        else if (request.body) {
            await User.save();
            return response.status(201).json({ message: "details saved successfully" })
        }

    }
    catch (error) {
        return response.status(404).json({ error: error.message })
    }
}

const getProfileDetails = async (request, response) => {

    const { email } = request.body;

    if (!request.body) {
        return response.status(404).json({ message: "fields are required" })
    }

    else if (request.body) {
        const datas = await profileModel.find({ email });

        if (!datas) {
            return response.status(404).json({ message: 'data is not present' })
        }
        let responsedata;
        for (var data of datas) {
            responsedata = {
                profileid:data.profileid,
                email: data.email,
                nickname: data.nickname,
                gender: data.gender,
                dateofbirth: data.dateofbirth,
                logourl: data.logourl,
                status: data.status,
                isOnline: data.isOnline,
            }
        }


        return response.status(200).json(responsedata);
    }


}


module.exports = { saveProfileDetails, getProfileDetails }