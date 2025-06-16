const pool = require('../db/db');

exports.addblog = async (req, res) => {
    const client = await pool.connect();
    try {
        const { case_category_id, title, description } = req.body;
        const files = req.files;

        if (!case_category_id || !title || !description) {
            return res.status(400).json({
                statusCode: 400,
                message: 'case Category, title, and description are required',
            });
        }

        const blog_image = files?.blog_image?.[0]?.filename ? `uploads/${files.blog_image[0].filename}` : null;
        const blog_file = files?.blog_file?.[0]?.filename ? `uploads/${files.blog_file[0].filename}` : null;

        if (!blog_image) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Blog image is required',
            });
        }

        // Begin transaction
        await client.query('BEGIN');

        const blogQuery = `
            INSERT INTO public.tbl_blogs (case_category_id)
            VALUES ($1)
            RETURNING blog_id
        `;
        const blogResult = await client.query(blogQuery, [case_category_id]);
        const blog_id = blogResult.rows[0].blog_id;

        const blogDataQuery = `
            INSERT INTO public.tbl_blogs_data (title, description, blog_image, blog_file, blog_id)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await client.query(blogDataQuery, [title, description, blog_image, blog_file, blog_id]);

        await client.query('COMMIT');

        res.status(200).json({
            statusCode: 200,
            message: 'Blog added successfully',
            blog: {
                blog_id,
                case_category_id,
                title,
                description,
                blog_image,
                blog_file
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
        const blogsQuery = `
            SELECT 
                b.blog_id, 
                b.case_category_id, 
                c.case_name, 
                c.case_image,
                d.title, 
                d.description, 
                d.blog_image, 
                d.blog_file
            FROM tbl_blogs b
            LEFT JOIN tbl_case_category c ON b.case_category_id = c.case_category_id
            LEFT JOIN tbl_blogs_data d ON b.blog_id = d.blog_id
        `;

        const blogsResult = await pool.query(blogsQuery);

        res.status(200).json({
            statusCode: 200,
            blogs: blogsResult.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
    }
};



exports.getBlogById = async (req, res) => {
    try {
        const { blog_id } = req.body;

        const blogQuery = `
            SELECT 
                b.blog_id, 
                b.case_category_id, 
                c.case_name, 
                c.case_image,
                d.title, 
                d.description, 
                d.blog_image, 
                d.blog_file
            FROM tbl_blogs b
            LEFT JOIN tbl_case_category c ON b.case_category_id = c.case_category_id
            LEFT JOIN tbl_blogs_data d ON b.blog_id = d.blog_id
            WHERE b.blog_id = $1
        `;

        const blogResult = await pool.query(blogQuery, [blog_id]);

        if (blogResult.rows.length === 0) {
            return res.status(404).json({ statusCode: 404, message: 'Blog not found' });
        }

        res.status(200).json({
            statusCode: 200,
            blog: blogResult.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
    }
};



exports.updateBlog = async (req, res) => {
    const client = await pool.connect();
    try {
        const { blog_id, case_category_id, title, description } = req.body;
        const blogImageFile = req.files?.blog_image?.[0];
        const blogVideoFile = req.files?.blog_video?.[0];

        await client.query('BEGIN');

        // Update category in tbl_blogs
        await client.query(
            `UPDATE tbl_blogs SET case_category_id = $1 WHERE blog_id = $2`,
            [case_category_id, blog_id]
        );

        // Remove old blog data
        await client.query(`DELETE FROM tbl_blogs_data WHERE blog_id = $1`, [blog_id]);

        const blog_image = blogImageFile ? `uploads/${blogImageFile.filename}` : null;
        const blog_file = blogVideoFile ? `uploads/${blogVideoFile.filename}` : null;

        // Insert new blog data
        await client.query(
            `INSERT INTO tbl_blogs_data (title, description, blog_image, blog_file, blog_id)
             VALUES ($1, $2, $3, $4, $5)`,
            [title, description, blog_image, blog_file, blog_id]
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


exports.getBlogsByCaseCategoryId = async (req, res) => {
    try {
        const { case_category_id } = req.body;

        const blogsQuery = `
            SELECT 
                b.blog_id, 
                b.case_category_id, 
                c.case_name, 
                c.case_image,
                d.title, 
                d.description, 
                d.blog_image, 
                d.blog_file
            FROM tbl_blogs b
            LEFT JOIN tbl_case_category c ON b.case_category_id = c.case_category_id
            LEFT JOIN tbl_blogs_data d ON b.blog_id = d.blog_id
            WHERE b.case_category_id = $1
        `;

        const blogsResult = await pool.query(blogsQuery, [case_category_id]);

        if (blogsResult.rows.length === 0) {
            return res.status(404).json({ statusCode: 404, message: 'No blogs found for this category' });
        }

        res.status(200).json({
            statusCode: 200,
            blogs: blogsResult.rows
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
