import couponRouter from './Coupons/coupons.routes.js';
import productRouter from './Products/products.routes.js';
import categoryRouter from './Categories/categories.routes.js';
import authRouter from './Auth/auth.routes.js';
import storeRouter from './Stores/stores.routes.js'
export const bootstrap = (app) => {
    app.use('/api/coupons', couponRouter);
    app.use('/api/products', productRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/store',storeRouter);
}