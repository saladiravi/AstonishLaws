const vacancyController=require('../Controller/vacancyController');

const express=require('express');
const router=express.Router();


router.post("/addVacancy",vacancyController.addVacancy);
router.get("/getAllVacancyData",vacancyController.getAllVacancyData)
router.post("/getVacantById",vacancyController.getVacancyById)
router.post("/updateVacancy", vacancyController.updateVacancy)
router.post("/deleteVacancy", vacancyController.deleteVacancy)

module.exports=router;