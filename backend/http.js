//curso de midu
import http from 'node:http';
const desiredPort = process.env.PORT ?? 1234;

const processRequest = (req, res) => {
    console.log('request received.', req.url);
    res.setHeader('Content-type', 'text-html');
    if (req.url === '/') {
        //renderizar pagina inicial
        res.statusCode = 200;
        res.end('<h1>Bienvenido al inicio</h1>');
    }
    else if (req.url === '/login') {
        res.statusCode = 200;
        res.end('<h1>Bienvenido a la pagina de login</h1>')
    }
    else {
        res.sattusCode = 404;
        res.end('<h1>404</h1>')
    }
};
const server = http.createServer(processRequest);

server.listen(desiredPort, () => {
    console.log(`Server listening on port http://localhost:${desiredPort}`);

})