const aicontroller=require('../Controller/aiController')
const express=require('express');
const router=express.Router();
 

router.post('/createai',aicontroller.reqAi);
router.get('/getaichat',aicontroller.getAiHistory);



module.exports=router
