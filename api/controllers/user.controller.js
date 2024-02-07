import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js"
import User from '../models/User.model.js';
import Listing from '../models/Listing.model.js';

export const userController = (req, res) => {
    res.send("router test")
}


// Update user controller
export const updateUser = async (req, res, next) => {

    if (req.user.id != req.params.id) return next(errorHandler(401, "Unauthorized"));


    try {

        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }


        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })

        console.log(updatedUser)

        const { password, ...rest } = updatedUser._doc;

        res.status(200).json(rest)


    } catch (error) {
        next(error)
    }
}

// Delete user functonality

export const deleteUser = async (req, res, next) => {
    if (req.user.id != req.params.id) return next(errorHandler(401, "You can only delete your account"));

    try {
        await User.findByIdAndDelete(req.user.id);
        res.clearCookie("access_token");
        res.status(200).json("User deleted successfully!");
    } catch (error) {
        next(error)
    }


}

export const getUserListings = async (req, res, next) => {

    if (req.user.id === req.params.id) {
        try {
            const listing = await Listing.find({ userRef: req.params.id })
            return res.status(200).json(listing)
        } catch (error) {
            next(error)
        }
    } else {
        return errorHandler(401, "You can only view your own listing")
    }
}


export const getUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(errorHandler(404, "User not found"))
        }

        const { password: pass, ...rest } = user._doc;

        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }

}