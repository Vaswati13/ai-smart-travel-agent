function HotelCard() {
  const hotels = [
    {
      name: "The Grand Palace",
      location: "City Center",
      rating: "4.8",
      price: "₹4,500 / night",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    },
    {
      name: "Luxury Inn",
      location: "Near Airport",
      rating: "4.6",
      price: "₹3,200 / night",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-5">
        🏨 Recommended Hotels
      </h2>

      <div className="space-y-5">
        {hotels.map((hotel, index) => (
          <div
            key={index}
            className="border rounded-2xl overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-xl font-bold">{hotel.name}</h3>

              <p className="text-gray-500">
                📍 {hotel.location}
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-yellow-500">
                  ⭐ {hotel.rating}
                </span>

                <span className="font-bold text-green-600">
                  {hotel.price}
                </span>
              </div>

              <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotelCard;