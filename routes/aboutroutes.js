const aboutController= require("../Controller/aboutController")

const express =require("express")

const router=express.Router();
const upload=require('../utils/fileupload');



router.post("/addAboutImage", upload.fields([{name:'about_img'}]),aboutController.addAboutImage);
router.get("/getAllAboutImage", aboutController.getAllAboutImage);
router.get("/getRecentAboutImage",aboutController.getRecentAboutImage);
router.post("/deleteAboutById",aboutController.deleteAboutById);
router.post("/updateAboutById",upload.fields([{name:'about_img'}]), aboutController.updateAboutById);

module.exports=router;