const pool = require('../db/db');

exports.adsmanagement = async (req, res) => {
    try {
        const { ads_display, start_date, expiry_date } = req.body;

        // Convert from DD/MM/YYYY to YYYY-MM-DD
        const formatDate = (inputDate) => {
            const [day, month, year] = inputDate.split('/');
            return `${year}-${month}-${day}`;
        };

        const formattedStartDate = formatDate(start_date);
        const formattedExpiryDate = formatDate(expiry_date);

        const addsimage = req.files?.ads_image?.[0]?.filename
            ? `uploads/${req.files.ads_image[0].filename}`
            : null;

        const ads = await pool.query(
            `INSERT INTO public.tbl_ads (ads_image, ads_display, start_date, expiry_date) VALUES ($1, $2, $3, $4) RETURNING *`,
            [addsimage, ads_display, formattedStartDate, formattedExpiryDate]
        );

        res.status(200).json({
            statusCode: 200,
            message: 'Ads image added successfully',
            ads: ads.rows[0]
        });

    } catch (error) {
        console.error("Error in adsmanagement:", error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
};



exports.getallads = async (req, res) => {
    try {
        const allads = await pool.query(`
            SELECT * FROM tbl_ads
            ORDER BY 
                CASE 
                    WHEN ads_display = 'Primary' THEN 1
                    WHEN ads_display = 'Secondary' THEN 2
                    ELSE 3
                END,
                expiry_date ASC
        `);

        res.status(200).json({
            statusCode: 200,
            message: 'Ads Fetched Successfully',
            ads: allads.rows,
        });
    } catch (err) {
        console.error("Error fetching ads:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


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


exports.updateads = async (req, res) => {
    try {
        const { ads_id, ads_display, start_date, expiry_date } = req.body;

        const fields = [];
        const values = [];
        let index = 1;

        if (!ads_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Ads ID is required for updating',
            });
        }

        // Format date from DD/MM/YYYY to YYYY-MM-DD if needed
        const formatDate = (date) => {
            if (!date || date.includes('-')) return date; // already formatted
            const [day, month, year] = date.split('/');
            return `${year}-${month}-${day}`;
        };

        const formattedStartDate = formatDate(start_date);
        const formattedExpiryDate = formatDate(expiry_date);

        // Check for image
        const adsImage = req.files?.ads_image?.[0]?.filename
            ? `uploads/${req.files.ads_image[0].filename}`
            : null;

        if (adsImage) {
            fields.push(`"ads_image" = $${index++}`);
            values.push(adsImage);
        }

        if (ads_display) {
            fields.push(`"ads_display" = $${index++}`);
            values.push(ads_display);
        }

        if (formattedStartDate) {
            fields.push(`"start_date" = $${index++}`);
            values.push(formattedStartDate);
        }

        if (formattedExpiryDate) {
            fields.push(`"expiry_date" = $${index++}`);
            values.push(formattedExpiryDate);
        }

        // Final condition
        if (fields.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: 'No fields provided to update',
            });
        }

        values.push(ads_id); // for WHERE condition

        const query = `
            UPDATE public.tbl_ads
            SET ${fields.join(', ')}
            WHERE "ads_id" = $${index}
            RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Ad not found',
            });
        }

        res.status(200).json({
            statusCode: 200,
            message: 'Ad updated successfully',
            ads: result.rows[0],
        });

    } catch (error) {
        console.error("Error in updateads:", error);
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
