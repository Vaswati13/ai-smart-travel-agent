function RestaurantCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600">
        🍽️ Recommended Restaurants
      </h2>

      <div className="mt-4 space-y-3">
        <div className="border rounded-xl p-3">
          <h3 className="font-bold">Restaurant Name</h3>
          <p>Location</p>
          <p>⭐ 4.8</p>
        </div>

        <div className="border rounded-xl p-3">
          <h3 className="font-bold">Restaurant Name</h3>
          <p>Location</p>
          <p>⭐ 4.7</p>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;