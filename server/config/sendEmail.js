import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.RESEND_API){
    console.log("Provide RESEND_API inside the .env file")
}

const resend = new Resend(process.env.RESEND_API);

const FROM_EMAIL = process.env.RESEND_FROM || 'onboarding@resend.dev'

const sendEmail = async({ sendTo, subject, html, replyTo })=>{
    try {
        if(!sendTo){
            throw new Error('sendTo (recipient email) is required')
        }

        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: sendTo,
            subject: subject,
            html: html,
            ...(replyTo && { reply_to: replyTo })
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail
