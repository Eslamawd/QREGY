import React, { useState } from "react";

const PaymentGetway = () => {
  const [message, setMessage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage({
      text: "تمت عملية الدفع بنجاح. شكراً لك!",
      type: "success",
    });

    // Hide message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const messageClasses = message
    ? message.type === "success"
      ? "bg-green-600 text-white"
      : "bg-red-600 text-white"
    : "hidden";

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 bg-[#0c0e16] text-gray-300">
      <div className="container w-full max-w-2xl mx-auto rounded-lg shadow-lg p-6 sm:p-8 space-y-8 bg-[#1a1e2a] border border-[#374151]">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            بوابة الدفع
          </h1>
          <p className="text-gray-400">
            يرجى إدخال تفاصيل بطاقتك الائتمانية لإتمام عملية الشراء.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label
              htmlFor="card-number"
              className="block text-sm font-medium text-gray-300"
            >
              رقم البطاقة
            </label>
            <input
              type="text"
              id="card-number"
              name="card-number"
              placeholder="0000 0000 0000 0000"
              className="w-full px-4 py-3 rounded-md bg-[#2b3040] border border-[#4b5563] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-4">
              <label
                htmlFor="expiry-date"
                className="block text-sm font-medium text-gray-300"
              >
                تاريخ الانتهاء
              </label>
              <input
                type="text"
                id="expiry-date"
                name="expiry-date"
                placeholder="MM / YY"
                className="w-full px-4 py-3 rounded-md bg-[#2b3040] border border-[#4b5563] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                required
              />
            </div>
            <div className="flex-1 space-y-4">
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-300"
              >
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                className="w-full px-4 py-3 rounded-md bg-[#2b3040] border border-[#4b5563] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="card-holder"
              className="block text-sm font-medium text-gray-300"
            >
              اسم صاحب البطاقة
            </label>
            <input
              type="text"
              id="card-holder"
              name="card-holder"
              placeholder="الاسم كما هو مكتوب على البطاقة"
              className="w-full px-4 py-3 rounded-md bg-[#2b3040] border border-[#4b5563] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6366f1] text-white font-semibold py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 hover:bg-[#4f46e5]"
          >
            ادفع الآن
          </button>
        </form>

        {/* Message Box */}
        <div
          id="message-box"
          className={`text-center p-4 rounded-md mt-6 ${messageClasses}`}
          role="alert"
        >
          {message && <p className="text-sm font-medium">{message.text}</p>}
        </div>
      </div>
    </div>
  );
};

export default PaymentGetway;
