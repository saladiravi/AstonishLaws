const ourteam=require('../Controller/ourteamController');
const express=require('express');
const router=express.Router();


router.post("/addTeam",ourteam.addourteam);
router.get("/getallourteam",ourteam.getAllTeamData);
router.post("/getteamById",ourteam.getourteamid);
router.post("/updateTeam", ourteam.updateourteam);
router.post("/deleteTeam", ourteam.deleteTeam);

module.exports=router;