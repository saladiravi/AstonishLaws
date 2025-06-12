
const casedetails =require('../Controller/casedetailsController');
const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');
 
router.post('/addcasedetails',upload.fields([
    {name:'case_file',maxCount:1}]),casedetails.addCaseContent);
router.get('/getcasedetails',casedetails.getAllCaseContent);
router.post('/getCasedetailsByCaseId',casedetails.getCaseById);

 
module.exports=router