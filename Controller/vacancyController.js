const pool = require("../db/db");



exports.getVacancyById = async (req, res) => {
    const { vacancy_id } = req.body;
    if (isNaN(vacancy_id)) {
        return res.status(400).json({ message: "invalid Vacancy Id" });
    }
    try {
        const vacant = await pool.query("Select * From tbl_vacancy where vacancy_id=$1", [vacancy_id]);
        if (vacant.rows.length === 0) {
            return res.status(400).json({
                message: `Vacancy not found with Id ${vacancy_id}`
            })
        }
        else {
            return res.status(200).json({
            message: "successfull fetched the Data",
            Vacancy: vacant.rows[0]
        })
    }
    }
    catch (err) {
        return res.status(500).json({
            message: `internal server error ${err}`
        })
    }
}

exports.updateVacancy = async (req, res) => {
    
    const { vacancy_id,vacancy_title, name_of_employment, number_of_vacancy } = req.body;

    // Check if vacancy_id is valid
    if (isNaN(vacancy_id)) {
        return res.status(400).json({
            message: "Invalid Vacancy ID"
        });
    }

    // Validation: Ensure all required fields are present
    if (!vacancy_title && !name_of_employment && !number_of_vacancy) {
        return res.status(400).json({
            message: "Required fields are missing"
        });
    }

    // Ensure `number_of_vacancy` is a valid integer
    if (isNaN(number_of_vacancy)) {
        return res.status(400).json({
            message: "number_of_vacancy should be an integer"
        });
    }

    try {
        // Query to update the vacancy details by id
        const result = await pool.query(
            `UPDATE tbl_vacancy
             SET vacancy_title = $1, name_of_employment = $2, number_of_vacancy = $3
             WHERE vacancy_id = $4
             RETURNING *`,
            [vacancy_title, name_of_employment, number_of_vacancy, vacancy_id]
        );

        // If no rows were affected, that means the vacancy wasn't found
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: `Vacancy with ID ${vacancy_id} not found`
            });
        }

        // Return the updated vacancy
        return res.status(200).json({
            message: "Vacancy updated successfully",
            updatedVacancy: result.rows[0]
        });
    } catch (err) {
        // Handle errors
        console.error("Error while updating vacancy:", err);
        return res.status(500).json({
            message: "An error occurred while updating the vacancy",
            err: err.message
        });
    }
};


exports.deleteVacancy = async (req, res) => {
    const { vacancy_id } = req.body;

    // Check if the vacancy_id is a valid integer
    if (isNaN(vacancy_id)) {
        return res.status(400).json({
            message: "Invalid vacancy ID"
        });
    }

    try {
        // Attempt to delete the vacancy with the given vacancy_id
        const result = await pool.query(
            "DELETE FROM tbl_vacancy WHERE vacancy_id = $1 RETURNING *",
            [vacancy_id]
        );

        // If no rows were affected, that means the vacancy wasn't found
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Vacancy not found"
            });
        }

        // Return a success response
        return res.status(200).json({
            message: "Vacancy deleted successfully",
            deletedVacancy: result.rows[0]
        });
    } catch (err) {
        // Handle errors
        console.error("Error while deleting vacancy:", err);
        return res.status(500).json({
            message: "An error occurred while deleting the vacancy",
            err: err.message
        });
    }
};


exports.getAllVacancyData = async (req, res) => {
    try {
        // Query to fetch all data from the tbl_vacancy table
        const result = await pool.query("SELECT * FROM tbl_vacancy");

        // If no vacancies found, return an empty array
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "No vacancies found"
            });
        }

        // Return the retrieved vacancies
        return res.status(200).json({
            message: "Vacancies fetched successfully",
            vacancies: result.rows
        });
    } catch (err) {
        // Handle errors
        console.error("Error while fetching vacancies:", err);
        return res.status(500).json({
            message: "An error occurred while fetching vacancies",
            err: err.message
        });
    }
};

exports.addVacancy = async (req, res) => {
    const { vacancy_title, name_of_employment, number_of_vacancy } = req.body;

    // Validation: Check if all required fields are present
    if (!vacancy_title || !name_of_employment || !number_of_vacancy) {
        return res.status(400).json({
            message: "Required fields are missing"
        });
    }

    // Ensure `number_of_vacancy` is a valid integer
    if (isNaN(number_of_vacancy)) {
        return res.status(400).json({
            message: "number_of_vacancy should be an integer"
        });
    }

    try {
        // Insert the new vacancy into the table and return the inserted data
        const vacancy = await pool.query(
            `INSERT INTO tbl_vacancy(vacancy_title, name_of_employment, number_of_vacancy) 
             VALUES($1, $2, $3) RETURNING *`,
            [vacancy_title, name_of_employment, number_of_vacancy]
        );

        // Return the newly created vacancy data
        return res.status(201).json({
            message: "Vacancy Created Successfully",
            vacancy: vacancy.rows[0]
        });
    } catch (err) {
        // Log the error and send a response
        console.error("Error while creating a vacancy:", err);
        return res.status(500).json({
            message: "An error occurred while creating a vacancy",
            err: err.message
        });
    }
};
