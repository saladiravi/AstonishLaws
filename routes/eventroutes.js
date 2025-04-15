const eventcontroller=require('../Controller/eventController');
const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');

router.post('/addEvent',upload.fields([
    {name:'event_image',maxCount:1}]),eventcontroller.addevent);

 router.get('/getAllEvents',eventcontroller.getAllevents);
 router.post('/getEventById',eventcontroller.geteventById);

router.post('/updateEvent',upload.fields([
    {name:'event_image',maxCount:1}]),eventcontroller.updateevent);

 router.post('/deleteEvent',eventcontroller.deleteevent);


module.exports=router
