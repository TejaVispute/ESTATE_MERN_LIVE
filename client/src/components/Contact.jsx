import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
    const [Landlord, setLandlord] = useState(null);
    // console.log(Landlord)
    const [message, setMessage] = useState("");
    console.log(message)

    const setMess = (e) => {
        setMessage(e.target.value)
    }

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);

                const data = await res.json();

                setLandlord(data)
            } catch (error) {
                console.log(error);
            }
        }


        fetchLandlord()
    }, [listing.userRef])
    return (
        <>
            {
                Landlord && (
                    <div className='mt-5 text-xl'>
                        <p>Contact :- <span className='font-bold'>{Landlord.username}</span> for <span className='font-bold'>{listing.name.toLowerCase()}</span> </p>
                        <textarea
                            value={message}
                            onChange={setMess}
                            name="message"
                            id="message"
                            rows="2"
                            className='w-full border p-3 rounded-lg'
                        ></textarea>

                        <div className='mt-3 flex justify-center max-w-lg mx-auto  bg-slate-700 text-white text-center p-3 rounded-md hover:opacity-95 cursor-pointer'>
                            <Link to={`mailto:${Landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>
                                Send
                            </Link>

                        </div>
                    </div>

                )
            }
        </>
    )
}

export default Contact