const pool = require("../db/db");

exports.addfaqs = async (req, res) => {
  
    const { question, answer } = req.body;

    if (!question || !answer ) {
        return res.status(400).json({
            statusCode: 400,
            message: "Required fields are missing"
        });
    }

    try {
        const faq = await pool.query(
            `INSERT INTO tbl_faqs(question, answer) 
             VALUES($1, $2) RETURNING *`,
            [question, answer]
        );

        return res.status(200).json({
            statusCode: 200,
            message: "FAQ Added Successfully",
            faq: faq.rows[0]
        });
    } catch (error) {
   
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        });
    }
};


exports.getfaqid = async (req, res) => {
    const { faqs_id } = req.body;
    if (isNaN(faqs_id)) {
        return res.status(400).json({
            statusCode: 400,
            message: "invalid FAQ Id"
        });
    }
    try {
        const faq = await pool.query("Select * From tbl_faqs where faqs_id=$1", [faqs_id]);
        if (faq.rows.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: `FAQ not found with Id ${faqs_id}`
            })
        }
        else {
            return res.status(200).json({
                statusCode: 200,
                message: "successfull fetched the Data",
                faq: faq.rows[0]
            })
        }
    }
    catch (error) {
      
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
        })
    }
}

exports.updatefaqs = async (req, res) => {

    const { faqs_id, question, answer } = req.body;

    // Check if vacancy_id is valid
    if (isNaN(faqs_id)) {
        return res.status(400).json({
            statusCode: 400,
            message: "Invalid FAQ ID"
        });
    }


    if (!question && !answer) {
        return res.status(400).json({
            statusCode: 400,
            message: "Required fields are missing"
        });
    }

  try {

        const result = await pool.query(
            `UPDATE tbl_faqs
             SET question = $1, answer = $2
             WHERE faqs_id = $3
             RETURNING *`,
            [question, answer, faqs_id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                statusCode:404,
                message: `FAQ ID ${faqs_id} not found`
            });
        }


        return res.status(200).json({
            statusCode: 200,
            message: "FAQ  updated successfully",
            updatedFaq: result.rows[0]
        });
    } catch (error) {

        return res.status(500).json({
            satusCode: 500,
            message: "Internal Server Error",

        });
    }
};


exports.deleteFaq = async (req, res) => {
    const { faqs_id } = req.body;


    if (isNaN(faqs_id)) {
        return res.status(400).json({
            statusCode:400,
            message: "Invalid Faq ID"
        });
    }

    try {

        const result = await pool.query(
            "DELETE FROM tbl_faqs WHERE faqs_id = $1 RETURNING *",
            [faqs_id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                statusCode:404,
                message: "FAQ not found"
            });
        }

        // Return a success response
        return res.status(200).json({
            statusCode: 200,
            message: "FAQ deleted successfully",
            deletedTeam: result.rows[0]
        });
    } catch (error) {

        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",

        });
    }
};


exports.getAllFAQ = async (req, res) => {
    try {

        const result = await pool.query("SELECT * FROM tbl_faqs");


        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "No Faq found"
            });
        }


        return res.status(200).json({
            statusCode: 200,
            message: "FAQ fetched successfully",
            faq: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:500,
            message: "Internal Server Error",
           
        });
    }
};


