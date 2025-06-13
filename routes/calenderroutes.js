const calendarControler=require("../Controller/calendarController");

const express=require("express")

const router=express.Router();

const upload=require('../utils/fileupload');


router.post("/addCalendar",upload.fields([{name:'calendar_img'}]),calendarControler.addCalendar)
router.get("/getAllCalendarsInDesc",calendarControler.getAllCalendarsInDesc)
router.post("/deleteCalendarById",calendarControler.deleteCalendarById)
router.post("/updateCalendar",upload.fields([{name:'calendar_img'}]),calendarControler.updateCalendar)




module.exports=router;