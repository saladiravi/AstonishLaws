const pool = require('../db/db')




// exports.addevent = async (req, res) => {
//     try {
//         const {
//             event_title,
//             event_description,
//             event_start_date,
//             event_start_time,
//             event_end_date,
//             event_end_time,
//             event_address,
//             speakers
//         } = req.body;

//         // Validation
//         if (!event_title || !speakers) {
//             return res.status(400).json({
//                 statusCode: 400,
//                 message: 'event_title and speakers are required',
//             });
//         }

//         // Handle image upload
//         const eventImage = req.files?.event_image?.[0]?.filename
//             ? `uploads/${req.files.event_image[0].filename}`
//             : null;

//         // Corrected event insert query (fixed VALUES placeholders and column count)
//         const eventQuery = `
//             INSERT INTO public.tbl_event (
//                 event_title,
//                 event_description,
//                 event_image,
//                 event_start_date,
//                 event_start_time,
//                 event_end_date,
//                 event_end_time,
//                 event_address
//             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING event_id
//         `;

//         const eventResult = await pool.query(eventQuery, [
//             event_title,
//             event_description,
//             eventImage,
//             event_start_date,
//             event_start_time,
//             event_end_date,
//             event_end_time,
//             event_address
//         ]);

//         const event_id = eventResult.rows[0].event_id;

//         // Handle speakers array (parse if it's a JSON string)
//         const speakersData = Array.isArray(speakers) ? speakers : JSON.parse(speakers);

//         for (const { speaker_name, date, from_time, to_time, designation } of speakersData) {
//             await pool.query(
//                 `INSERT INTO public.tbl_speaker (
//                     speaker_name,
//                     date,
//                     from_time,
//                     to_time,
//                     designation,
//                     event_id
//                 ) VALUES ($1, $2, $3, $4, $5, $6)`,
//                 [speaker_name, date, from_time, to_time, designation, event_id]
//             );
//         }

//         // Final response
//         res.status(200).json({
//             statusCode: 200,
//             message: 'Event and speakers added successfully',
//             event: {
//                 event_id,
//                 event_title,
//                 event_description,
//                 event_start_date,
//                 event_start_time,
//                 event_end_date,
//                 event_end_time,
//                 event_address,
//                 event_image: eventImage,
//                 speakers: speakersData
//             }
//         });

//     } catch (error) {
//         console.error('addevent error:', error);
//         res.status(500).json({
//             statusCode: 500,
//             message: 'Internal Server Error',
//         });
//     }
// };

exports.addevent = async (req, res) => {
    try {
        const {
            event_title,
            event_description,
            event_start_date,
            event_start_time,
            event_end_date,
            event_end_time,
            event_address,
            speakers
        } = req.body;

        // Validation
        if (!event_title) {
            return res.status(400).json({
                statusCode: 400,
                message: 'event_title is required',
            });
        }

        // Handle image upload
        const eventImage = req.files?.event_image?.[0]?.filename
            ? `uploads/${req.files.event_image[0].filename}`
            : null;

        // Insert event data
        const eventQuery = `
            INSERT INTO public.tbl_event (
                event_title,
                event_description,
                event_image,
                event_start_date,
                event_start_time,
                event_end_date,
                event_end_time,
                event_address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING event_id
        `;

        const eventResult = await pool.query(eventQuery, [
            event_title,
            event_description,
            eventImage,
            event_start_date,
            event_start_time,
            event_end_date,
            event_end_time,
            event_address
        ]);

        const event_id = eventResult.rows[0].event_id;

        // Handle optional speakers
        let speakersData = [];

        if (speakers) {
            try {
                speakersData = Array.isArray(speakers)
                    ? speakers
                    : JSON.parse(speakers);
            } catch (parseError) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Invalid JSON format for speakers',
                });
            }

            // Insert each speaker into the database
            for (const { speaker_name, date, from_time, to_time, designation } of speakersData) {
                await pool.query(
                    `INSERT INTO public.tbl_speaker (
                        speaker_name,
                        date,
                        from_time,
                        to_time,
                        designation,
                        event_id
                    ) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [speaker_name, date, from_time, to_time, designation, event_id]
                );
            }
        }

        // Send success response
        res.status(200).json({
            statusCode: 200,
            message: 'Event and speakers added successfully',
            event: {
                event_id,
                event_title,
                event_description,
                event_start_date,
                event_start_time,
                event_end_date,
                event_end_time,
                event_address,
                event_image: eventImage,
                speakers: speakersData.length ? speakersData : []
            }
        });

    } catch (error) {
        console.error('addevent error:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};

exports.getAllevents = async (req, res) => {
    try {
        const query = `
            SELECT 
                e.event_id,
                e.event_title,
                e.event_image,
                e.event_description,
                e.event_start_date, 
                e.event_start_time,
                e.event_end_date,
                e.event_end_time,
                e.event_address,
                COALESCE(json_agg(
                    json_build_object(
                        'speaker_name', s.speaker_name, 
                        'date', s.date,
                        'from_time', s.from_time,
                        'to_time', s.to_time,
                        'designation', s.designation
                    )
                ) FILTER (WHERE s.speaker_name IS NOT NULL), '[]') AS speakers
            FROM tbl_event e
            LEFT JOIN tbl_speaker s ON e.event_id = s.event_id
            GROUP BY
                e.event_id,
                e.event_title,
                e.event_image,
                e.event_description,
                e.event_start_date,
                e.event_start_time,
                e.event_end_date,
                e.event_end_time,
                e.event_address;
        `;

        const result = await pool.query(query);

        res.status(200).json({
            statusCode: 200,
            data: result.rows,
        });

    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
};




exports.geteventById = async (req, res) => {
    try {
        const { event_id } = req.body;

        if (!event_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Event ID is required'
            });
        }

        const query = `
            SELECT 
                e.event_id,
                e.event_title,
                e.event_image,
                e.event_description,
                e.event_start_date, 
                e.event_start_time,
                e.event_end_date,
                e.event_end_time,
                e.event_address,
                COALESCE(json_agg(
                    json_build_object(
                        'speaker_name', s.speaker_name, 
                        'date', s.date,
                        'from_time', s.from_time,
                        'to_time', s.to_time,
                        'designation', s.designation
                    )
                ) FILTER (WHERE s.speaker_name IS NOT NULL), '[]') AS speakers
            FROM tbl_event e
            LEFT JOIN tbl_speaker s ON e.event_id = s.event_id
            WHERE e.event_id = $1
            GROUP BY
                e.event_id,
                e.event_title,
                e.event_image,
                e.event_description,
                e.event_start_date,
                e.event_start_time,
                e.event_end_date,
                e.event_end_time,
                e.event_address;
        `;

        const result = await pool.query(query, [event_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            statusCode: 200,
            data: result.rows[0],
        });

    } catch (error) {
        console.error("Error fetching event by ID:", error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
};



exports.updateevent = async (req, res) => {
    try {
        const {
            event_id,
            event_title,
            event_description,
            event_start_date,
            event_start_time,
            event_end_date,
            event_end_time,
            event_address,
            speakers
        } = req.body;

        if (!event_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'event_id is required'
            });
        }

        // Build dynamic update fields
        const fields = [];
        const values = [];
        let index = 1;

        if (event_title) {
            fields.push(`event_title = $${index++}`);
            values.push(event_title);
        }
        if (event_description) {
            fields.push(`event_description = $${index++}`);
            values.push(event_description);
        }
        if (event_start_date) {
            fields.push(`event_start_date = $${index++}`);
            values.push(event_start_date);
        }
        if (event_start_time) {
            fields.push(`event_start_time = $${index++}`);
            values.push(event_start_time);
        }
        if (event_end_date) {
            fields.push(`event_end_date = $${index++}`);
            values.push(event_end_date);
        }
        if (event_end_time) {
            fields.push(`event_end_time = $${index++}`);
            values.push(event_end_time);
        }
        if (event_address) {
            fields.push(`event_address = $${index++}`);
            values.push(event_address);
        }

        // Check for uploaded image
        const eventImage = req.files?.event_image?.[0]?.filename
            ? `uploads/${req.files.event_image[0].filename}`
            : null;

        if (eventImage) {
            fields.push(`event_image = $${index++}`);
            values.push(eventImage);
        }

        if (fields.length > 0) {
            const updateQuery = `
                UPDATE tbl_event
                SET ${fields.join(', ')}
                WHERE event_id = $${index}
            `;
            values.push(event_id);
            await pool.query(updateQuery, values);
        }

        // Handle speakers only if field is present
        if (speakers !== undefined && speakers !== null && speakers !== '') {
            let speakersData = [];

            try {
                speakersData = Array.isArray(speakers)
                    ? speakers
                    : JSON.parse(speakers);
            } catch (parseError) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Invalid speaker format (must be valid JSON array)'
                });
            }

            // Delete existing speakers
            await pool.query(`DELETE FROM tbl_speaker WHERE event_id = $1`, [event_id]);

            // Insert new speakers
            for (const { speaker_name, date, from_time, to_time, designation } of speakersData) {
                await pool.query(
                    `INSERT INTO tbl_speaker (
                        speaker_name,
                        date,
                        from_time,
                        to_time,
                        designation,
                        event_id
                    ) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [speaker_name, date, from_time, to_time, designation, event_id]
                );
            }
        }

        res.status(200).json({
            statusCode: 200,
            message: 'Event updated successfully'
        });

    } catch (error) {
        console.error('updateevent error:', error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
};




exports.deleteevent = async (req, res) => {
    try {
        const { event_id } = req.body;

        if (!event_id) {
            return res.status(400).json({
                statusCode: 400,
                message: ' Event ID is required'
            });
        }


        const checkEventQuery = `SELECT * FROM public.tbl_event WHERE event_id = $1`;
        const eventResult = await pool.query(checkEventQuery, [event_id]);

        if (eventResult.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Event not found'
            });
        }


        await pool.query(`DELETE FROM public.tbl_speaker WHERE event_id = $1`, [event_id]);


        await pool.query(`DELETE FROM public.tbl_event WHERE event_id = $1`, [event_id]);

        res.status(200).json({
            statusCode: 200,
            message: 'event deleted successfully'
        });

    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
};
