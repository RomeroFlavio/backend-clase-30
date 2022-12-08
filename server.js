const { httpServer } = require('./app');
const yargs = require('yargs/yargs')(process.argv.slice(2));
const args = yargs
.default({
    port: 8080,
    mode: 'fork',
})
.argv

console.log(args)

const cluster = require('cluster');
const cpus = require('os').cpus().length;

if(args.mode == 'cluster'){
    if(cluster.isMaster){
        console.log(`Proceso primario: ${process.pid} ejecutandose.`);
        for(let i = 0; i < cpus; i++){
            cluster.fork();
        }
        cluster.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} finalizado.`);
        });
    }else{
        try {
            console.log(`Servidor corriendo en el puerto ${args.port} PID WORKER ${process.pid}`);
            console.log(`Nodo Worker corriendo en el proceso ${process.pid}`);
        } catch (error) {
            console.log(error);
        }
    } 
} else if(args.mode == 'fork'){
    httpServer.listen(args.port, error => {
        if (error) console.log(error)
        console.log(`Servidor corriendo en el puerto ${args.port}`)
    })
}
/**
Correr servidor con cluster
    node server.js --mode 'cluster'
    node server.js --port 8081 --mode 'cluster'

Correr servidor con fork
    node server.js
    node server.js --mode 'fork'

Forever
    forever start server.js
    forever start server.js --fork
    forever start server.js -p 8081
    forever stop server.js
    forever stopall

PM2
    pm2 start server.js
    pm2 start server.js --watch
    pm2 start server.js -p 8081
    pm2 stop server.js
    pm2 monit

*/