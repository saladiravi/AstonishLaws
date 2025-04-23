const adds=require('../Controller/addManagementController')
const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');

router.post('/addAds',upload.fields([
    {name:'ads_image',maxCount:1}]),adds.adsmanagement);

router.get('/getallads',adds.getallads);
router.post('/getadsByid',adds.getadsByid);
router.post('/UpdateAds',upload.fields([
    {name:'ads_image',maxCount:1}]),adds.updateads);

router.post('/deleteads',adds.deleteAds);


module.exports=router
