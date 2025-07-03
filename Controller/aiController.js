const openai =require('../services/openaiService')
const pool = require('../db/db');

// exports.reqAi = async (req, res) => {
//     const { prompt } = req.body;

//     if (!prompt) {
//         return res.status(400).json({ message: "Prompt is required" });
//     }

//     try {
//         const completion = await openai.chat.completions.create({
//                  model: "gpt-3.5-turbo",
//             messages: [
//                 { role: "system", content: "You are an intelligent assistant. Answer clearly and helpfully." },
//                 { role: "user", content: prompt }
//             ],
//         });

//         const aiResponse = completion.choices[0].message.content;

//         await pool.query(
//             "INSERT INTO ai_queries (prompt, response) VALUES ($1, $2)",
//             [prompt, aiResponse]
//         );

//         return res.json({ response: aiResponse });
//     } catch (err) {
//         console.error("AI error:", err);
//         return res.status(500).json({ message: "AI request failed" });
//     }
// };

 

exports.reqAi = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }

    try {
        // ✅ DEMO_MODE toggle
        if (process.env.DEMO_MODE === "true") {
            const demoResponse = "This is a demo response. The actual AI answer will appear here in production.";

            // still insert into DB so your app flow stays the same
            await pool.query(
                "INSERT INTO ai_queries (prompt, response) VALUES ($1, $2)",
                [prompt, demoResponse]
            );

            return res.json({ response: demoResponse }); 
        }

        // ✅ If DEMO_MODE is false, actually call OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an intelligent assistant. Answer clearly and helpfully." },
                { role: "user", content: prompt }
            ],
        });

        const aiResponse = completion.choices[0].message.content;

        await pool.query(
            "INSERT INTO ai_queries (prompt, response) VALUES ($1, $2)",
            [prompt, aiResponse]
        );

        return res.json({ response: aiResponse });

    } catch (err) {
        console.error("AI error:", err);
        return res.status(500).json({ message: "AI request failed" });
    }
};


exports.getAiHistory = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT queries_id, prompt, response FROM ai_queries ORDER BY queries_id ASC"
        );

        return res.json({ history: result.rows });
    } catch (err) {
        console.error("DB fetch error:", err);
        return res.status(500).json({ message: "Failed to fetch AI history" });
    }
};