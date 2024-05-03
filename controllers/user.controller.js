import User from "../models/user.model.js";

export const getUsersForSideBar = async (req, res) => {
    // consol
    try {
        const loggedInUserId = req.user._id;
        
        // console.log("loggedInUserId :", loggedInUserId)

        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        
        // console.log("filteredUsers :", filteredUsers)

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSideBar :", error.message);
    }
}