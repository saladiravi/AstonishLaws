const pool = require('../db/db');
const bcrypt = require('bcryptjs');
 
 
exports.addcasecategory = async (req, res) => {
    const { case_name } = req.body
 
    try {
        if (!case_name) {
            return res.status(400).json({ error: 'case_name required' });
 
        }
 
 
     
        const caseImage = req.files && req.files.case_image
            ? `uploads/${req.files.case_image[0].filename}`
            : null;
 
 
            const cases = await pool.query(
                `INSERT INTO public.tbl_case (
                  case_name,
                  case_image
                ) VALUES ($1, $2) RETURNING *`,
                [
                  case_name,
                  caseImage
                ]
              );
             
 
 
        res.status(200).json({
            statusCode: 200,
            message: 'Case Added Successfully',
            case: cases.rows[0],
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}
 
 
 
 
 
 
 
 
 
exports.getCasesById = async (req, res) => {
    try {
      const { case_id } = req.body;
console.log(case_id);
        const data = await pool.query(
            "SELECT * FROM tbl_case WHERE case_id=$1",
            [case_id]
        );
console.log(1);
        if (data.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "case not found"
            })
        }
        console.log(3);
        res.status(200).json({
            statusCode: 200,
            message: 'case fectched sucessfully',
            case: data.rows[0]
        })
        console.log(4);
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'internal Server error'
        })
    }
}
 
 
 
 
 
 
exports.updateCase = async (req, res) => {
    try {
        const { case_id, case_name } = req.body;
        let caseimage = null;
 
       
        if (req.files?.case_image?.[0]?.filename) {
            caseimage = `uploads/${req.files.case_image[0].filename}`;
        }
 
       
        if (!case_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Case ID is required',
            });
        }
 
        const fields = [];
        const values = [];
        let index = 1;
 
       
        if (caseimage) {
            fields.push(`"case_image"=$${index++}`);
            values.push(caseimage);
        }
 
         
 
if (case_name) {
    fields.push(`"case_name"=$${index++}`);
    values.push(case_name);
}
 
       
 
     
 
 
        values.push(case_id);
 
        if (fields.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: 'No fields provided to update',
            });
        }
 
        const query = `
            UPDATE tbl_case
            SET ${fields.join(', ')}
            WHERE "case_id"=$${index}
            RETURNING *`;
 
        const result = await pool.query(query, values);
 
        if (result.rowCount === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'case Not Found',
            });
        }
 
        res.status(200).json({
            statusCode: 200,
            message: 'Case Updated Successfully',
            case: result.rows[0],
        });
 
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            details: error.message,
        });
    }
};
 
 
exports.deleteCase = async (req, res) => {
    try {
        const { case_id } = req.body;
 
        if (!case_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Case ID is required',
            });
        }
 
 
        const checkCase = await pool.query(
            'SELECT * FROM tbl_case WHERE case_id = $1',
            [case_id]
        );
 
        if (checkCase.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Case not found',
            });
        }
 
 
        const deleteCase = await pool.query(
            'DELETE FROM tbl_case WHERE case_id = $1 RETURNING *',
            [case_id]
        );
 
        res.status(200).json({
            statusCode: 200,
            message: 'Case deleted successfullyy',
            deleteCase: deleteCase.rows[0],
        });
 
    } catch (error) {
       
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};
 


exports.getallcaseCategory = async (req, res) => {
    try {
        const allcases = await pool.query("SELECT * FROM tbl_case");
        res.status(200).json({
            statusCode: 200,
            message: 'Case Fetched Sucessfully',
            cases: allcases.rows,
        })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server error' })
    }
}