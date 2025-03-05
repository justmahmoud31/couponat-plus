import { Store } from "../../../../database/Models/Store.js";
import { catchError } from "../../../Middlewares/catchError.js";
import { validateStore } from "../stores.validation.js";

export const addStore = catchError(async (req, res, next) => {

    if (!req.file) {
        return res.status(400).json({ message: 'Store logo is required' });
    }

    // Parse arrays first
    if (req.body.categories) {
        try {
            req.body.categories = JSON.parse(req.body.categories);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid JSON format in categories' });
        }
    }

    if (req.body.coupons) {
        try {
            req.body.coupons = JSON.parse(req.body.coupons);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid JSON format in coupons' });
        }
    }

    // Validate
    const { error } = validateStore(req.body);
    if (error) {
        return res.status(400).json({ errors: error.details.map(e => e.message) });
    }

    const {
        name,
        description,
        link,
        categories = [],
        coupons = [],
        rate = 0
    } = req.body;

    const newStore = new Store({
        name,
        description,
        link,
        logo: req.file.path,
        categories,
        coupons,
        rate
    });

    const savedStore = await newStore.save();

    await savedStore.populate(['categories', 'coupons']);

    res.status(201).json({
        message: 'Store created successfully',
        store: savedStore
    });
});
