import React, { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase"
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom"
const UpdateListing = () => {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate()
    const [files, setFiles] = useState([]);
    const params = useParams()
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    // console.log(error)
    const [loading, setLoading] = useState(false)
    const [imageUploadError, setImageUploadError] = useState(false)
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false
    })
    // console.log(formData);


    // FETCHING DATA FROM BACKEND FOR PREFILL

    useEffect(() => {
        const fetchListing = async () => {

            const listingID = params.id;
            // console.log(listingID);
            const res = await fetch(`/api/listing/getListing/${listingID}`);
            const data = await res.json();
            // console.log(data);
            if (data.success === false) {
                console.log(data.message)
                return
            }
            setFormData(data)
        }

        fetchListing()
    }, []);

    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false)
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                setImageUploadError(false)
                setUploading(false);

            }).catch((error) => {
                setUploading(false);
                setImageUploadError("Image upload faild (2mb max per image)")

            })

        } else {
            setUploading(false);
            setImageUploadError("Image upload only 6 images per listing")
        }
    }



    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`upload is ${progress}% done `)
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
                        resolve(getDownloadURL)
                    })
                }
            )
        })
    }



    // Delete Image Functonality

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData, imageUrls: formData.imageUrls.filter((url, i) => index != i)
        })
    }


    // for storing rest of form data 

    const handleChange = (e) => {
        if (e.target.id === "sale" || "rent") {
            setFormData({ ...formData, type: e.target.id })
        }

        if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if (e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea") {
            setFormData({ ...formData, [e.target.id]: e.target.value })
        }
    }


    // for submitting form to backend route

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (formData.imageUrls.length < 1) return setError("Atleast 1 image of property must be uploaded")

            if (+formData.regularPrice < +formData.discountPrice) return setError("Discounted price must be smaller that regular price")
            setLoading(true);
            setError(false);

            const res = await fetch(`/api/listing/update/${params.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            })

            const data = await res.json()
            console.log(data)
            setLoading(false)

            if (data.success === false) {

                setError(data.message)
            }
            navigate(`/listing/${data._id}`)




        } catch (error) {
            console.log(error.message)
            setLoading(false)
            setError(error.message);
        }

    }
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7 '>Update Listing</h1>


            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" id="name" placeholder='Name' className='border p-3 rounded-lg'
                        minLength="10" maxLength="62" required value={formData.name} onChange={handleChange}
                    />
                    <textarea type="text" id="description" placeholder='Description' className='border p-3 rounded-lg'
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input type="text" id="address" placeholder='Address' className='border p-3 rounded-lg'
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />

                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type === "sale"} />
                            <span>sale</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type === "rent"} />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />

                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id="bedrooms" name="" min={1} max={10} required onChange={handleChange} value={formData.bedrooms} />
                            <span>Beds</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id="bathrooms" name="" min={1} max={10} required onChange={handleChange} value={formData.bathrooms} />
                            <span>Baths</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id="regularPrice" name="" min={50} max={100000} required onChange={handleChange} value={formData.regularPrice} />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>

                        {
                            formData.offer && <div className='flex items-center gap-2'>
                                <input className='p-3 border border-gray-300 rounded-lg' type="number" id="discountPrice" name="" min={0} max={10000} required onChange={handleChange} value={formData.discountPrice} />
                                <div className='flex flex-col items-center'>
                                    <p>Discount Price</p>
                                    <span className='text-xs'>($ / month)</span>
                                </div>
                            </div>
                        }

                    </div>
                </div>

                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images :
                        <span className='text-gray-600 font-normal ml-2'>The first image will be the cover (max6)</span>
                    </p>

                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" name="" id="images" accept='image/*' multiple />
                        <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>

                            {
                                uploading ? "Uploading..." : "Upload"
                            }
                        </button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>

                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((image, i) => (
                            <div key={i} className=' flex justify-between p-3 border items-center'>
                                <img src={image} alt="image" className='h-20 w-20 object-contain rounded-lg' />
                                <button type='button' onClick={() => handleRemoveImage(i)} className='text-red-700 p-3 rounded-lg uppercase hover:bg-red-700 hover:text-white duration-500'>Delete</button>
                            </div>
                        ))
                    }
                    <button disabled={loading || uploading} className='p-3 rounded-lg bg-slate-700 text-white hover:opacity-95 disabled:opacity-80'>{loading ? "UPDATING..." : "UPDATE LISTING"}</button>

                    {
                        error && <p className='text-red-700 text-sm text-center'>{error}</p>
                    }
                </div>


            </form>
        </main>
    )
}

export default UpdateListing