const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/sendmail', async (req, res) => {
    const { to, subject, text, html } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465, // SSL
        secure: true,
        auth: {
            user: 'ravikishore@digispheretech.in',
            pass: 'Ravikishore@2025' // make sure this is the correct mailbox password
        }
    });

    const mailOptions = {
        from: '"Ravi Kishore" <ravikishore@digispheretech.in>',
        to,
        subject,
        text,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Mail sent!' });
    } catch (error) {
        console.error('Error sending mail:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

 


// ✅ NEW Contact Form Email API
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'ravikishore@digispheretech.in',
    pass: 'Ravikishore@2025',
  },
});

const mailOptions = {
  from: '"Astonish Law Contact Form" <ravikishore@digispheretech.in>', // ✅ MUST match your SMTP login
  to: 'ravikishore@digispheretech.in', // ✅ Your inbox
  replyTo: email, // ✅ So you can reply directly to user's email
  subject: `Contact Form: ${subject}`,
  html: `
    
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong><br>${message}</p>
    <p>📍 Visit our site: <a href="https://digispheretech.in/astonishlaw/" target="_blank">https://digispheretech.in/astonishlaw/</a></p>
  `,
};


  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Mail sent successfully!' });
  } catch (error) {
    console.error('Error sending contact mail:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
