import couponRouter from './Coupons/coupons.routes.js';
import productRouter from './Products/products.routes.js';
import categoryRouter from './Categories/categories.routes.js';
import authRouter from './Auth/auth.routes.js';
import storeRouter from './Stores/stores.routes.js'
import sectionRouter from './Sections/section.routes.js';
import bannerRouter from './Banners/banner.routes.js';
import rateRouter from './Rate/rate.routes.js';
import eventRouter from './Events/event.routes.js';
import settingRouter from './Settings/settings.routes.js';
import statsRouter from './System/stats.routes.js';
import marketingRouter from './Marketing/marketing.routes.js';
import navigationRouter from './Navigateion/navigation.routes.js';
export const bootstrap = (app) => {
    app.use('/api/coupons', couponRouter);
    app.use('/api/products', productRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/store', storeRouter);
    app.use('/api/section', sectionRouter);
    app.use('/api/banner', bannerRouter);
    app.use('/api/rate', rateRouter);
    app.use('/api/events', eventRouter);
    app.use('/api/settings', settingRouter);
    app.use('/api/system', statsRouter);
    app.use('/api/marketing', marketingRouter);
    app.use('/api/nav', navigationRouter);
}