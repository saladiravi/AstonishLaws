
const casedetails =require('../Controller/casedetailsController');
const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');
 
router.post('/addcasedetails',upload.fields([
    {name:'case_file',maxCount:1}]),casedetails.addCaseContent);
router.get('/getcasedetails',casedetails.getAllCaseContent);
router.post('/getCasedetailsByCaseId',casedetails.getCaseById);
router.post('/updateCasedetails',upload.fields([
    {name:'case_file',maxCount:1}]),casedetails.updateCaseContent);
router.post('/deletecasedetails',casedetails.deleteCaseContent);
 
 
module.exports=router