import itemModel from "../models/itemModel.js";


export const createItem = async (req, res, next) => {
    try {
        const { name, description, category, price, rating, hearts } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        // e.g. total might be price * hearts, or some other logic
        const total = Number(price) * 1; // replace with your own formula

        const newItem = new itemModel({
            name,
            description,
            category,
            price,
            rating,
            hearts,
            imageUrl,
            total,
        });

        const saved = await newItem.save();
        res.status(201).json(saved);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Item name already exists' });
        } else next(err);
    }
};

// GET FUNCTION TO GET ALL ITEMS
export const getItems = async (_req, res, next) => {
    try {
        console.log('Fetching items from database...');
        const items = await itemModel.find().sort({ createdAt: -1 });
        console.log(`Found ${items.length} items`);
        
        // Prefix image URLs with host for absolute path
        const host = `${_req.protocol}://${_req.get('host')}`;
        const withFullUrl = items.map(i => ({
            ...i.toObject(),
            imageUrl: i.imageUrl ? host + i.imageUrl : '',
        }));
        
        console.log('Sending response with items');
        res.json(withFullUrl);
    } catch (err) {
        console.error('Error in getItems:', err);
        res.status(500).json({ 
            message: 'Failed to fetch items',
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
};

export const deleteItem = async (req, res, next) => {
    try {
        const removed = await itemModel.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ message: 'Item not found' });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};