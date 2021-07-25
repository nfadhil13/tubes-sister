const amqp = require("amqplib")
const _ = require("underscore")
let instance;
class MessageBroker {
    /**
     * Initialize connection to rabbitMQ
     */
    async init() {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqps://pdfbpaci:pjiyg2dSJBpSavQ29tkbslKZHH3b1wYB@cougar.rmq.cloudamqp.com/pdfbpaci');
        this.channel = await this.connection.createChannel();
        return this;
    }

    constructor() {
        this.queues = {}
    }

    /**
     * @param {String} queue Queue name
     * @param {Function} handler Handler that will be invoked with given message and acknowledge function (msg, ack)
     */
    async subscribe(queue, handler) {
        if (!this.connection) {
            await this.init();
        }
        if (this.queues[queue]) {
            const existingHandler = _.find(this.queues[queue], h => h === handler)
            if (existingHandler) {
                return () => this.unsubscribe(queue, existingHandler)
            }
            this.queues[queue].push(handler)
            return () => this.unsubscribe(queue, handler)
        }

        await this.channel.assertQueue(queue, {durable: true});
        this.queues[queue] = [handler]
        this.channel.consume(
            queue,
            async (msg) => {
                const ack = _.once(() => this.channel.ack(msg))
                this.queues[queue].forEach(h => h(msg, ack))
            }
        );
        return () => this.unsubscribe(queue, handler)
    }

    async unsubscribe(queue, handler) {
        _.pull(this.queues[queue], handler)
    }

    async sendMessage(queue, msg) {
        if (!this.connection) {
            await this.init();
        }
        await this.channel.assertQueue(queue, {durable: true});
        this.channel.sendToQueue(queue, msg)
    }

}

/**
 * @return {Promise<MessageBroker>}
 */
MessageBroker.getInstance = async function() {
    if (!instance) {
        console.log("initialize broker")
        const broker = new MessageBroker()
        instance = broker.init()
        console.log(instance)
    }
    return instance
};

module.exports = MessageBroker
