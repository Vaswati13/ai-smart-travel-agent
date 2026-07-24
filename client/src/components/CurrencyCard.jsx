import { useContext, useEffect, useState } from "react";
import { TripContext } from "../context/TripContext";

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  AUD: "A$",
  CAD: "C$",
  SGD: "S$",
  CHF: "CHF",
  NZD: "NZ$",
  HKD: "HK$",
  THB: "฿",
  KRW: "₩",
  AED: "د.إ",
  SAR: "ر.س",
  RUB: "₽",
  ZAR: "R",
  TRY: "₺",
  MYR: "RM",
  IDR: "Rp",
  PHP: "₱",
  VND: "₫",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł"
};

function CurrencyCard() {
  const { tripPlan } = useContext(TripContext);
  const [inrAmount, setInrAmount] = useState("100");
  const [foreignAmount, setForeignAmount] = useState("100");

  useEffect(() => {
    if (tripPlan) {
      const initialInr = 100;
      setInrAmount(initialInr.toString());
      setForeignAmount((initialInr * (tripPlan.currencyRate || 1)).toFixed(2));
    }
  }, [tripPlan]);

  const handleInrChange = (val) => {
    setInrAmount(val);
    if (val === "" || !tripPlan) {
      setForeignAmount("");
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setForeignAmount((num * (tripPlan.currencyRate || 1)).toFixed(2));
    }
  };

  const handleForeignChange = (val) => {
    setForeignAmount(val);
    if (val === "" || !tripPlan) {
      setInrAmount("");
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setInrAmount((num / (tripPlan.currencyRate || 1)).toFixed(2));
    }
  };

  if (!tripPlan) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[220px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Detecting local currency...</p>
      </div>
    );
  }

  const destCode = tripPlan.currencyCode || "INR";
  const symbol = currencySymbols[destCode] || destCode;
  const isDomestic = destCode === "INR";
  const rate = tripPlan.currencyRate || 1;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
          💱 Currency Converter
        </h2>
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase">
          {destCode}
        </span>
      </div>

      {isDomestic ? (
        <div className="text-center py-4 bg-gray-50 rounded-xl mb-4">
          <p className="text-gray-600 text-sm">
            Travelling within India! No conversion required.
          </p>
          <p className="text-2xl font-bold text-gray-800 mt-1">₹ Indian Rupee (INR)</p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-600 text-sm font-medium">
            1 INR = <span className="font-bold text-green-600">{rate.toFixed(4)}</span> {destCode}
          </div>

          <div className="space-y-4">
            {/* INR Input */}
            <div className="relative">
              <label className="text-xs text-gray-500 font-bold block mb-1">From INR</label>
              <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  value={inrAmount}
                  onChange={(e) => handleInrChange(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-green-500 focus:border-green-500 text-sm font-semibold"
                  placeholder="Amount in INR"
                />
              </div>
            </div>

            {/* Switch Icon */}
            <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-green-50 text-green-600 p-1.5 rounded-full border border-green-200 shadow-sm cursor-pointer hover:bg-green-100 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
              </div>
            </div>

            {/* Foreign Currency Input */}
            <div className="relative">
              <label className="text-xs text-gray-500 font-bold block mb-1">To {destCode}</label>
              <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-bold">
                  {symbol}
                </span>
                <input
                  type="number"
                  value={foreignAmount}
                  onChange={(e) => handleForeignChange(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-green-500 focus:border-green-500 text-sm font-semibold"
                  placeholder={`Amount in ${destCode}`}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CurrencyCard;