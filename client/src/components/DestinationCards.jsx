function DestinationCards() {
  const places = [
    {
      name: "Goa",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600",
    },
    {
      name: "Manali",
      image:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600",
    },
    {
      name: "Jaipur",
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8">
        🌍 Popular Destinations
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {places.map((place) => (
          <div
            key={place.name}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition duration-300"
          >
            <img
              src={place.image}
              alt={place.name}
              className="h-56 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="text-2xl font-bold">{place.name}</h3>

              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DestinationCards;