import Listing from "../models/Listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    // console.log(req.body)

    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        console.log(error)
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {

    const listing = await Listing.findById(req.params.id);
    console.log(listing)
    if (!listing) return next(errorHandler(404, "Listing not found"));

    if (req.user.id !== listing.userRef) return next(errorHandler(401, "You can only delete your own listing"))

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing Deleted Successfully")
    } catch (error) {
        next(error)
    }

}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, "Listing Not Found"));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only update your own listing"));
    }
    try {
        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.status(200).json(updateListing);
    } catch (error) {
        console.log(error);
        return next(errorHandler(500, "Internal Server Error"));
    }
}


export const getListing = async (req, res, next) => {
    // console.log(req.params.id);
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, "No Listing Found"));
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error);
    }
}

// export const getListings = async (req, res, next) => {
//     console.log(req.query)
//     try {
//         const limit = parseInt(req.query.limit) || 10;
//         const startIndex = parseInt(req.query.startIndex) || 0;
//         let offer = req.query.offer;

//         if (offer === undefined || offer === false) {
//             offer = { $in: [false, true] }
//         }

//         let furnished = req.query.furnished;

//         if (furnished === undefined || furnished === false) {
//             furnished = { $in: [true, false] }
//         }

//         let parking = req.query.parking;

//         if (parking === undefined || parking === false) {
//             parking = { $in: [false, true] }
//         }

//         let type = req.query.type;

//         if (type === undefined || type === "all") {
//             type = { $in: ["sale", "rent"] }
//         }

//         let searchTerm = req.query.searchTerm || "";

//         let sort = req.query.sort || "createdAt";

//         let order = req.query.order || "desc";


//         // find listing according to query

//         const listings = await Listing({
//             name: { $regex: searchTerm, $options: "i" },
//             offer,
//             furnished,
//             parking,
//             type,
//         }).sort(
//             { [sort]: order }
//         ).limit(limit).skip(startIndex)

//         return res.status(200).json(listings);




//     } catch (error) {
//         next(error)
//     }
// }

export const getListings = async (req, res, next) => {
    // console.log(req.query);

    try {
        // Parse and set default values for pagination
        const limit = parseInt(req.query.limit) || 6;
        // console.log(limit);
        const startIndex = parseInt(req.query.startIndex) || 0;

        // Parse and handle query parameters
        let offer = req.query.offer;
        if (offer === undefined || offer === "false") {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === "false") {
            furnished = { $in: [true, false] };
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === "false") {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;
        if (type === undefined || type === "all") {
            type = { $in: ["sale", "rent"] };
        }

        let searchTerm = req.query.searchTerm || "";
        let sort = req.query.sort || "createdAt";
        let order = req.query.order || "desc";

        // Build the query object based on parameters


        const query = {
            name: { $regex: searchTerm, $options: "i" },
            offer,
            furnished,
            parking,
            type,
        };

        console.log(query);

        // Find listings according to the query
        const listings = await Listing.find(query)
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        // Return the listings as JSON response
        return res.status(200).json(listings);
    } catch (error) {
        // Handle errors and pass them to the error handling middleware
        next(error);
    }
};
