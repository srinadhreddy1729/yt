const profileService=require('../services/profileService')
 function saveprofileDetails(request,response)
 {
    profileService.saveProfileDetails(request,response);
 }
function getprofileDetails(request,response)
{
    profileService.getProfileDetails(request,response)
}

 module.exports={saveprofileDetails,getprofileDetails}