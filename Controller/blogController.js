const pool = require('../db/db');

exports.addblog = async (req, res) => {
    const client = await pool.connect();
    try {
        const { case_title, title, description } = req.body;
        const file = req.file;

        if (!case_title || !title || !description) {
            return res.status(400).json({
                statusCode: 400,
                message: 'case_title, title, and description are required',
            });
        }

        if (!file) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Blog image is required',
            });
        }

        const blog_image = `uploads/${file.filename}`;

        // Begin transaction
        await client.query('BEGIN');

        // Insert into tbl_blogs
        const blogQuery = `
            INSERT INTO public.tbl_blogs (case_title)
            VALUES ($1)
            RETURNING blog_id
        `;
        const blogResult = await client.query(blogQuery, [case_title]);
        const blog_id = blogResult.rows[0].blog_id;

        // Insert into tbl_blogs_data
        const blogDataQuery = `
            INSERT INTO public.tbl_blogs_data (title, description, blog_image, blog_id)
            VALUES ($1, $2, $3, $4)
        `;
        await client.query(blogDataQuery, [title, description, blog_image, blog_id]);

        await client.query('COMMIT');

        res.status(200).json({
            statusCode: 200,
            message: 'Blog added successfully',
            blog: {
                blog_id,
                case_title,
                title,
                description,
                blog_image
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    } finally {
        client.release();
    }
};



exports.getAllBlogs = async (req, res) => {
    try {
        const blogsQuery = `SELECT * FROM tbl_blogs`;
        const blogsResult = await pool.query(blogsQuery);

        const allBlogs = [];

        for (const blog of blogsResult.rows) {
            const blogDataQuery = `SELECT * FROM tbl_blogs_data WHERE blog_id = $1 LIMIT 1`;
            const blogDataResult = await pool.query(blogDataQuery, [blog.blog_id]);

            allBlogs.push({
                ...blog,
                blog_data: blogDataResult.rows[0] || null
            });
        }

        res.status(200).json({
            statusCode: 200,
            blogs: allBlogs
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
    }
};


exports.getBlogById = async (req, res) => {
    try {
        const { blog_id } = req.body;

        const blogQuery = `SELECT * FROM tbl_blogs WHERE blog_id = $1`;
        const blogResult = await pool.query(blogQuery, [blog_id]);

        if (blogResult.rows.length === 0) {
            return res.status(404).json({ statusCode: 404, message: 'Blog not found' });
        }

        const blogDataQuery = `SELECT * FROM tbl_blogs_data WHERE blog_id = $1 LIMIT 1`;
        const blogDataResult = await pool.query(blogDataQuery, [blog_id]);

        res.status(200).json({
            statusCode: 200,
            blog: {
                ...blogResult.rows[0],
                blog_data: blogDataResult.rows[0] || null
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
    }
};



exports.updateBlog = async (req, res) => {
    const client = await pool.connect();
    try {
        const { blog_id, case_title, title, description } = req.body;
        const file = req.file;

        await client.query('BEGIN');

        await client.query(
            `UPDATE tbl_blogs SET case_title = $1 WHERE blog_id = $2`,
            [case_title, blog_id]
        );

        // Delete existing blog data
        await client.query(`DELETE FROM tbl_blogs_data WHERE blog_id = $1`, [blog_id]);

        const blog_image = file ? `uploads/${file.filename}` : null;

        await client.query(
            `INSERT INTO tbl_blogs_data (title, description, blog_image, blog_id)
             VALUES ($1, $2, $3, $4)`,
            [title, description, blog_image, blog_id]
        );

        await client.query('COMMIT');

        res.status(200).json({ statusCode: 200, message: 'Blog updated successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
    } finally {
        client.release();
    }
};

exports.getBlogsByCaseTitle = async (req, res) => {
    try {
        const { case_title } = req.body;

        const blogsQuery = `
            SELECT * FROM tbl_blogs 
            WHERE LOWER(case_title) = LOWER($1)
        `;
        const blogsResult = await pool.query(blogsQuery, [case_title]);

        if (blogsResult.rows.length === 0) {
            return res.status(404).json({ statusCode: 404, message: 'No blogs found for this case title' });
        }

        const blogsWithData = [];

        for (const blog of blogsResult.rows) {
            const blogDataQuery = `SELECT * FROM tbl_blogs_data WHERE blog_id = $1 LIMIT 1`;
            const blogDataResult = await pool.query(blogDataQuery, [blog.blog_id]);

            blogsWithData.push({
                ...blog,
                blog_data: blogDataResult.rows[0] || null
            });
        }

        res.status(200).json({
            statusCode: 200,
            blogs: blogsWithData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const { blog_id } = req.body;

        // First delete blog_data
        await pool.query(`DELETE FROM tbl_blogs_data WHERE blog_id = $1`, [blog_id]);

        // Then delete blog
        const deleteResult = await pool.query(`DELETE FROM tbl_blogs WHERE blog_id = $1`, [blog_id]);

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ statusCode: 404, message: 'Blog not found' });
        }

        res.status(200).json({ statusCode: 200, message: 'Blog deleted successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
    }
};
