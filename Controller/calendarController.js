const pool = require("../db/db");



exports.addCalendar = async (req, res) => {
    const calendar_img = req.files?.calendar_img?.[0]?.filename
        ? `uploads/${req.files.calendar_img[0].filename}`
        : null;

    if (!calendar_img) {
        return res.status(400).json({
            message: "Image not found",
            statusCode: 400
        });
    }

    try {
        const result = await pool.query(
            "INSERT INTO public.tbl_calendar(calendar_img, created_at) VALUES($1, CURRENT_DATE) RETURNING *",
            [calendar_img]
        );


        return res.status(200).json({
            message: "Successfully created calendar image",
            statusCode: 200,
            calendar: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error",
            statusCode: 500
        });
    }
};




exports.getAllCalendarsInDesc = async (req, res) => {
    try {


        const calendars = await pool.query("SELECT * FROM tbl_calendar ORDER BY created_at DESC");
        if (!calendars || calendars.rows.length === 0) {
            return res.status(404).json({
                message: "Not Found calendar",
                statudCode: 404
            })
        }

        return res.status(200).json({
            message: "Successfully fetched Calendar",
            statusCode: 200,
            calendar: calendars.rows
        })



    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Server Error",
            statusCode: 500
        })
    }
}


exports.deleteCalendarById = async (req, res) => {
    const { calendar_id } = req.body;

    if (!calendar_id) {
        return res.status(400).json({
            message: "Calendar ID is required",
            statusCode: 400
        });
    }

    try {
        const result = await pool.query(
            `DELETE FROM tbl_calendar WHERE calendar_id = $1 RETURNING *`,
            [calendar_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Calendar not found with the provided ID",
                statusCode: 404
            });
        }

        return res.status(200).json({
            message: "Deleted calendar successfully",
            statusCode: 200,
            calendar: result.rows[0]
        });

    } catch (error) {
        console.error("Error deleting calendar:", error);

        return res.status(500).json({
            message: "Server error while deleting calendar",
            statusCode: 500
        });
    }
};



exports.updateCalendar = async (req, res) => {
    const { calendar_id } = req.body;

    if (!calendar_id) {
        return res.status(400).json({
            message: "Calendar ID is required",
            statusCode: 400
        });
    }

    const calendar_img = req.files?.calendar_img?.[0]?.filename
        ? `uploads/${req.files.calendar_img[0].filename}`
        : null;

    if (!calendar_img) {
        return res.status(400).json({
            message: "Image file is required",
            statusCode: 400
        });
    }

    try {
        const result = await pool.query(
                `UPDATE tbl_calendar
                SET calendar_img = $2
                WHERE calendar_id = $1
                RETURNING *`,
            [calendar_id, calendar_img]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Calendar not found with the provided ID",
                statusCode: 404
            });
        }

        return res.status(200).json({
            message: "Updated successfully",
            statusCode: 200,
            calendar: result.rows[0]
        });

    } catch (err) {
        console.error("Update error:", err);
        return res.status(500).json({
            message: "Server Error",
            statusCode: 500
        });
    }
};
