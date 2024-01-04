import nodemailer from "nodemailer";

const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        service:process.env.SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD,
        }
    })
    const mailOptions = {
        from : process.env.SMTP_MAIL,
        to: options.email,
        subject:options.subject,
        text:options.message,
    };
    console.log(mailOptions.text);
    await transporter.sendMail(mailOptions);
};

export default sendEmail;

// import { MailtrapClient } from "mailtrap";
// const sendEmail = async(options) => {
//     const TOKEN = process.env.TOKEN;
//     const SENDER_EMAIL = process.env.SENDER;
//     const RECIPIENT_EMAIL = options.to;
//     const client = new MailtrapClient({ token: TOKEN });
//     const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };
//     console.log(sender);
//     const welcomeImage = fs.readFileSync(path.join(__dirname, "welcome.png"));
//     client
//       .send({
//         category: "test",
//         custom_variables: {
//           hello: "world",
//           year: 2022,
//           anticipated: true,
//         },
//         from: sender,
//         to: [{ email: options.to }],
//         subject: options.subject,
//         html: `
//         <!doctype html>
//         <html>
//           <head>
//             <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
//           </head>
//           <body style="font-family: sans-serif;">
//             <div style="display: block; margin: auto; max-width: 600px;" class="main">
//               <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Congrats for sending test email with Mailtrap!</h1>
//               <p>${options.message}</p>
//               <p>Good luck! Hope it works.</p>
//             </div>
//             <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
//             <style>
//               .main { background-color: white; }
//               a:hover { border-left-width: 1em; min-height: 2em; }
//             </style>
//           </body>
//         </html>
//       `,
//         attachments: [
//           {
//             filename: "welcome.png",
//             content_id: "welcome.png",
//             disposition: "inline",
//             content: welcomeImage,
//           },
//         ],
//       })
//       .then(console.log)
//       .catch(console.error)
// }

// export default sendEmail;