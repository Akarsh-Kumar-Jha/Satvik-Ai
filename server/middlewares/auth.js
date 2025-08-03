const jwt = require('jsonwebtoken');


require('dotenv').config();

const authMiddleware = (req,res,next) => {
    try {
        const {accessToken} = req.cookies;
        if(!accessToken){
            return res.status(403).json({
                success:false,
                message:"Token Not Found!"
            });
        };

        const decoded = jwt.verify(accessToken,process.env.JWT_SECRET_TOKEN)
        req.user = decoded;
        next()
    } catch (error) {
        console.error('User Not Authorized!');
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token!"
        });
    }
}

module.exports = authMiddleware;