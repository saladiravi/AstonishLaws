const galleryController = require('../Controller/galleryController');

const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');

router.post('/addgallery', upload.fields([{ name: 'gallery_image', maxCount: 1 }]), galleryController.addgallery);


router.get('/getallGallery', galleryController.getallGallery);
router.post('/getgallerybyId', galleryController.getGalleryByid);
router.post('/updateGallery',upload.fields([
      {name:'gallery_image',maxCount:1}]), galleryController.updategallery) ;

router.post('/deletegallery', galleryController.deletegallery);

    
module.exports=router
