import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(productObj) {
        try {
            const product = {
                id: uuidv4(),
                ...productObj,
            };

            const products = await this.getProducts();

            // Checamos si el código ya existe y tiramos error si es asi
            const codeExists = products.find(el => el.code === product.code);

            if (codeExists) return 'Product with that code already exists!';

            products.unshift(product);

            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return product;
        } catch (error) {
            console.log('There was an error when adding product: ', error);
        }
    }

    async getProducts(limit) {
        try {
            if (fs.existsSync(this.path)) {
                const productsFile = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(productsFile);

                // Si limit no es undefined
                if (limit) {
                    const productsLimit = products.slice(0, limit);
                    return productsLimit;
                } else {
                    //En caso que no se envíe limit, vendrá como undefined y regresamos todos los productos
                    return products;
                }
            } else {
                return [];
            }
        } catch (error) {
            console.log('There was an error getting products: ', error);
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.id === id);

            if (product) {
                return product;
            } else {
                return { error: `Product with ID ${id} doesn't exist!` };
            }
        } catch (error) {
            console.log(`Error getting product with ID: ${id} ${error}`)
        }
    }

    async updateProduct(pid, update) {
        //Obtenemos todos los campos que vengan para actualizar y separamos el id para no actualizarlo
        const { id, ...updateFields } = update;

        try {
            if (fs.existsSync(this.path)) {
                const products = await this.getProducts();
                const productToUpdate = products.find(product => product.id === pid);
                const newProducts = products.filter(product => product.id !== pid);

                const updatedProduct = {
                    ...productToUpdate,
                    ...updateFields,
                }

                newProducts.push(updatedProduct);
                await fs.promises.writeFile(this.path, JSON.stringify(newProducts));

                return updatedProduct;
            }
        } catch (error) {
            console.error('Error when updating product: ', error);
        }
    }

    async deleteProduct(id) {
        try {
            if (fs.existsSync(this.path)) {

                const products = await this.getProducts();
                const deletedProduct = products.find(product => product.id === id);

                if (!deletedProduct) {
                    return `Product with ID ${id} wasn't found`;
                }
                const newProducts = products.filter(product => product.id !== id);

                await fs.promises.writeFile(this.path, JSON.stringify(newProducts));
                return deletedProduct;
            } else {
                return `There's no products yet!`
            }
        } catch (error) {
            console.log(`Error when trying to delete product with ID: ${id} ${error}`);
        }
    }
}