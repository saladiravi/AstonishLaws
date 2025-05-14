const vacancyController=require('../Controller/vacancyController');

const express=require('express');
const router=express.Router();


router.post("/addVacancy",vacancyController.addVacancy);
router.get("/getAllVacancyData",vacancyController.getAllVacancyData)
router.get("/getVacantById",vacancyController.getVacancyById)
router.put("/updateVacancy", vacancyController.updateVacancy)
router.delete("/deleteVacancy", vacancyController.deleteVacancy)

module.exports=router;