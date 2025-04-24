const pool = require('../db/db');

exports.adsmanagement = async (req, res) => {
    try {

       
        const addsimage = req.files?.ads_image?.[0]?.filename
            ? `uploads/${req.files.ads_image[0].filename}`
            : null

            if (!addsimage) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'ads_image file is required'
                });
            }
        const ads = await pool.query(`INSERT INTO public.tbl_ads(ads_image) values($1) RETURNING *`,
            [addsimage]);  

        res.status(200).json({
            statusCode: 200,
            message: 'ads Image Added sucessfully',
            ads: ads.rows[0]   
        })

    } catch (error) {
        res.status(500).json({
            statusCode: 'Internal Server error'
        })
    }
}


exports.getallads = async (req, res) => {
    try {
        const allads = await pool.query("SELECT * FROM tbl_ads");
        res.status(200).json({
            statusCode: 200,
            message: 'Ads Fetched Sucessfully',
            ads: allads.rows,
        })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server error' })
    }
}

exports.getadsByid = async (req, res) => {
    try {
        const { ads_id } = req.body;

        const adsid = await pool.query(
            "SELECT * FROM tbl_ads WHERE ads_id=$1",
            [ads_id]
        );

        if (adsid.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "image not found"
            })
        }
        res.status(200).json({
            statusCode: 200,
            message: 'Ads fectched sucessfully',
            Ads: adsid.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'internal Server error'
        })
    }
}


exports.updateads= async (req, res) => {
    try {
        const { ads_id } = req.body;  
        const fields = [];
        const values = [];
        let index = 1;
 
        if (!ads_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Ads ID is required for updating'
            });
        }

        
        const adsImage = req.files?.ads_image?.[0]?.filename
            ? `uploads/${req.files.ads_image[0].filename}`
            : null;

       
        if (adsImage) {
            fields.push(`"ads_image"=$${index++}`);
            values.push(adsImage);
        }

        values.push(ads_id);  

       
        if (fields.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: 'No fields provided to update'
            });
        }

      
        const query = `
            UPDATE public.tbl_ads
            SET ${fields.join(', ')}
            WHERE "ads_id"=$${index}
            RETURNING *`;

        const result = await pool.query(query, values);

      
        if (result.rowCount === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Ads image not found'
            });
        }

        // Success response
        res.status(200).json({
            statusCode: 200,
            message: 'Ads updated successfully',
            ads: result.rows[0],
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};


exports.deleteAds = async (req, res) => {
    try {
        const { ads_id } = req.body;

        if (!ads_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Ads ID is required',
            });
        }


        const checkAds = await pool.query(
            'SELECT * FROM tbl_ads WHERE ads_id = $1',
            [ads_id]
        );

        if (checkAds.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Ads not found',
            });
        }


        const deleteads = await pool.query(
            'DELETE FROM tbl_ads WHERE ads_id = $1 RETURNING *',
            [ads_id]
        );

        res.status(200).json({
            statusCode: 200,
            message: ' deleted successfully',
            deletedAds: deleteads.rows[0],
        });

    } catch (error) {

        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};
