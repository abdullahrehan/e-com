const { User } = require('../models/index');


// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -verificationToken -verificationTokenExpires');
        return res.status(200).json({
            status: true,
            message: 'Users retrieved successfully',
            data: { users }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: {}
        });
    }
};

// Delete All Users
const deleteAllUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({});
        console.log(`Deleted ${result.deletedCount} users`);
        return res.status(200).json({
            status: true,
            message: 'All users deleted successfully',
            data: { deletedCount: result.deletedCount }
        });
    } catch (error) {
        console.error('Error deleting all users:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: {}
        });
    }
};

// Delete User by ID
const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid user ID format',
                data: {}
            });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
                data: {}
            });
        }

        console.log(`User deleted: ${user.email}`);
        return res.status(200).json({
            status: true,
            message: 'User deleted successfully',
            data: {
                deletedUser: { id: user._id, email: user.email, name: user.name }
            }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: {}
        });
    }
};

module.exports = {
    getAllUsers,
    deleteAllUsers,
    deleteUserById,
};
