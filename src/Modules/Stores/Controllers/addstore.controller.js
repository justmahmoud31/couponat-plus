import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { validateStore } from "../stores.validation.js";

export const addStore = catchError(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Store logo is required' });
    }

    try {
        req.body.categories = req.body.categories ? JSON.parse(req.body.categories) : [];
        req.body.coupons = req.body.coupons ? JSON.parse(req.body.coupons) : [];
        req.body.products = req.body.products ? JSON.parse(req.body.products) : [];
    } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON format in categories, coupons, or products' });
    }

    const { error } = validateStore(req.body);
    if (error) {
        return res.status(400).json({ errors: error.details.map(e => e.message) });
    }

    const { name, description, link, categories, coupons, products } = req.body;

    const newStore = new Store({
        name,
        description,
        link,
        logo: req.file.path,
        categories,
        coupons,   // ✅ Now saving products & coupons properly
        products,
    });

    await newStore.save();

    // ✅ Fetch the store again with population to get full details
    const populatedStore = await Store.findById(newStore._id)
        .populate('categories')
        .populate('coupons')
        .populate('products');

    res.status(201).json({
        message: 'Store created successfully',
        store: populatedStore,
    });
});
