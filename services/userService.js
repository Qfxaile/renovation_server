const User = require('../models/User');

const userService = {
    getAllAdmins: async () => {
        return await User.getByRole('admin');
    }
};

module.exports = userService;