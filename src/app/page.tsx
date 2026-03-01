"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  priority: number;
  icon: string;
  color: string;
  count: number;
  percentage: number;
}

const initialCategories: Category[] = [
  { id: "ibu-bapa", name: "Ibu Bapa", priority: 1, icon: "👨‍👩‍👧", color: "from-green-600 to-green-400", count: 2, percentage: 40 },
  { id: "adik-beradik", name: "Adik Beradik", priority: 2, icon: "👫", color: "from-yellow-600 to-yellow-400", count: 0, percentage: 20 },
  { id: "anak-buah-fav", name: "Anak Buah (Fav)", priority: 3, icon: "⭐", color: "from-orange-500 to-orange-300", count: 0, percentage: 15 },
  { id: "anak-buah-biasa", name: "Anak Buah (Biasa)", priority: 4, icon: "👶", color: "from-blue-500 to-blue-300", count: 0, percentage: 15 },
  { id: "jiran", name: "Jiran / Side Kids", priority: 5, icon: "🏘️", color: "from-purple-500 to-purple-300", count: 0, percentage: 10 },
];

function KetupatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 4L4 32L32 60L60 32L32 4Z" fill="#22C55E" stroke="#15803D" strokeWidth="2"/>
      <path d="M32 16L16 32L32 48L48 32L32 16Z" fill="#86EFAC" stroke="#22C55E" strokeWidth="1.5"/>
      <path d="M32 24L24 32L32 40L40 32L32 24Z" fill="#166534"/>
    </svg>
  );
}

function getVerdict(budget: number, totalDistributed: number, categories: Category[]) {
  if (totalDistributed === 0) return { title: "🤔 Kira Dulu!", desc: "Masukkan budget dan anggaran", type: "neutral" };
  
  const ratio = totalDistributed / budget;
  const totalRecipients = categories.reduce((sum, c) => sum + c.count, 0);
  
  if (ratio < 0.3 || totalRecipients === 0) {
    return { 
      title: "💸 Haji Bakhil! 😱", 
      desc: "Budget mahal ni? Bagi sikit sangat! Anak2 semua masak air je ke?", 
      type: "bakhil" 
    };
  } else if (ratio < 0.6) {
    return { 
      title: "😐 Ambil Begini", 
      desc: "Standard la ni. Bukan sangat royal, bukan sangat kedekut.", 
      type: "medium" 
    };
  } else if (ratio < 0.9) {
    return { 
      title: "👍 Malaysia number One!", 
      desc: "Baik ni! Dah buat family happy dah ni. 🏆", 
      type: "good" 
    };
  } else {
    return { 
      title: "👑 SULTAN PEMURAH! 👑", 
      desc: "WAU! Bagi banyak sangat! Family Extended pon happy! 😍💰", 
      type: "sultan" 
    };
  }
}

export default function DuitRayaCalculator() {
  const [budget, setBudget] = useState<number>(1000);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showResult, setShowResult] = useState(false);

  const distributed = useMemo(() => {
    const total = categories.reduce((sum, cat) => {
      return sum + (budget * cat.percentage / 100) * cat.count;
    }, 0);
    return total;
  }, [budget, categories]);

  const perPerson = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      amount: (budget * cat.percentage / 100)
    }));
  }, [budget, categories]);

  const updateCategory = (id: string, field: keyof Category, value: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const verdict = useMemo(() => getVerdict(budget, distributed, categories), [budget, distributed, categories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-yellow-700 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center items-center gap-2 mb-2">
            <KetupatIcon className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              💸 Duit Raya Calculator
            </h1>
            <KetupatIcon className="w-12 h-12" />
          </div>
          <p className="text-green-100 text-lg">Budget Raya 2026 kita! 🎉</p>
        </motion.div>

        {/* Main Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8"
        >
          {/* Budget Input */}
          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-3 text-lg">
              💰 Jumlah Budget Raya (RM)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🇲🇾</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full pl-12 pr-4 py-4 text-3xl font-bold text-green-700 border-3 border-green-300 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-200 outline-none transition-all"
                placeholder="1000"
              />
            </div>
            <div className="flex gap-2 mt-3">
              {[500, 1000, 2000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBudget(amount)}
                  className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
                    budget === amount 
                      ? "bg-green-500 text-white" 
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  RM{amount}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
              📋 <span className="bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                Budget Allocation
              </span>
            </h2>
            
            {perPerson.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100 hover:border-green-200 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{cat.name}</h3>
                      <span className="text-xs text-gray-500">Priority {cat.priority}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      RM{cat.amount.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500">per orang</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Bilangan Orang</label>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateCategory(cat.id, "count", Math.max(0, cat.count - 1))}
                        className="w-10 h-10 rounded-xl bg-red-100 text-red-600 font-bold text-xl hover:bg-red-200 transition"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={cat.count}
                        onChange={(e) => updateCategory(cat.id, "count", Math.max(0, Number(e.target.value)))}
                        className="w-16 text-center font-bold text-lg border-2 border-gray-200 rounded-xl focus:border-green-400 outline-none"
                      />
                      <button
                        onClick={() => updateCategory(cat.id, "count", cat.count + 1)}
                        className="w-10 h-10 rounded-xl bg-green-100 text-green-600 font-bold text-xl hover:bg-green-200 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium">% of Budget</label>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      value={cat.percentage}
                      onChange={(e) => updateCategory(cat.id, "percentage", Number(e.target.value))}
                      className="w-full mt-3 accent-green-500"
                    />
                    <p className="text-right text-sm font-bold text-green-600">{cat.percentage}%</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    💵 <span className="font-bold">Total: RM{(cat.amount * cat.count).toFixed(2)}</span> 
                    {" "}({cat.count} orang × RM{cat.amount.toFixed(0)})
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Calculate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowResult(true)}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            🧮 Kira Sekarang!
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="mt-6"
            >
              {/* Summary */}
              <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">📊 Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-100 rounded-2xl p-4 text-center">
                    <p className="text-sm text-green-600 font-medium">Budget</p>
                    <p className="text-2xl font-bold text-green-700">RM{budget}</p>
                  </div>
                  <div className="bg-yellow-100 rounded-2xl p-4 text-center">
                    <p className="text-sm text-yellow-600 font-medium">Dibayar</p>
                    <p className="text-2xl font-bold text-yellow-700">RM{distributed.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 bg-gray-100 rounded-2xl p-4 text-center">
                  <p className="text-sm text-gray-500">Baki</p>
                  <p className={`text-3xl font-bold ${budget - distributed >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    RM{(budget - distributed).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Verdict */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`rounded-3xl p-8 text-center shadow-2xl ${
                  verdict.type === "bakhil" ? "bg-red-500" :
                  verdict.type === "medium" ? "bg-yellow-500" :
                  verdict.type === "good" ? "bg-green-500" :
                  "bg-gradient-to-r from-yellow-400 to-purple-500"
                }`}
              >
                <h2 className="text-3xl font-bold text-white mb-4">{verdict.title}</h2>
                <p className="text-white text-lg">{verdict.desc}</p>
              </motion.div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setShowResult(false);
                  setBudget(1000);
                  setCategories(initialCategories);
                }}
                className="w-full mt-4 py-3 bg-white/20 text-white font-semibold rounded-2xl hover:bg-white/30 transition"
              >
                🔄 Cuba Lagi
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-8 text-green-100 text-sm">
          <p>Made with ❤️ for Malaysians 🇲🇾</p>
          <p className="mt-1">© 2026 Duit Raya Calculator</p>
        </div>
      </div>
    </div>
  );
}
