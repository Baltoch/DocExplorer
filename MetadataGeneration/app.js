import amqp from 'amqplib/callback_api.js'
import handleJob from './handlejob.js';

const JOBBROKER_URL = process.env.JOBBROKER_URL || 'amqp://jobbroker:5672';
const JOB_QUEUE = process.env.JOB_QUEUE || 'metadatagen';

amqp.connect(JOBBROKER_URL, function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(JOB_QUEUE, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", JOB_QUEUE);

        channel.consume(JOB_QUEUE, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            const job = JSON.parse(msg.content.toString());
            handleJob(job);
        }, {
            noAck: true
        });
    });
});