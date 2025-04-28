const express = require("express");
const path = require("path");
const cors = require("cors");

 
const adminRoutes = require('./routes/adminroutes');
const carouselRoutes=require('./routes/carouselroutes');
const caseRoutes=require('./routes/caseroutes');
const eventRoute=require('./routes/eventroutes');
const adsRoutes=require('./routes/adsroutes');
const blogRoutes=require('./routes/blogroutes');
const contactRoutes=require('./routes/contactroutes');

 
 
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


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
