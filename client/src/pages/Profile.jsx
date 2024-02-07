import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase.js";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from "../redux/user/userSlice.js";
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux";


const Profile = () => {
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileError, setFileError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showlistingError, setShowlistingError] = useState(false);
    const [listing, setListing] = useState([])
    const dispatch = useDispatch()


    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on("state_changed", (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePerc(Math.round(progress))

        },
            (error) => {
                setFileError(true)
            },

            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL })
                })
            }
        )
    }

    useEffect(() => {
        if (file) {
            handleFileUpload(file)
        }
    }, [file])



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }


    // for updating user in DB
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json();
            // console.log(data)
            if (data.success == false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }

    }


    // for deleting user from database 

    const handleDeleteUser = async () => {


        try {
            dispatch(deleteUserStart());

            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            })
            const data = await res.json();

            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }

            dispatch(deleteUserSuccess(data))
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }


    // For signing out user
    const handleSignout = async () => {
        try {
            dispatch(signOutUserStart())
            const res = await fetch("/api/auth/signout")
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message))
                return;
            }
            dispatch(signOutUserSuccess(data))
        } catch (error) {
            dispatch(signOutUserFailure(data.message))
        }
    }



    // fetch perticular user listings

    const showListing = async () => {
        try {
            setShowlistingError(false)
            const res = await fetch(`api/user/getlisting/${currentUser._id}`);
            const data = await res.json();
            // console.log(data)
            if (data.success === false) {
                setShowlistingError(true)
                return;
            }
            setListing(data)
        } catch (error) {
            setShowlistingError(true)
        }
    }

    // Delete listing

    const handleListingDelete = async (id) => {
        // console.log(id)
        try {
            const res = await fetch(`api/listing/delete/${id}`, {
                method: 'DELETE',

            })
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message)
                return;
            }
            // if(!res) return 
            setListing((prev) => prev.filter((listing) => listing._id != id))
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className='text-3xl font-bold text-center my-7'>Profile</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input onChange={(e) => setFile(e.target.files[0])} type="file" name="" id="" ref={fileRef} hidden accept="image/*" />
                <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" alt="profile" />

                <p className="text-sm text-center">
                    {
                        fileError ? <span className="text-red-700 font-bold">
                            Error while uploading file (Image must be less than 2mb)
                        </span> :
                            filePerc > 0 && filePerc < 100 ? (
                                <span className="text-slate-700">
                                    Uploading {filePerc} %
                                </span>
                            ) : (filePerc === 100) ? (
                                <span className="text-green-700"> Image Uploaded Successfully </span>
                            ) : ""
                    }

                </p>
                <input type="text" defaultValue={currentUser.username} placeholder="username" id="username" className="border p-3 rounded-lg" onChange={handleChange} />
                <input type="email" defaultValue={currentUser.email} placeholder="email" id="email" className="border p-3 rounded-lg" onChange={handleChange} />
                <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" onChange={handleChange} />
                <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">

                    {
                        loading ? "Loading..." : "Update"
                    }
                </button>

                <Link className="p-3 rounded-lg bg-green-600 text-white font-bold text-center uppercase hover:opacity-95" to="/create-listing">Create Listing</Link>
            </form>

            <div className="flex justify-between mt-5 font-bold">
                <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
                <span onClick={handleSignout} className="text-red-700 cursor-pointer">Signout</span>

            </div>

            <p className="text-red-700 font-bold mt-5 text-center">
                {
                    error ? error : ""
                }
            </p>

            <p className="text-green-700 font-bold mt-5 text-center">
                {
                    updateSuccess ? "User is updated successfully!" : ""
                }
            </p>

            <button onClick={() => showListing()} className="text-green-700 w-full text-center font-bold mt-3">Show listing</button>
            <p className="text-center font-bold text-red-700">
                {
                    showlistingError ? "Error While Showing Listing" : ""
                }
            </p>

            {
                listing && listing.length > 0 &&

                listing.map((listing, i) => (
                    <div key={i} className="flex justify-between items-center border-2 shadow-sm rounded-lg mt-3 p-3 gap-4 " >
                        <Link to={`/listing/${listing._id}`}>
                            <img src={listing.imageUrls[0]} alt="Listing cover photo" className="object-contain h-16 w-16" />
                        </Link>

                        <Link to={`/listing/${listing._id}`} className="text-slate-700 font-semibold hover:underline flex-1 truncate">
                            <p className="text-sm md:text-md" >  {listing.name}</p>
                        </Link>

                        <div className="flex gap-1">
                            <Link to={`/update-listing/${listing._id}`}>
                                <button className="bg-slate-600 md:p-3 p-2 rounded-lg text-white">Edit</button>
                            </Link>
                            <button onClick={() => handleListingDelete(listing._id)} className="bg-red-600 md:p-3 p-2 rounded-lg text-white">Delete</button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Profile