import couponRouter from './Coupons/coupons.routes.js';
import productRouter from './Products/products.routes.js';
import categoryRouter from './Categories/categories.routes.js';
export const bootstrap = (app) => {
    app.use('/api/coupons', couponRouter);
    app.use('/api/products', productRouter);
    app.use('/api/category', categoryRouter);
}