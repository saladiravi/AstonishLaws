const pool = require("../db/db");


exports.addClientreview = async (req, res) => {
    const { name, profession, message } = req.body;


    if (!name || !message) {
        return res.status(400).json({
            statusCode: 400,
            message: "Required fields are missing"
        });
    }
    try {
        const reviews = await pool.query(
            `INSERT INTO tbl_client_reviews( name, profession, message) 
             VALUES($1, $2, $3) RETURNING *`,
            [name, profession, message]
        );


        return res.status(200).json({
            statusCode: 200,
            message: "Reviews Added Successfully",
            reviews: reviews.rows[0]
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",

        });
    }
};


exports.getClientreviewid = async (req, res) => {
    const { client_review_id } = req.body;
    if (isNaN(client_review_id)) {
        return res.status(400).json({ message: "invalid Review  Id" });
    }
    try {
        const review = await pool.query("Select * From tbl_client_reviews where client_review_id=$1", [client_review_id]);
        if (review.rows.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: `Reviews not found with Id ${client_review_id}`
            })
        }
        else {
            return res.status(200).json({
                statusCode: 200,
                message: "successfull fetched the Data",
                reviews: review.rows[0]
            })
        }
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}

exports.updateReview = async (req, res) => {

    const { client_review_id, name, profession, message } = req.body;

    // Check if vacancy_id is valid
    if (isNaN(client_review_id)) {
        return res.status(400).json({
            statusCode: 400,
            message: "Invalid Review ID"
        });
    }


    if (!name && !message) {
        return res.status(400).json({
            statusCode: 400,
            message: "Required fields are missing"
        });
    }




    try {

        const result = await pool.query(
            `UPDATE tbl_client_reviews
             SET name = $1, profession = $2, message = $3
             WHERE client_review_id = $4
             RETURNING *`,
            [name, profession, message, client_review_id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: `Client Review ID ${client_review_id} not found`
            });
        }


        return res.status(200).json({
            statusCode: 200,
            message: "Reviews  updated successfully",
            updatedreview: result.rows[0]
        });
    } catch (err) {

        return res.status(500).json({
            statuscode: 500,
            message: "Internal Server Error",
            err: err.message
        });
    }
};


exports.deleteReview = async (req, res) => {
    const { client_review_id } = req.body;


    if (isNaN(client_review_id)) {
        return res.status(400).json({
            statusCode:400,
            message: "Invalid client ID"
        });
    }

    try {

        const result = await pool.query(
            "DELETE FROM tbl_client_reviews WHERE client_review_id = $1 RETURNING *",
            [client_review_id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                statusCode:404,
                message: "Review not found"
            });
        }

        // Return a success response
        return res.status(200).json({
            statusCode: 200,
            message: "Reviews deleted successfully",
            deletedReviews: result.rows[0]
        });
    } catch (error) {

        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",

        });
    }
};


exports.getAllReviewsData = async (req, res) => {
    try {

        const result = await pool.query("SELECT * FROM tbl_client_reviews");


        if (result.rows.length === 0) {
            return res.status(404).json({
                statusCode:400,
                message: "No Reviews found"
            });
        }


        return res.status(200).json({
            statusCode: 200,
            message: "Reviews fetched successfully",
            reviews: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",

        });
    }
};


