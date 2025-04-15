const pool = require('../db/db');
const bcrypt = require('bcryptjs');


exports.addCase = async (req, res) => {
    const { case_category,lawyer_name,case_description,work_description,analyzing_description,investigation_description,court_law_sucess_description,case_title } = req.body

    try {
        if (!case_category) {
            return res.status(400).json({ error: 'case_category required' });

        }


      
        const caseImage = req.files && req.files.case_image
            ? `uploads/${req.files.case_image[0].filename}`
            : null;


            const cases = await pool.query(
                `INSERT INTO public.tbl_cases (
                  case_category,
                  case_image,
                  lawyer_name,
                  case_description,
                  work_description,
                  analyzing_description,
                  investigation_description,
                  court_law_sucess_description,
                  case_title
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [
                  case_category,
                  caseImage,
                  lawyer_name,
                  case_description,
                  work_description,
                  analyzing_description,
                  investigation_description,
                  court_law_sucess_description,
                  case_title
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




exports.getallCases = async (req, res) => {
    try {
        const allcases= await pool.query("SELECT * FROM tbl_cases");
        res.status(200).json({
            statusCode: 200,
            message: 'Cases Fetched Sucessfully',
            case: allcases.rows,
        })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server error' })
    }
}

exports.getcasesByid = async (req, res) => {
    try {
        const { case_id } = req.body;

        const caseid = await pool.query(
            "SELECT * FROM tbl_cases WHERE case_id=$1",
            [case_id]
        );

        if (caseid.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "case not found"
            })
        }
        res.status(200).json({
            statusCode: 200,
            message: 'case fectched sucessfully',
            case: caseid.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'internal Server error'
        })
    }
}


exports.updateCase = async (req, res) => {
    try {
        const { case_id, case_category,lawyer_name,case_description,work_description,analyzing_description,investigation_description,court_law_sucess_description,case_title } = req.body;
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

        if (case_category) {
            fields.push(`"case_category"=$${index++}`);
            values.push(case_category);
        }

        if (caseimage) {
            fields.push(`"case_image"=$${index++}`);
            values.push(caseimage);
        }

         

        if (lawyer_name) {
            fields.push(`"lawyer_name"=$${index++}`);
            values.push(lawyer_name);
        }

        if (case_description) {
            fields.push(`"case_description"=$${index++}`);
            values.push(case_description);
        }

        if (work_description) {
            fields.push(`"work_description"=$${index++}`);
            values.push(work_description);
        }

        if (analyzing_description) {
            fields.push(`"analyzing_description"=$${index++}`);
            values.push(analyzing_description);
        }

        if (investigation_description) {
            fields.push(`"investigation_description"=$${index++}`);
            values.push(investigation_description);
        }

        if (court_law_sucess_description) {
            fields.push(`"court_law_sucess_description"=$${index++}`);
            values.push(court_law_sucess_description);
        }


        if (case_title) {
            fields.push(`"case_title"=$${index++}`);
            values.push(case_title);
        }



        values.push(case_id);

        if (fields.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: 'No fields provided to update',
            });
        }

        const query = `
            UPDATE tbl_cases
            SET ${fields.join(', ')}
            WHERE "case_id"=$${index}
            RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Category Not Found',
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
            'SELECT * FROM tbl_cases WHERE case_id = $1',
            [case_id]
        );

        if (checkCase.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Case not found',
            });
        }


        const deleteCase = await pool.query(
            'DELETE FROM tbl_cases WHERE case_id = $1 RETURNING *',
            [case_id]
        );

        res.status(200).json({
            statusCode: 200,
            message: 'Category deleted successfully',
            deleteCase: deleteCase.rows[0],
        });

    } catch (error) {
        
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};

