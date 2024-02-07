import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Listing from "../../../api/models/Listing.model";
import ListingCard from "../components/ListingCard";
const Search = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [Listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  //   console.log(Listing);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  //   fetching the search term from url

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      // console.log(searchQuery);
      const res = await fetch(`/api/listing/getListings?${searchQuery}`);
      const data = await res.json();
      if (data.length > 5) {
        setShowMore(true);
      }
      console.log(data);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  //   console.log(sidebarData);

  const handleChange = (e) => {
    // setting type
    if (
      e.target.id === "all" ||
      e.target.id === "sale" ||
      e.target.id === "rent"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    // setting searchterm
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  //   handle submit

  const handleSubmit = (e) => {
    // console.log(e);
    e.preventDefault();

    const urlParams = new URLSearchParams();

    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    let numberOfListings = Listings.length;
    // console.log(numberOfListings);
    const startIndex = numberOfListings;
    // console.log(location.search);
    const urlParams = new URLSearchParams(location.search);
    // console.log(urlParams);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/getListings?${searchQuery}`);
    let data = await res.json();
    // console.log(data);

    if (data.length < 6) {
      setShowMore(false);
    } else {
      setShowMore(false);
    }

    setListings([...Listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="border-b-2 p-7 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <input
              onChange={handleChange}
              value={sidebarData.searchTerm}
              type="text"
              id="searchTerm"
              placeholder="search..."
              className="p-3 border rounded-lg"
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label>Type:</label>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.type === "all"}
                type="checkbox"
                name=""
                id="all"
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
                type="checkbox"
                name=""
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
                type="checkbox"
                name=""
                id="sale"
                className="w-5"
              />
              <span>Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.offer}
                type="checkbox"
                name=""
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.parking}
                type="checkbox"
                name=""
                id="parking"
                className="w-5"
              />
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={sidebarData.furnished}
                type="checkbox"
                name=""
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>

            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value={"regularPrice_desc"}>Price high to low</option>
              <option value={"regularPrice_asc"}>Price low to high</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 p-3 rounded-lg uppercase text-white hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className=" flex-1">
        <h1 className="text-3xl text-slate-700 font-bold p-3 border-b mt-5">
          Listing Results:
        </h1>

        <div className="p-7 flex gap-5 flex-wrap items-center">
          {!loading && Listings.length === 0 && (
            <p className="text-xl text-center text-slate-700">
              No Listing Found!
            </p>
          )}

          {loading && (
            <p className="text-center text-2xl text-slate-700">Loading...</p>
          )}

          {!loading &&
            Listings &&
            Listings.map((listing) => (
              <ListingCard listing={listing} key={listing._id} />
            ))}

          {showMore && (
            <button
              className="text-green-700 text-center font-bold"
              onClick={onShowMoreClick}
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
