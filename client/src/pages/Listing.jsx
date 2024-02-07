import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import { IoLocationOutline } from "react-icons/io5";
import { IoBedOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { LuParkingCircle } from "react-icons/lu";
import { TbSofa } from "react-icons/tb";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  // console.log(listing);
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.id;
        setLoading(true);
        const res = await fetch(`/api/listing/getListing/${listingId}`);

        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);
  return (
    <main>
      {loading && <p className="text-center text-lg mt-5">Loading...</p>}

      {error && (
        <p className="text-center text-lg mt-5"> Something Went Wrong</p>
      )}

      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url, i) => (
              <SwiperSlide key={i}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat `,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* All Listing  */}
          <div className="max-w-4xl mx-auto mt-5 mb-5">
            <div>
              <h1 className="font-bold text-4xl ">{listing.name}</h1>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <IoLocationOutline className="text-4xl text-green-800" />{" "}
              <h1 className=" text-md  ">{listing.address}</h1>
            </div>

            <div className="flex items-center mt-5 gap-3">
              <div className=" text-white">
                {listing.type === "rent" ? (
                  <p className="bg-red-800 py-2 px-5 text-xl rounded-md capitalize">
                    {listing.type}
                  </p>
                ) : (
                  <p className="bg-green-800 p-3">{listing.type}</p>
                )}
              </div>
              {listing.offer && (
                <p className=" py-2 px-3 bg-green-800  rounded-md text-xl text-white">
                  ${+listing.regularPrice - +listing.discountPrice} Discount
                </p>
              )}
            </div>

            <div className="mt-5">
              {listing.description && (
                <p>
                  <span className="text-xl font-bold">Description :- </span>
                  {listing.description}
                </p>
              )}
            </div>

            {/*beds, bathroom ,  */}

            <div className="mt-5 flex gap-5">
              <div className="flex items-center gap-2">
                <IoBedOutline className="text-xl" /> Beds {listing.bedrooms}
              </div>
              <div className="flex items-center gap-2">
                <LuBath className="text-xl" /> Bath {listing.bathrooms}
              </div>
              <div className="flex items-center gap-2">
                <LuParkingCircle className="text-xl" /> Parking{" "}
                {listing.parking}
              </div>
              <div className="flex items-center gap-2">
                <TbSofa className="text-xl" /> Furnished {listing.furnished}
              </div>
            </div>

            {/* bottom button */}

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <div className="mt-5 ">
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white uppercase rounded-md hover:opacity-95 p-2 py-4 font-bold w-full"
                >
                  Contact Landlord
                </button>
              </div>
            )}

            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
