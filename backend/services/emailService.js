
const nodemailer = require('nodemailer');

/**
 * Serviço de E-mail CityMotion
 * Responsável por gerenciar o envio de e-mails transacionais.
 * 
 * Configurável via variáveis de ambiente:
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 */

async function getTransporter() {
    // Se as credenciais estiverem no .env, usa o servidor real (ex: SMTP da Prefeitura)
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // Caso contrário, cria uma conta de teste no Ethereal (Open Source Testing)
    const testAccount = await nodemailer.createTestAccount();
    console.log('\x1b[33m[EmailService] SMTP não configurado. Usando conta de teste Ethereal.\x1b[0m');
    
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
}

async function sendPasswordResetEmail(to, name, code) {
    try {
        const transporter = await getTransporter();
        
        const info = await transporter.sendMail({
            from: '"CityMotion Security" <no-reply@citymotion.app>',
            to: to,
            subject: "Protocolo de Recuperação de Acesso",
            text: `Olá ${name}, seu código de recuperação é: ${code}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #3b82f6; text-align: center;">CityMotion</h2>
                    <p>Olá, <strong>${name}</strong>.</p>
                    <p>Recebemos uma solicitação de redefinição de senha para sua conta no sistema de gestão de frota.</p>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${code}</span>
                    </div>
                    <p style="font-size: 12px; color: #6b7280; text-align: center;">
                        Este código é válido por 1 hora. Se você não solicitou esta alteração, ignore este e-mail.
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 10px; color: #9ca3af; text-align: center;">
                        NexusOS Security Protocol • CityMotion App
                    </p>
                </div>
            `,
        });

        // Se for conta de teste, mostra a URL para visualizar o e-mail
        if (!process.env.SMTP_HOST) {
            console.log('\x1b[32m[EmailService] E-mail enviado! Visualize aqui: \x1b[0m', nodemailer.getTestMessageUrl(info));
        }

        return true;
    } catch (error) {
        console.error('[EmailService] Erro ao enviar e-mail:', error);
        return false;
    }
}

module.exports = {
    sendPasswordResetEmail
};
