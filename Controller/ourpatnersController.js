const pool = require("../db/db");

// Get All Partners
exports.getAllPartners = async (req, res) => {
    try {
        const partners = await pool.query("SELECT * FROM tbl_our_partners");

        if (!partners || partners.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "No partners found"
            });
        }

        return res.status(200).json({
            message: "Successfully fetched partners",
            statusCode: 200,
            partners: partners.rows
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server Error",
            statusCode: 500
        });
    }
};

// Create Partner
exports.createPartner = async (req, res) => {
    const { partner_name } = req.body;
    const partner_image = req.files?.partner_image?.[0]?.filename
        ? `uploads/${req.files.partner_image[0].filename}`
        : null;

    

    try {
        const partnersresult=await pool.query(
            "INSERT INTO tbl_our_partners (partner_name, partner_image) VALUES ($1, $2) RETURNING *",
            [partner_name, partner_image]
        );

        return res.status(200).json({
            statusCode: 200,
            message: "Partner created successfully",
            partners:partnersresult.rows[0]
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            statusCode: 500
        });
    }
};

// Delete Partner by ID
exports.deleteById = async (req, res) => {
    const { partner_id } = req.body;

    if (!partner_id) {
        return res.status(400).json({
            message: "Partner ID is required",
            statusCode: 400
        });
    }

    try {
        const result = await pool.query(
            "DELETE FROM tbl_our_partners WHERE partner_id = $1",
            [partner_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Partner ID does not exist",
                statusCode: 404
            });
        }

        return res.status(200).json({
            message: "Partner deleted successfully",
            statusCode: 200
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            statusCode: 500
        });
    }
};

// Update Partner
exports.updatePartner = async (req, res) => {
    const { partner_name, partner_id } = req.body;

    const partner_image = req.files?.partner_image?.[0]?.filename
        ? `uploads/${req.files.partner_image[0].filename}`
        : null;

    if ( !partner_id) {
        return res.status(400).json({
            message: "Partner  Is required",
            statusCode: 400
        });
    }

    try {
        const result = await pool.query(
            "UPDATE tbl_our_partners SET partner_name = $1, partner_image = $2 WHERE partner_id = $3 RETURNING *",
            [partner_name, partner_image, partner_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Partner ID does not exist",
                statusCode: 404
            });
        }

        return res.status(200).json({
            message: "Partner updated successfully",
            statusCode: 200,
            partner:result.rows[0]
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            statusCode: 500
        });
    }
};
