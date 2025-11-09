import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    console.log(process.env.Rabbitmq_User, "functione called")
    try {
        const connect = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.Rabbitmq_Host,
            port: 5672,
            username: process.env.Rabbitmq_User,
            password: process.env.Rabbitmq_Password
        });

        channel = await connect.createChannel();
        console.log("Connected to Rabbit MQ")
    } catch (err) {
        console.log(err, "Error connecting to RabbitMQ");
    }
}

export const publishToQueue = async (queueName: string, message: any) => {
    if (!channel) {
        throw new Error("Channel not initialized");
    }

    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true
    });
}