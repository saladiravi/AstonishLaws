const pool = require("../db/db");

exports.addAboutImage = async (req, res) => {
    const about_img = req.files && req.files.about_img ?
        `uploads/${req.files.about_img[0].filename}`
        : null;

    if (!about_img) {
        return res.status(400).json({
            message: "Required about image",
            statusCode: 400
        })
    }

    try {

        const about = await pool.query("INSERT INTO tbl_about(about_img) values ($1) RETURNING *", [about_img]);

        if (!about || about.rows.length === 0) {
            return res.status(500).json({
                message: "failed to add about image",
                statusCode: 500
            })
        }


        return res.status(200).json({
            message: "Successfully added image",
            statusCode: 200,
            about: about.rows[0]

        })
    } catch (error) {

        console.log(error);


        return res.status(500).json({
            message: "Server error",
            statusCode: 500
        })
    }
}


exports.getAllAboutImage = async (req, res) => {
    try {

        const abouts = await pool.query("SELECT * FROM tbl_about");

        if (!abouts || abouts.rows.length === 0) {
            return res.status(500).json({
                message: "failed to Fetch about image",
                statusCode: 500
            })
        }

        return res.status(200).json({
            message: "Successfully fetched image",
            statusCode: 200,
            abouts: abouts.rows

        })



    } catch (error) {
        console.log(error);


        return res.status(500).json({
            message: "Server error",
            statusCode: 500
        })

    }
}


exports.getRecentAboutImage = async (req, res) => {
    try {
        const about = await pool.query("SELECT * FROM tbl_about ORDER BY about_id DESC LIMIT 1");

        if (!about || about.rows.length === 0) {
            return res.status(404).json({
                message: "No about image found",
                statusCode: 404
            });
        }

        return res.status(200).json({
            message: "Successfully fetched image",
            statusCode: 200,
            about: about.rows[0]
        });

    } catch (error) {
        console.error("getRecentAboutImage error:", error);
        return res.status(500).json({
            message: "Server error",
            statusCode: 500
        });
    }
};



exports.deleteAboutById = async (req, res) => {
    const { about_id } = req.body;

    if (!about_id) {

        return res.status(404).json({
            message: "Required about id",
            statusCode: 404
        })

    }


    try {
     const about = await pool.query("DELETE FROM tbl_about WHERE about_id = $1 RETURNING *", [about_id]);

        if (!about || about.rows.length == 0) {


            return res.status(500).json({
                message: "failed to deleted about image",
                statusCode: 500
            })



        }
        return res.status(200).json({
            message: "Delete about Image",
            statusCode: 200,
            about: about.rows[0]
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            statusCode: 500
        })
    }
}

exports.updateAboutById=async( req, res)=>{

    const{about_id}=req.body;

     const about_img = req.files && req.files.about_img ?
        `uploads/${req.files.about_img[0].filename}`
        : null;

    if(!about_id || !about_img){

         return res.status(400).json({
            message: "Required about image and Id",
            statusCode: 400
        })

    }

    try{


        const updatedAbout=await pool.query("UPDATE tbl_about SET about_img = $1 WHERE about_id = $2 RETURNING *",
            [about_img, about_id]);

        if(!updatedAbout || updatedAbout.rows.length===0){

             return res.status(404).json({
                message: "No record found with the given about_id",
                statusCode: 404
            })

        }

          return res.status(200).json({
            message: "Updated about Image",
            statusCode: 200,
            updatedAbout: updatedAbout.rows[0]
        });


    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            statusCode: 500
        })

    }

}