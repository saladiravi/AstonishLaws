const clientreview=require('../Controller/clientreviewController')
const express=require('express');
const router=express.Router();
 

router.post('/addClientreviews',clientreview.addClientreview);
router.get('/getallreviews',clientreview.getAllReviewsData);
router.post('/clientreviewsByid',clientreview.getClientreviewid);
router.post('/updatereview',clientreview.updateReview);

router.post('/deletereview',clientreview.deleteReview);
  
module.exports=router