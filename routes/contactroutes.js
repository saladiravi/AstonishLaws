const contact=require('../Controller/contactController');
const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');

router.post('/addcontact',contact.addContact);

router.get('/getallContact',contact.getContacts);
router.post('/getcontactByid',contact.getcontactByid);
router.post('/updateContacts',contact.updateContact);
router.get('/getcontactlatest',contact.getContactlatest);
router.post('/deletecontact',contact.deleteContact);


module.exports=router
