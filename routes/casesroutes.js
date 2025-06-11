const caseTitleController =require('../Controller/casesController');

const express=require("express")
const router=express.Router();
 
 
router.post("/addCaseTitle", caseTitleController.addCaseTitle);
router.delete("/deleteCaseTitle", caseTitleController.deleteCaseTitle)
router.get("/getAllCaseTitles",caseTitleController.getAllCaseTitles)
router.get("/getCaseTitleById",caseTitleController.getCaseTitleById)
router.put('/updateCaseTitle',caseTitleController.updateCaseTitle)
 
module.exports=router;