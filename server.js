const express = require("express");
const path = require("path");
const cors = require("cors");
const cron = require('node-cron');
const pool= require('./db/db');

 
const adminRoutes = require('./routes/adminroutes');
const carouselRoutes=require('./routes/carouselroutes');
const caseRoutes=require('./routes/caseroutes');
const eventRoute=require('./routes/eventroutes');
const adsRoutes=require('./routes/adsroutes');
const blogRoutes=require('./routes/blogroutes');
const contactRoutes=require('./routes/contactroutes');
const galleryRoutes=require('./routes/galleryroutes');
const vacancyRoutes=require('./routes/vacancyroutes');
const mailRoutes=require('./routes/mailroutes');
const casesRoute=require('./routes/caseroute')
const caseTitleRoute=require('./routes/caseTitleRoute')
 
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use(express.json());
app.use(cors()); 
 
app.use('/admin', adminRoutes);
app.use('/carousel',carouselRoutes);
app.use('/case',caseRoutes);
app.use('/event',eventRoute);
app.use('/ads',adsRoutes);
app.use('/blog',blogRoutes);
app.use('/contact',contactRoutes);
app.use('/gallery',galleryRoutes);
app.use('/vacancy',vacancyRoutes);
app.use('/mail',mailRoutes);
app.use('/cases',casesRoute);
app.use('/title',caseTitleRoute);



app.listen(5000, () => {
    console.log("Server is running on port 5000");
});


cron.schedule('* * * * *', async () => {
  
  try {
    const result = await pool.query(`
      DELETE FROM tbl_ads WHERE expiry_date <= CURRENT_DATE RETURNING *;
    `);
    
  } catch (err) {
    console.error("❌ Error deleting expired ads:", err.message);
  }
});