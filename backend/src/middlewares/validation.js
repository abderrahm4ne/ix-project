const validateUser = (req, res, next) => {

    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    if(firstName.trim().length < 1 || lastName.trim().length < 1) {
        return res.status(400).json({ message: 'First name and last name are required' });
    }

    req.body.email = email.trim();
    req.body.firstName = firstName.trim();
    req.body.lastName = lastName.trim();

    next();

}

export default validateUser;