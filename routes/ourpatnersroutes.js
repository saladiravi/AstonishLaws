const ourPartnersController= require('../Controller/ourpatnersController');

const express=require("express");

const router=express.Router();
const upload=require('../utils/fileupload');



router.post('/createPartner', upload.fields([{ name: 'partner_image', maxCount: 1 }]), ourPartnersController.createPartner);
router.get('/getAllPartners', ourPartnersController.getAllPartners);
router.post('/updatePartner',upload.fields([
      {name:'partner_image',maxCount:1}]), ourPartnersController.updatePartner);
router.post('/deletepartner', ourPartnersController.deleteById);

    
module.exports=router