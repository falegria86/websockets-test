import { Router } from "express";
import ProductManager from '../manager/product.manager.js';
import { __dirname } from "../utils.js";

const productManager = new ProductManager(`${__dirname}/db/products.json`);
const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts')
})


export default router;