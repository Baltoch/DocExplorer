import amqp from 'amqplib/callback_api.js';
import handleJob from './handlejob.js';

const JOBBROKER_URL = process.env.JOBBROKER_URL || 'amqp://jobbroker:5672';
const JOB_QUEUE = process.env.JOB_QUEUE || 'ocr';
const NEXT_STEP_QUEUE = process.env.NEXT_STEP_QUEUE || 'metadatagen';

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

        channel.consume(JOB_QUEUE, async function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            let job = JSON.parse(msg.content.toString());
            job = await handleJob(job);
            console.log(job);
            if(job?.status == "Processing") {
                connection.createChannel(function(error2, channel) {
                    if (error2) {
                        throw error2;
                    }
    
                    var m = JSON.stringify(job);
    
                    channel.assertQueue(NEXT_STEP_QUEUE, {
                        durable: false
                    });
                    channel.sendToQueue(NEXT_STEP_QUEUE, Buffer.from(m));
    
                    console.log(" [x] Sent %s", m);
                });
            }
        }, {
            noAck: true
        });
    });
});