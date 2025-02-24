import couponRouter from './Coupons/coupons.routes.js';
import productRouter from './Products/products.routes.js';
export const bootstrap = (app) => {
    app.use('/api/coupons', couponRouter);
    app.use('/api/products', productRouter);
}