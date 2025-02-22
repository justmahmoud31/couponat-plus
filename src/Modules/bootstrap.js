import couponRouter from './Coupons/coupons.routes.js';
export const bootstrap = (app) => {
    app.use('/api/coupons', couponRouter);
}