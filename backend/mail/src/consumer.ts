import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const startSendOtpConsumer = async ()=>{
    try{
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.Rabbitmq_Host,
            port: 5672,
            username: process.env.Rabbitmq_User,
            password: process.env.Rabbitmq_Password
        });

        const channel = await connection.createChannel();
        const queueName = "send-otp";
        await channel.assertQueue(queueName, { durable: true });
        console.log("Connected to Rabbit MQ in mail-service");

        await channel.consume(queueName, async(msg:any)=>{
            try{
                const { to, subject, body}= JSON.parse(msg?.content.toString());

                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port:465, 
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }   
                });

                await transporter.sendMail({
                    from: 'Chat-app',
                    to: to,
                    subject: subject,
                    text: body
                });

                console.log("Email sent successfully to:", to);
                channel.ack(msg)
            }catch(err){
                console.log(err, "Failed to send OTP");
            }
        })
    }
    catch(err){
        console.log(err, "Error in consumer");
        throw err;
    }
}



/*
list all images - docker images -a
list all containers - docker ps -a
remove all images - docker rmi $(docker images -a -q)
remove all containers - docker rm $(docker ps -a -q)
remove all images and containers - docker system prune -a
remove one image - docker rmi <image-id>
remove one container - docker rm <container-id>
remove all images and containers - docker system prune -a -f
*/