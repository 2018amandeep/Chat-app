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

        const channel = connection.createChannel();
    }
    catch(err){
        console.log(err, "Error in consumer");
    }
}