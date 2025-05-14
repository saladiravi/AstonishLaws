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

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

cron.schedule('0 0 * * *', async () => {
  try {
    await pool.query(`DELETE FROM tbl_ads WHERE expiry_date <= CURRENT_DATE`);
    console.log("✅ Expired ads deleted at midnight.");
  } catch (err) {
    console.error("❌ Error deleting expired ads:", err);
  }
});