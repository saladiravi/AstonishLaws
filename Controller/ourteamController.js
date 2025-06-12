const pool = require("../db/db");

exports.addourteam = async (req, res) => {
   
    const { name, address } = req.body;

    if (!name || !address) {
        return res.status(400).json({
            statusCode: 400,
            message: "Required fields are missing"
        });
    }

    try {
        const team = await pool.query(
            `INSERT INTO tbl_our_team(name, address) 
             VALUES($1, $2) RETURNING *`,
            [name, address]
        );

        return res.status(200).json({
            statusCode: 200,
            message: "Team Added Successfully",
            team: team.rows[0]
        });
    } catch (err) {
        
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error"
        });
    }
};


exports.getourteamid = async (req, res) => {
    const { team_id } = req.body;
    if (isNaN(team_id)) {
        return res.status(400).json({
            statusCode: 400,
            message: "invalid Team Id"
        });
    }
    try {
        const team = await pool.query("Select * From tbl_our_team where team_id=$1", [team_id]);
        if (team.rows.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: `Team not found with Id ${team_id}`
            })
        }
        else {
            return res.status(200).json({
                statusCode: 200,
                message: "successfull fetched the Data",
                team: team.rows[0]
            })
        }
    }
    catch (error) {
       console.error(error)
        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
        })
    }
}

exports.updateourteam = async (req, res) => {

    const { team_id, name, address } = req.body;

    // Check if vacancy_id is valid
    if (isNaN(team_id)) {
        return res.status(400).json({
            statusCode: 400,
            message: "Invalid Team ID"
        });
    }


    if (!name && !address) {
        return res.status(400).json({
            statusCode: 400,
            message: "Required fields are missing"
        });
    }

  try {

        const result = await pool.query(
            `UPDATE tbl_our_team
             SET name = $1, address = $2
             WHERE team_id = $3
             RETURNING *`,
            [name, address, team_id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                message: `Team ID ${team_id} not found`
            });
        }


        return res.status(200).json({
            statusCode: 200,
            message: "Team  updated successfully",
            updatedTeam: result.rows[0]
        });
    } catch (error) {

        return res.status(500).json({
            satusCode: 500,
            message: "Internal Server Error",

        });
    }
};


exports.deleteTeam = async (req, res) => {
    const { team_id } = req.body;


    if (isNaN(team_id)) {
        return res.status(400).json({
            statusCode:400,
            message: "Invalid Team ID"
        });
    }

    try {

        const result = await pool.query(
            "DELETE FROM tbl_our_team WHERE team_id = $1 RETURNING *",
            [team_id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                statusCode:404,
                message: "Team not found"
            });
        }

        // Return a success response
        return res.status(200).json({
            statusCode: 200,
            message: "Team deleted successfully",
            deletedTeam: result.rows[0]
        });
    } catch (error) {

        return res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",

        });
    }
};


exports.getAllTeamData = async (req, res) => {
    try {

        const result = await pool.query("SELECT * FROM tbl_our_team");


        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "No Team found"
            });
        }


        return res.status(200).json({
            statusCode: 200,
            message: "Team fetched successfully",
            team: result.rows
        });
    } catch (error) {
        return res.status(500).json({
            statusCode:500,
            message: "Internal Server Error",
           
        });
    }
};


