const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const path = require('path');
const upload= require('../utils/fileupload');

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
router.post('/contact', upload.single('document'), async (req, res) => {
  const { name, contactNumber, email, LegalIssueSummary, datetime } = req.body;
  const documentPath = req.file?.path;

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
    from: '"Astonish Law Contact Form" <ravikishore@digispheretech.in>',
    to: 'ravikishore@digispheretech.in',
    replyTo: email,
    subject: 'New Contact Form Submission',
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Contact Number:</strong> ${contactNumber}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Legal Issue Summary:</strong> ${LegalIssueSummary}</p>
      <p><strong>Date and Time:</strong> ${datetime}</p>
 
    `,
    attachments: documentPath
      ? [
          {
            filename: path.basename(documentPath),
            path: documentPath,
          }
        ]
      : [],
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
