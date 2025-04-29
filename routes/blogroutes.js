const blogs=require('../Controller/blogController');
const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');

router.post('/addblogs', upload.single(), blogs.addblog);
router.get('/getblogs',blogs.getAllBlogs);
router.post('/getblogByid',blogs.getBlogById);
router.post('/deleteblog',blogs.deleteBlog);
router.post('/updateBlog', upload.any(),blogs.updateBlog);
 

module.exports=router
 