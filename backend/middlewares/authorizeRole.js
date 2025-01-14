const jwt = require('jsonwebtoken'); // Make sure you are using JWT for authentication

// Authorization middleware
const authorizeRole = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

        if (!token) {
            return res.status(401).json({ message: 'Access denied, no token provided.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token.' });
            }

            console.log(decoded); // Log decoded payload to check the role

            // Check if the user's role is authorized to access the route
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied, insufficient role.' });
            }

            req.user = decoded; // Attach user information to the request
            next();
        });
    };
};

module.exports = authorizeRole;
