import { useContext, useState } from "react";
import { TripContext } from "../context/TripContext";
import { FaCheckSquare, FaSquare, FaLightbulb } from "react-icons/fa";

function PackingList() {
  const { tripPlan } = useContext(TripContext);
  const [checkedItems, setCheckedItems] = useState({});

  if (!tripPlan) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[220px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Preparing packing list...</p>
      </div>
    );
  }

  const instructions = tripPlan.packingInstructions || "Pack according to general regional weather guidelines.";
  const items = tripPlan.packingList || [];

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[220px] flex items-center justify-center text-gray-500">
        🎒 No packing recommendations compiled.
      </div>
    );
  }

  // Group items by category
  const categories = {};
  items.forEach((itemObj, index) => {
    const itemName = typeof itemObj === "object" ? itemObj.item : itemObj;
    const itemCat = typeof itemObj === "object" ? itemObj.category || "General" : "General";
    
    if (!categories[itemCat]) {
      categories[itemCat] = [];
    }
    categories[itemCat].push({ id: index, name: itemName });
  });

  const toggleItem = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <h2 className="text-3xl font-extrabold text-blue-600 flex items-center gap-2">
          🎒 Packing Guide
        </h2>
      </div>

      {/* AI Advice/Instructions Banner */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <FaLightbulb className="text-yellow-500 shrink-0 text-xl mt-0.5" />
        <div>
          <h4 className="font-bold text-blue-900 text-sm">AI Packing Advice</h4>
          <p className="text-gray-700 text-xs mt-1 leading-relaxed">{instructions}</p>
        </div>
      </div>

      {/* Interactive Checklist */}
      <div className="space-y-6">
        {Object.keys(categories).map((catName) => (
          <div key={catName} className="space-y-3">
            <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-1">
              {catName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories[catName].map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all duration-150
                    ${
                      isChecked
                        ? "bg-green-50 border-green-200 text-gray-400 line-through"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-700"
                    }`}
                  >
                    {isChecked ? (
                      <FaCheckSquare className="text-green-600 shrink-0 text-lg" />
                    ) : (
                      <FaSquare className="text-gray-300 shrink-0 text-lg" />
                    )}
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PackingList;