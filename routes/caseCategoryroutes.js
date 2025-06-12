const caseController=require('../Controller/caseCategoryController')
const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');
 
router.post('/addcase',upload.fields([
    {name:'case_image',maxCount:1}]),caseController.addcasecategory);
 
router.get('/getallcases',caseController.getallcaseCategory);
router.get('/getcasesbyId',caseController.getCasesById);
router.post('/updatecase',upload.fields([
      {name:'case_image',maxCount:1}]),caseController.updateCase) ;
   router.delete("/deleteCase",caseController.deleteCase);
 
 
module.exports=router