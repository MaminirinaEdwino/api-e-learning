const nodemailer = require('nodemailer');

class ContactController {
    async sendContactEmail(req, res) {
        const { nom, email, sujet, message } = req.body;

        // Configuration du transporteur (équivalent à la config SMTP de PHPMailer)
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true pour le port 465, false pour les autres (STARTTLS)
            auth: {
                user: 'edwinomaminirina@gmail.com',
                pass: 'VOTRE_MOT_DE_PASSE_APPLICATION' // Utilisez une variable d'environnement !
            }
        });

        try {
            // Définition de l'email
            const mailOptions = {
                from: `"${nom}" <${email}>`, // L'expéditeur affiché
                replyTo: email,               // Pour pouvoir répondre directement au client
                to: 'edwinomaminirina@gmail.com',
                subject: sujet,
                // On peut envoyer à la fois du HTML et du texte brut
                text: message,
                html: `<p><strong>Nom:</strong> ${nom}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Message:</strong><br>${message}</p>`
            };

            // Envoi de l'email
            await transporter.sendMail(mailOptions);

            // Redirection après succès (équivalent à header("Location: ..."))
            res.json({
                message: "email send"
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email:", error);
            res.status(500).send("Une erreur est survenue lors de l'envoi du message.");
        }
    }
}

module.exports = new ContactController();