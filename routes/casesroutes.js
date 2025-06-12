const caseTitleController =require('../Controller/casesController');

const express=require("express")
const router=express.Router();
 
 

router.post('/addcase',caseTitleController.addCaseTitle);

router.get('/getallcases',caseTitleController.getAllCaseTitles);
router.post('/getcasesbyId',caseTitleController.getCaseTitleById)
router.post('/updatecase',caseTitleController.updateCaseTitle) ;

router.post('/deletecase',caseTitleController.deleteCaseTitle);
 
module.exports=router;