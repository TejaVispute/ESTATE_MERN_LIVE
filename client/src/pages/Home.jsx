import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import ListingCard from "../components/ListingCard";
const Home = () => {
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch("/api/listing/getListings?offer=true&limit=4");
        const data = await res.json();
        setOfferListing(data);
        fetchRentListings();
        // console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/getListings?type=rent&limit=4");
        const data = await res.json();
        // console.log(data);
        setRentListing(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListing = async () => {
      try {
        const res = await fetch("/api/listing/getListings?type=sale&limit=4");
        const data = await res.json();
        // console.log(data);
        setSaleListing(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListing();
  }, []);
  return (
    <div>
      {/* top side */}

      <div className="flex flex-col gap-6 md:p-28 p-14 x-3 max-w-6xl  mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find Your Next <span className="text-slate-500">Perfect</span> <br />{" "}
          Place with ease
        </h1>

        <div className="text-gray-400 text-xs sm:text-sm">
          MH19 is the best place to find your perfect place to live. <br />
          We have wide range of peoperties for you choose from
        </div>

        <Link
          className="text-xs sm:text-sm text-blue-700 font-bold hover:underline"
          to={"/search"}
        >
          Let's Start Now
        </Link>
      </div>

      {/* swiper
       */}

      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((list) => {
            console.log(list);
            return (
              <SwiperSlide key={list._id}>
                <div
                  style={{
                    background: `url(${list.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                ></div>
              </SwiperSlide>
            );
          })}
      </Swiper>

      {/* listing results for offer sale and rent */}

      <div className="  p-3 flex flex-col gap-5  my-10  mx-10">
        {offerListing && offerListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>

            <div className="flex gap-5 flex-wrap ">
              {offerListing.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent Places for Rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>

            <div className="flex gap-5 flex-wrap ">
              {rentListing.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Sale Listing
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more properties for sale
              </Link>
            </div>

            <div className="flex gap-5 flex-wrap ">
              {saleListing.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
