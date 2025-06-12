const faqreview=require('../Controller/faqsController');
const express=require('express');
const router=express.Router();
 
router.post('/addFaqs',faqreview.addfaqs)

router.get('/getallfaqs',faqreview.getAllFAQ);
router.post('/getfaqbyid',faqreview.getfaqid);
router.post('/updatefaqs',faqreview.updatefaqs);

router.post('/deletefaq',faqreview.deleteFaq);
  
module.exports=router