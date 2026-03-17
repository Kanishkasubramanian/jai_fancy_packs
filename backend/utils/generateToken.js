import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'jaifancypacks_secret_key_2024', {
        expiresIn: '30d',
    });
};

export default generateToken;
