const blogs=require('../Controller/blogController');
const express=require('express');
const router=express.Router();
const upload=require('../utils/fileupload');

router.post('/addblogs',upload.fields([
    {name:'blog_image',maxCount:1},{name:'blog_file',maxCount:1}]), blogs.addblog);
 
router.get('/getblogs',blogs.getAllBlogs);
router.post('/getblogByid',blogs.getBlogById);
router.post('/deleteblog',blogs.deleteBlog);
router.post('/updateBlog', upload.fields([
    {name:'blog_image',maxCount:1},{name:'blog_file',maxCount:1}]),blogs.updateBlog);
router.post('/getBlogbycase',blogs.getBlogsByCaseCategoryId);


module.exports=router
 