const pool = require('../db/db');

exports.addgallery = async (req, res) => {
    try {
        const title = req.body.title;

        const galleryimage = req.files?.gallery_image?.[0]?.filename
            ? `uploads/${req.files.gallery_image[0].filename}`
            : null;

        const gallery = await pool.query(
            `INSERT INTO public.tbl_gallery(title, gallery_image) VALUES($1, $2) RETURNING *`,
            [title, galleryimage]
        );

        res.status(200).json({
            statusCode: 200,
            message: 'Gallery image added successfully',
            gallery: gallery.rows[0]
        });

    } catch (error) {
        console.error("Error in addgallery:", error);  // optional for debugging
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
};



exports.getGalleryByid = async (req, res) => {
    try {
        const { gallery_id } = req.body;

        const galleryid = await pool.query(
            "SELECT * FROM tbl_gallery WHERE gallery_id=$1",
            [gallery_id]
        ); 

        if (galleryid.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "image not found"
            })
        }
        res.status(200).json({
            statusCode: 200,
            message: 'gallery fectched sucessfully',
            gallery: galleryid.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'internal Server error'
        })
    }
}


exports.updategallery = async (req, res) => {
    try {
        const { gallery_id, title } = req.body;
        const fields = [];
        const values = [];
        let index = 1;

        if (!gallery_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'gallery_id is required for updating'
            });
        }

        // Get uploaded image
        const galleryImage = req.files?.gallery_image?.[0]?.filename
            ? `uploads/${req.files.gallery_image[0].filename}`
            : null;

        if (galleryImage) {
            fields.push(`gallery_image = $${index++}`);
            values.push(galleryImage);
        }

        if (title) {
            fields.push(`title = $${index++}`);
            values.push(title);
        }

        // No fields to update
        if (fields.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: 'No fields provided to update'
            });
        }

        // Add gallery_id to WHERE clause
        values.push(gallery_id);

        const query = `
            UPDATE tbl_gallery
            SET ${fields.join(', ')}
            WHERE gallery_id = $${index}
            RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Gallery not found'
            });
        }

        res.status(200).json({
            statusCode: 200,
            message: 'Gallery updated successfully',
            gallery: result.rows[0]
        });

    } catch (error) {
        console.error("Error in updategallery:", error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};



exports.deletegallery = async (req, res) => {
    try {
        const { gallery_id } = req.body;

        if (!gallery_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Gallery ID is required',
            });
        }


        const checkgallery = await pool.query(
            'SELECT * FROM tbl_gallery WHERE gallery_id = $1',
            [gallery_id]
        );

        if (checkgallery.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'gallery not found',
            });
        }


        const deletegallery = await pool.query(
            'DELETE FROM tbl_gallery WHERE gallery_id = $1 RETURNING *',
            [gallery_id]
        );

        res.status(200).json({
            statusCode: 200,
            message: 'Gallery deleted successfully',
            deletedgallery: deletegallery.rows[0],
        });

    } catch (error) {

        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};


exports.getallGallery = async (req, res) => {
    try {
        const allGallery = await pool.query("SELECT * FROM tbl_gallery");
        res.status(200).json({
            statusCode: 200,
            message: 'Gallery Fetched Sucessfully',
            Gallery: allGallery.rows,
        })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server error' })
    }
}