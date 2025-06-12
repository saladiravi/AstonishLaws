const pool = require('../db/db');



exports.addContact = async (req, res) => {
    const { email, ph_number, address ,altphunumber1,altphNumber2} = req.body;

    try {
        if (!email || !ph_number || !address) {
            return res.status(400).json({ error: 'email, ph_number, and address are required' });
        }

        const contact = await pool.query(
            `INSERT INTO public.tbl_contact (
                email,
                ph_number,
                address,
                altphunumber1,
                altphNumber2
            ) VALUES ($1, $2, $3,$4,$5) RETURNING *`,
            [email, ph_number, address,altphunumber1,altphNumber2]
        );

        res.status(200).json({
            statusCode: 200,
            message: 'Contact details Added Successfully',
            contact: contact.rows[0],
        });
    } catch (error) {
        
        res.status(500).json({ error: 'Internal server error' });
    }
};





exports.getContacts = async (req, res) => {
    try {
        const allcontact = await pool.query("SELECT * FROM tbl_contact");
        res.status(200).json({
            statusCode: 200,
            message: 'Contact Fetched Sucessfully',
            contact: allcontact.rows,
        })
    } catch (err) {
        res.status(500).json({ message: 'Internal Server error' })
    }
}

exports.getcontactByid = async (req, res) => {
    try {
        const { contact_id } = req.body;

        const contactid = await pool.query(
            "SELECT * FROM tbl_contact WHERE contact_id=$1",
            [contact_id]
        );

        if (contactid.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "case not found"
            })
        }
        res.status(200).json({
            statusCode: 200,
            message: 'case fectched sucessfully',
            contact: contactid.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'internal Server error'
        })
    }
}


exports.updateContact = async (req, res) => {
    try {
        const { contact_id,email, ph_number, address,altphunumber1,altphNumber2 } = req.body;



        if (!contact_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Contact ID is required',
            });
        }

        const fields = [];
        const values = [];
        let index = 1;

        if (email) {
            fields.push(`"email"=$${index++}`);
            values.push(email);
        }

        if (ph_number) {
            fields.push(`"ph_number"=$${index++}`);
            values.push(ph_number);
        }



        if (address) {
            fields.push(`"address"=$${index++}`);
            values.push(address);
        }
      
         if(altphunumber1){
            fields.push(`"altphunumber1"=$${index++}`);
            values.push(altphunumber1)
         }
         if(altphNumber2){
            fields.push(`"altphunumber2"=$${index++}`);
            values.push(altphNumber2)
         }
        values.push(contact_id);

        if (fields.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: 'No fields provided to update',
            });
        }

        const query = `
            UPDATE tbl_contact
            SET ${fields.join(', ')}
            WHERE "contact_id"=$${index}
            RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Contact Not Found',
            });
        }

        res.status(200).json({
            statusCode: 200,
            message: 'Contact Updated Successfully',
            contact: result.rows[0],
        });

    } catch (error) {

        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            details: error.message,
        });
    }
};


exports.deleteContact = async (req, res) => {
    try {
        const { contact_id } = req.body;

        if (!contact_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Contact ID is required',
            });
        }


        const checkContact = await pool.query(
            'SELECT * FROM tbl_contact WHERE contact_id = $1',
            [contact_id]
        );

        if (checkContact.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Contact not found',
            });
        }


        const deleteContact = await pool.query(
            'DELETE FROM tbl_contact WHERE contact_id = $1 RETURNING *',
            [contact_id]
        );

        res.status(200).json({
            statusCode: 200,
            message: 'Contact deleted successfully',
            deleteContact: deleteContact.rows[0],
        });

    } catch (error) {

        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};


exports.getContactlatest = async (req, res) => {
    try {
        const latestContact = await pool.query("SELECT * FROM tbl_contact ORDER BY contact_id DESC LIMIT 1");
        res.status(200).json({
            statusCode: 200,
            message: 'Latest Contact Fetched Successfully',
            contact: latestContact.rows[0],  // Return only the first (latest) contact
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal Server error',
            details: err.message,
        });
    }
}
