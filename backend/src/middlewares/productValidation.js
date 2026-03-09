const productValidation = (req, res, next) => {
    const { name, description, reference, price, category, stock } = req.body;

    // Check presence only — don't check typeof since JSON parsing can vary
    if (!name || !description || !reference || price === undefined || price === "" || !category || stock === undefined || stock === "") {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (typeof name !== 'string' || name.trim().length < 1)
        return res.status(400).json({ message: 'Invalid product name' });

    if (typeof reference !== 'string' || reference.trim().length < 1)
        return res.status(400).json({ message: 'Invalid product reference' });

    if (typeof description !== 'string' || description.trim().length < 1)
        return res.status(400).json({ message: 'Invalid product description' });

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0)
        return res.status(400).json({ message: 'Invalid product price' });

    if (typeof category !== 'string' || category.trim().length < 1)
        return res.status(400).json({ message: 'Invalid product category' });

    const parsedStock = Number(stock);
    if (isNaN(parsedStock) || parsedStock < 0)
        return res.status(400).json({ message: 'Invalid product stock' });

    next();
};

export default productValidation;