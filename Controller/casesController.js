const pool = require('../db/db')
 
exports.addCaseTitle = async (req, res) => {
    const { case_title_name, case_category_id } = req.body;
 
    if (!case_title_name) {
        return res.status(404).json({ message: "case title is not Found" })
    }
 
   
    try {
 
        const cases = await pool.query(`INSERT INTO tbl_cases(case_title_name, case_category_id) VALUES($1, $2) RETURNING * `, [case_title_name, case_category_id]);
 
 
        return res.status(200).json({
            statusCode: 200,
            message: "Sucessfully Add Case",
            case: cases.rows[0]
        })
    } catch (error) {
         return res.status(500).json({
            message: "Internal Server Error",
            statusCode: 500
        })
    }
}
 
exports.deleteCaseTitle = async (req, res) => {
    const { case_id } = req.body;
 
    if (!case_id) {
        return res.status(404).json({
            statusCode: 404,
            message: "Not found case title",
            
        })
    }
   try {
     
 
        const cases = await pool.query("Delete from tbl_cases where case_id=$1 RETURNING *", [case_id]);
       
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
    const { case_title_name, case_category_id, case_id } = req.body;
 
    // Validation: case_id is required, and at least one of case_title_name or case_category_id
    if (!case_id ,case_category_id) {
        return res.status(400).json({
            message: "Required Filed missing",
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
 
        if (case_category_id) {
            fields.push(`case_category_id = $${index++}`);
            values.push(case_category_id);
        }
 
        values.push(case_id); // for WHERE clause
 
        const updateQuery = `
            UPDATE tbl_cases
            SET ${fields.join(', ')}
            WHERE case_id = $${index}
            RETURNING *;
        `;
 
        const result = await pool.query(updateQuery, values);
 
        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "case_id not found",
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
 
        const cases = await pool.query("SELECT ct.case_id, ct.case_title_name,ct.case_category_id, c.case_name  FROM tbl_cases ct JOIN tbl_case_category c ON ct.case_category_id=c.case_category_id");
 
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
    const { case_id } = req.body;
 
    if (!case_id) {
        return res.status(400).json({
            message: "required case  id",
            statusCode: 400
        })
    }
 
    try {
 
     const cases = await pool.query(
    `SELECT ct.case_id, ct.case_title_name, ct.case_category_id, c.case_name 
     FROM tbl_cases ct 
     JOIN tbl_case_category c 
     ON ct.case_category_id = c.case_category_id 
     WHERE ct.case_id = $1`, 
     [case_id]
);

        if (!cases || cases.rows.length === 0) {
            return res.status(404).json({
                message: "Not Found case title"
            })
        }
        return res.status(200).json({
            message: "Successfully fetched Cases",
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