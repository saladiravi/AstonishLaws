const pool = require('../db/db')


exports.addCaseContent = async (req, res) => {
    const { case_category_id, case_id ,case_content} = req.body;
    if (!case_category_id && !case_id && !case_id) {
        return res.status(404).json({
            message: " Required Case , Case Category",
            statusCode: 404
        })
    }
    try {
             const casefile = req.files && req.files.case_file
            ? `uploads/${req.files.case_file[0].filename}`
            : null;

        const content = await pool.query(`INSERT INTO 
            tbl_case_details(case_category_id, case_id ,case_file,case_content) values($1,$2,$3,$4) RETURNING * `
            , [case_category_id, case_id ,casefile,case_content]);
        return res.status(200).json({
            message: " Successfully Created",
            statusCode: 200,
            case: content.rows[0]
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            statusCode: 500
        })
    }
}

exports.getAllCaseContent = async (req, res) => {
    try {
        const content = await pool.query(`
            SELECT
                ctd.case_details_id,
                ctd.case_file,
                ctd.case_content,
                c.case_id,
                cc.case_name,
                c.case_title_name,
                cc.case_category_id
            FROM tbl_case_details ctd
            JOIN tbl_cases c ON ctd.case_id = c.case_id
            JOIN tbl_case_category cc ON ctd.case_category_id = cc.case_category_id
        `);

        if (!content.rows || content.rows.length === 0) {
            return res.status(404).json({
                message: "Not Found Content",
                statusCode: 404
            });
        }

        return res.status(200).json({
            message: "Successfully fetched Content",
            statusCode: 200,
            cases: content.rows
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
            statusCode: 500
        });
    }
};


exports.getCaseById = async (req, res) => {
    const { case_id } = req.body;

    if (!case_id) {
        return res.status(400).json({
            statusCode: 400,
            message: "case_id is required"
        });
    }

    try {
        const content = await pool.query(`
            SELECT
                cd.case_details_id,
                cd.case_file,
                cd.case_content,
                c.case_id,
                c.case_title_name
               
            FROM tbl_cases c
            JOIN tbl_case_details cd ON cd.case_id = c.case_id
            WHERE c.case_id = $1
        `, [case_id]);

        if (!content.rows || content.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "No content found for the given case_id"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: "Successfully fetched case details",
            case: content.rows
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            message: "Server Error"
        });
    }
};