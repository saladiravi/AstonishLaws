const casecontroller=require('../Controller/caseController')
const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');

router.post('/addcase',upload.fields([
    {name:'case_image',maxCount:1}]),casecontroller.addCase);

router.get('/getallcases',casecontroller.getallCases);
router.post('/getcasesbyId',casecontroller.getcasesByid);
router.post('/updatecase',upload.fields([
    {name:'case_image',maxCount:1}]),casecontroller.updateCase);

router.post('/deletecase',casecontroller.deleteCase);
router.get('/getUniqueCase',casecontroller.getUniqueCases);
router.post('/getCaseByCateogary',casecontroller.getCasesByCategory);

module.exports=router 
 