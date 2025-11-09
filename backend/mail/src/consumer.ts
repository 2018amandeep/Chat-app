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