const pool = require('../db/db')
 
exports.addCaseTitle = async (req, res) => {
    const { case_title_name, case_id } = req.body;
 
    if (!case_title_name) {
        return res.status(404).json({ message: "case title is not Found" })
    }
 
   
    try {
 
        const cases = await pool.query(`INSERT INTO tbl_case_title(case_title_name, case_id) VALUES($1, $2) RETURNING * `, [case_title_name, case_id]);
 
 
        return res.status(201).json({
            statusCode: 200,
            message: "Case Title Created",
            case: cases.rows[0]
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Server error",
            statusCode: 500
        })
    }
}
 
exports.deleteCaseTitle = async (req, res) => {
    const { case_title_id } = req.body;
 
    if (!case_title_id) {
        return res.status(404).json({
            statusCode: 404,
            message: "not found case title id",
            
        })
    }
   try {
     
 
        const cases = await pool.query("Delete from tbl_case_title where case_title_id=$1 RETURNING *", [case_title_id]);
       
        if (cases.rows.length === 0) {
 
            res.status(404).json({
                message: "Not Found care title id",
                statusCode: 404
            })
 
        }
 
        return res.status(200).json({
            message: "Deleted case title",
            statusCode: 200
        })
 
 
 
 
 
    } catch (err) {
       
        return res.status(500).json({
            message: "server error",
            statusCode: 500
        })
    }
 
 
}
 
 
 
 
 
exports.updateCaseTitle = async (req, res) => {
    const { case_title_name, case_id, case_title_id } = req.body;
 
    // Validation: case_title_id is required, and at least one of case_title_name or case_id
    if (!case_title_id || (!case_title_name && !case_id)) {
        return res.status(400).json({
            message: "case_title_id is required, and either case_title_name or case_id must be provided.",
            statusCode: 400
        });
    }
 
    try {
        // Build dynamic SET clause depending on which fields are provided
        const fields = [];
        const values = [];
        let index = 1;
 
        if (case_title_name) {
            fields.push(`case_title_name = $${index++}`);
            values.push(case_title_name);
        }
 
        if (case_id) {
            fields.push(`case_id = $${index++}`);
            values.push(case_id);
        }
 
        values.push(case_title_id); // for WHERE clause
 
        const updateQuery = `
            UPDATE tbl_case_title
            SET ${fields.join(', ')}
            WHERE case_title_id = $${index}
            RETURNING *;
        `;
 
        const result = await pool.query(updateQuery, values);
 
        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "case_title_id not found",
                statusCode: 404
            });
        }
 
        return res.status(200).json({
            message: "Updated case details",
            statusCode: 200,
              data: result.rows[0]
        });
 
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error",
            statusCode: 500
        });
    }
};
 
exports.getAllCaseTitles = async (req, res) => {
 
    try {
 
        const cases = await pool.query("SELECT ct.case_title_id, ct.case_title_name,ct.case_id, c.case_name  FROM tbl_case_title ct JOIN tbl_case c ON ct.case_id=c.case_id");
 
        if (!cases || cases.rows.length === 0) {
            return res.status(404).json({
                message: "Cases are not found",
                statusCode: 404
            })
        }
 
        return res.status(200).json({
            message: "Successfully fetched Cases title",
            statusCode: 200,
            cases: cases.rows
        })
 
    }
    catch (err) {
        
        return res.status(500).json({
            message: "server error",
            statusCode: 500
        }
        )
    }
}
 
exports.getCaseTitleById = async (req, res) => {
    const { case_title_id } = req.body;
 
    if (!case_title_id) {
        return res.status(404).json({
            message: "required case title id",
            statusCode: 404
        })
    }
 
    try {
 
        const cases = await pool.query("SELECT ct.case_title_id, ct.case_title_name,ct.case_id, c.case_name FROM tbl_case_title ct JOIN tbl_case c on ct.case_id=c.case_id where case_title_id=$1", [case_title_id])
 
        if (!cases || cases.rows.length === 0) {
            return res.status(404).json({
                message: "Not Found case title"
            })
        }
        return res.status(200).json({
            message: "Successfully fetched case title",
            statusCode: 200,
            case: cases.rows[0]
        })
    }
    catch (error) {
       
        return res.status(500).json({
            message: "server error",
            statusCode: 500
        }
        )
    }
}