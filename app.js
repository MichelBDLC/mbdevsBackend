const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (_, response) => {
    response.status(200).send('Welcome to MBDevs');
})

app.get('*', (_, response) => {
    response.status(404).send('Page not found');
})

app.post('/submit-contact-form', async (request, response) => {
    const {name, email, message} = request.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'New Contact Form Submission',
            html: `
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>`
        }

        await transporter.sendMail(mailOptions);

        response.status(200).json({message: 'Contact Message Submitted Succesfully'})
    }
    catch (error) {
        console.error(error);
        response.status(500).json({error: 'Internal Server Error'})
    }
})

module.exports = app;