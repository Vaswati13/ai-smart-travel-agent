import { useContext, useEffect, useState } from "react";
import { TripContext } from "../context/TripContext";
import { FaPiggyBank, FaWallet, FaInfoCircle } from "react-icons/fa";

function BudgetSection() {
  const { tripData, tripPlan } = useContext(TripContext);
  const [allocations, setAllocations] = useState({
    accommodation: 0,
    food: 0,
    transport: 0,
    activities: 0,
    shopping: 0,
  });

  const [savingTips, setSavingTips] = useState([]);

  useEffect(() => {
    if (tripPlan && tripPlan.budgetBreakdown) {
      const parseAmount = (val) => {
        if (typeof val === "number") return val;
        if (typeof val === "string") {
          const num = parseInt(val.replace(/[^\d]/g, ""), 10);
          return isNaN(num) ? 0 : num;
        }
        return 0;
      };

      setAllocations({
        accommodation: parseAmount(tripPlan.budgetBreakdown.accommodation),
        food: parseAmount(tripPlan.budgetBreakdown.food),
        transport: parseAmount(tripPlan.budgetBreakdown.transport),
        activities: parseAmount(tripPlan.budgetBreakdown.activities),
        shopping: parseAmount(tripPlan.budgetBreakdown.shopping),
      });

      setSavingTips(tripPlan.savingTips || [
        "Use local transport like buses or trains instead of private cabs to save up to 60%.",
        "Dine in local streets or small cafes away from the main tourist streets for authentic and budget-friendly meals.",
        "Book tourist attraction tickets online in advance to avoid high on-spot broker rates.",
        "Set a strict daily shopping allowance to prevent impulsive spending."
      ]);
    } else {
      // Static calculation based on total budget if tripPlan not loaded yet
      const total = parseInt(tripData.budget) || 10000;
      setAllocations({
        accommodation: Math.round(total * 0.4),
        food: Math.round(total * 0.2),
        transport: Math.round(total * 0.15),
        activities: Math.round(total * 0.15),
        shopping: Math.round(total * 0.1),
      });
    }
  }, [tripPlan, tripData.budget]);

  const totalAllocated = Object.values(allocations).reduce((a, b) => a + b, 0);
  const totalBudget = parseInt(tripData.budget) || 10000;
  const remaining = totalBudget - totalAllocated;
  const days = parseInt(tripData.days) || 1;
  const dailyAllowance = Math.round(totalBudget / days);

  const handleSliderChange = (category, value) => {
    const newVal = parseInt(value, 10) || 0;
    setAllocations((prev) => ({
      ...prev,
      [category]: newVal,
    }));
  };

  const getPercentage = (amount) => {
    if (totalBudget === 0) return 0;
    return Math.round((amount / totalBudget) * 100);
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto space-y-8">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            💰 AI Budget Planner
          </h2>
          <p className="mt-2 text-green-100 text-lg">
            Smart financial breakdowns tailored for your {days}-day trip to {tripData.destination || "your destination"}.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shrink-0 border border-white/20 w-full md:w-auto">
          <div className="text-sm font-semibold uppercase tracking-wider text-green-100">Daily Spending Allowance</div>
          <div className="text-4xl font-extrabold mt-1">₹{dailyAllowance.toLocaleString("en-IN")}<span className="text-lg font-normal">/day</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sliders Form Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-800">Adjust Allocations</h3>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${remaining >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {remaining >= 0 ? `Unallocated: ₹${remaining.toLocaleString("en-IN")}` : `Over Budget: ₹${Math.abs(remaining).toLocaleString("en-IN")}`}
            </span>
          </div>

          <div className="space-y-6">
            {/* Slider categories */}
            {Object.keys(allocations).map((category) => {
              const amount = allocations[category];
              const percent = getPercentage(amount);
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold text-gray-700">
                    <span className="capitalize">{category}</span>
                    <span>₹{amount.toLocaleString("en-IN")} ({percent}%)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={totalBudget}
                    step="100"
                    value={amount}
                    onChange={(e) => handleSliderChange(category, e.target.value)}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600 focus:outline-none"
                  />
                </div>
              );
            })}
          </div>

          {/* Progress Indicator */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-xs text-gray-500 font-bold">
              <span>Total Spent: ₹{totalAllocated.toLocaleString("en-IN")}</span>
              <span>Budget Limit: ₹{totalBudget.toLocaleString("en-IN")}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
              <div
                style={{ width: `${Math.min(100, (totalAllocated / totalBudget) * 100)}%` }}
                className={`h-full rounded-full transition-all duration-300 ${totalAllocated > totalBudget ? "bg-red-500" : "bg-green-500"}`}
              ></div>
            </div>
          </div>
        </div>

        {/* Dynamic Saving Tips Card */}
        <div className="bg-gradient-to-b from-blue-50 to-indigo-50/50 rounded-3xl p-6 border border-blue-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2 mb-4">
              <FaPiggyBank className="text-green-600" /> AI Saving Tips
            </h3>
            <div className="space-y-4">
              {savingTips.map((tip, idx) => (
                <div key={idx} className="flex gap-3">
                  <FaInfoCircle className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-xs leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-blue-100 text-center">
            <div className="text-xs text-gray-500 font-medium">
              💡 Budget allocations are initially determined by VoyageAI based on typical prices in {tripData.destination || "the region"}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetSection;
