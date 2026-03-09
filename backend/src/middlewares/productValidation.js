const productValidation = (req, res, next) => {
    const { name, description, reference, price, category, stock } = req.body;

    if (!name || !description || !reference || !price || !category || stock === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (typeof name !== 'string' || name.trim().length < 1)
        return res.status(400).json({ message: 'Invalid product name' });

    if (typeof reference !== 'string' || reference.trim().length < 1)
        return res.status(400).json({ message: 'Invalid product reference' });

    if (typeof description !== 'string' || description.trim().length < 1)
        return res.status(400).json({ message: 'Invalid product description' });

    if (typeof price !== 'number' || price <= 0)
        return res.status(400).json({ message: 'Invalid product price' });

    if (typeof category !== 'string' || category.trim().length < 1)
        return res.status(400).json({ message: 'Invalid product category' });

    if (typeof stock !== 'number' || stock < 0)
        return res.status(400).json({ message: 'Invalid product stock' });

    next();
};

export default productValidation;