import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';
import ProductManager from './manager/product.manager.js';

const productManager = new ProductManager(`${__dirname}/db/products.json`);
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use('/', viewsRouter);

const httpServer = app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) => {
  console.log("Cliente conectado: ", socket.id);

  socketServer.emit('products', await productManager.getProducts());

  socket.on('disconnect', () => {
    console.log('Cliente desconectado: ', socket.id);
  });

  socket.on('newProduct', async (product) => {
    await productManager.addProduct(product);

    socket.emit('products', await productManager.getProducts());
  });

  socket.on('deleteProduct', async (productID) => {
    await productManager.deleteProduct(productID);

    socket.emit('products', await productManager.getProducts());
  })
})
