const walker = require('.');

walker.post('/', (req) => {
    console.log(req.getBody())
    req.sendText("111");
});

walker.start('0.0.0.0:8080');

process.on('SIGINT', () => {
    walker.stop();
    process.exit(0);
})