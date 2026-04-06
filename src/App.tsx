/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calculator, CreditCard, Info, ArrowRight, HardHat, 
  IndianRupee, Layers, Box, Calendar, Percent, Ruler, 
  Building2, Scale, User, Activity, Clock, ChevronRight,
  Ticket, Hash, Tag, TrendingUp, Banknote, Wallet, 
  BarChart3, ArrowLeftRight, Timer, CalendarRange, 
  GraduationCap, Flame, Dumbbell, Paintbrush, Grid, Home,
  Coins, PiggyBank, FileText, Briefcase, Building, Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface ConstructionResult {
  area: number;
  cement: number;
  sand: number;
  gitti: number;
  steel: number;
  paint: number;
  tiles: number;
  plaster: number;
  cementCost: number;
  sandCost: number;
  gittiCost: number;
  steelCost: number;
  paintCost: number;
  tilesCost: number;
  plasterCost: number;
  totalCost: number;
}

interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
}

interface GSTResult {
  gstAmount: number;
  totalAmount: number;
}

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
}

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

interface DiscountResult {
  finalPrice: number;
  savings: number;
}

interface PercentageResult {
  result: number;
}

type TabType = 'emi' | 'construction' | 'gst' | 'bmi' | 'age' | 'discount' | 'percentage' | 
  'sip' | 'fd' | 'interest' | 'loan' | 'profit' | 'unit' | 'time' | 'date' | 'cgpa' | 
  'bmr' | 'calorie' | 'weight' |
  'homeLoan' | 'carLoan' | 'sbiLoan' | 'hdfcLoan' | 'axisLoan' | 'iciciLoan' |
  'lumpsum' | 'swp' | 'mfReturns' | 'ssy' | 'rd' | 'ppf' | 'epf' | 'incomeTax' | 'xirr' |
  'currency' | 'basic' | 'multiCurrency' | 'crypto';

const tabs: { id: TabType; label: string; icon: any; category: string; description: string }[] = [
  { id: 'emi', label: 'EMI Calculator', icon: CreditCard, category: 'Finance', description: 'Calculate your EMI instantly with our free EMI Calculator. Enter your loan amount, interest rate & tenure.' },
  { id: 'homeLoan', label: 'Home Loan EMI', icon: Home, category: 'Finance', description: 'Calculate Home Loan EMI with interest rates and tenure.' },
  { id: 'carLoan', label: 'Car Loan EMI', icon: Car, category: 'Finance', description: 'Estimate monthly installments for your new car.' },
  { id: 'sbiLoan', label: 'SBI Loan EMI', icon: Building, category: 'Finance', description: 'EMI calculator specifically for SBI loan schemes.' },
  { id: 'hdfcLoan', label: 'HDFC Loan EMI', icon: Building, category: 'Finance', description: 'Calculate HDFC bank loan EMIs easily.' },
  { id: 'axisLoan', label: 'Axis Bank EMI', icon: Building, category: 'Finance', description: 'Axis Bank loan EMI estimation tool.' },
  { id: 'iciciLoan', label: 'ICICI Loan EMI', icon: Building, category: 'Finance', description: 'ICICI Bank loan EMI calculator.' },
  { id: 'sip', label: 'SIP Calculator', icon: TrendingUp, category: 'Finance', description: 'Plan your investments with our SIP Calculator. Know future value of your monthly SIP instantly.' },
  { id: 'lumpsum', label: 'Lumpsum Calculator', icon: Coins, category: 'Finance', description: 'Calculate future value of your one-time investment.' },
  { id: 'swp', label: 'SWP Calculator', icon: TrendingUp, category: 'Finance', description: 'Systematic Withdrawal Plan estimator for regular income.' },
  { id: 'mfReturns', label: 'Mutual Fund Returns', icon: TrendingUp, category: 'Finance', description: 'Estimate returns on your mutual fund investments.' },
  { id: 'ssy', label: 'SSY Calculator', icon: PiggyBank, category: 'Finance', description: 'Sukanya Samriddhi Yojana maturity estimator.' },
  { id: 'fd', label: 'FD Calculator', icon: Banknote, category: 'Finance', description: 'Fixed Deposit, maturity amount.' },
  { id: 'rd', label: 'RD Calculator', icon: PiggyBank, category: 'Finance', description: 'Recurring Deposit maturity calculator.' },
  { id: 'ppf', label: 'PPF Calculator', icon: PiggyBank, category: 'Finance', description: 'Public Provident Fund returns estimator.' },
  { id: 'epf', label: 'EPF Calculator', icon: Briefcase, category: 'Finance', description: 'Employee Provident Fund maturity calculator.' },
  { id: 'incomeTax', label: 'Income Tax', icon: FileText, category: 'Finance', description: 'Estimate your income tax for the current financial year.' },
  { id: 'gst', label: 'GST Calculator', icon: IndianRupee, category: 'Finance', description: 'Goods and Services Tax calculation for businesses.' },
  { id: 'interest', label: 'Interest Calculator', icon: Percent, category: 'Finance', description: 'Simple interest calculation.' },
  { id: 'loan', label: 'Loan Eligibility', icon: Wallet, category: 'Finance', description: 'Loan eligibility based on income.' },
  { id: 'profit', label: 'Profit/Loss', icon: BarChart3, category: 'Finance', description: 'Profit and loss percentage.' },
  { id: 'construction', label: 'Construction Estimator', icon: HardHat, category: 'Construction', description: 'Estimate building costs including paint, tiles, and plaster.' },
  { id: 'bmi', label: 'BMI Calculator', icon: Activity, category: 'Health', description: 'Body Mass Index, health status.' },
  { id: 'bmr', label: 'BMR Calculator', icon: Flame, category: 'Health', description: 'Basal Metabolic Rate.' },
  { id: 'calorie', label: 'Calorie Calculator', icon: Flame, category: 'Health', description: 'Daily calorie requirements.' },
  { id: 'weight', label: 'Ideal Weight', icon: Dumbbell, category: 'Health', description: 'Ideal body weight based on height.' },
  { id: 'age', label: 'Age Calculator', icon: Clock, category: 'General', description: 'Exact age in years, months, days.' },
  { id: 'date', label: 'Date Difference', icon: CalendarRange, category: 'General', description: 'Difference between two dates.' },
  { id: 'time', label: 'Time Calculator', icon: Timer, category: 'General', description: 'Hours and minutes to total minutes.' },
  { id: 'unit', label: 'Unit Converter', icon: ArrowLeftRight, category: 'General', description: 'Feet to meter, length conversion.' },
  { id: 'cgpa', label: 'CGPA Calculator', icon: GraduationCap, category: 'General', description: 'Percentage to CGPA converter.' },
  { id: 'discount', label: 'Discount Calculator', icon: Ticket, category: 'General', description: 'Sales discount, savings, final price.' },
  { id: 'percentage', label: 'Percentage Calculator', icon: Hash, category: 'General', description: 'Percentage of a number, ratio.' },
  { id: 'currency', label: 'Currency Converter', icon: ArrowLeftRight, category: 'General', description: 'Live USD to INR currency converter with real-time rates.' },
  { id: 'multiCurrency', label: 'Multi-Currency', icon: ArrowLeftRight, category: 'General', description: 'Live exchange rates for multiple global currencies.' },
  { id: 'crypto', label: 'Crypto Converter', icon: Coins, category: 'General', description: 'Live cryptocurrency prices in INR (Bitcoin, Ethereum, Dogecoin).' },
  { id: 'basic', label: 'Basic Calculator', icon: Calculator, category: 'General', description: 'Simple addition, subtraction, multiplication, and division.' },
];

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div
      className="transition-transform duration-300 hover:scale-105"
      style={{
        width: '90px',
        height: '90px',
        borderRadius: '22px',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 0 0 2px rgba(56,189,248,0.5), 0 0 18px rgba(0,150,255,1), 0 0 36px rgba(0,100,255,0.7), 0 0 60px rgba(0,60,255,0.4)',
      }}
    >
      <img
        src="/logo.png?v=4"
        alt="Shree Calculator Hub"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        draggable={false}
      />
    </div>
    <div className="flex flex-col items-start" style={{ lineHeight: 1.15 }}>
      <span
        style={{
          fontSize: '11px',
          fontStyle: 'italic',
          letterSpacing: '0.12em',
          fontWeight: 600,
          background: 'linear-gradient(90deg, #94a3b8, #cbd5e1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        SHREE
      </span>
      <span
        style={{
          fontSize: '20px',
          fontWeight: 900,
          letterSpacing: '0.04em',
          background: 'linear-gradient(90deg, #ffffff 0%, #7dd3fc 40%, #38bdf8 70%, #0ea5e9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.9)) drop-shadow(0 0 16px rgba(14,165,233,0.6))',
          textTransform: 'uppercase',
        }}
      >
        Calculator Hub
      </span>
    </div>
  </div>
);

// --- Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl ${className}`}
  >
    {children}
  </motion.div>
);

const SliderGroup = ({ label, value, min, max, step, onChange, unit, icon: Icon, color = "emerald" }: any) => {
  const theme = {
    emerald: {
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      accent: "accent-emerald-500"
    },
    amber: {
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      accent: "accent-amber-500"
    },
    indigo: {
      badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      accent: "accent-indigo-500"
    },
    rose: {
      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      accent: "accent-rose-500"
    },
    sky: {
      badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      accent: "accent-sky-500"
    },
    violet: {
      badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      accent: "accent-violet-500"
    },
    cyan: {
      badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      accent: "accent-cyan-500"
    }
  }[color as 'emerald' | 'amber' | 'indigo' | 'rose' | 'sky' | 'violet' | 'cyan'] || {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    accent: "accent-emerald-500"
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
        <label className="text-xs sm:text-base font-bold text-slate-300 flex items-center gap-2 sm:gap-3 shrink-0">
          {Icon && <Icon size={14} className="text-sky-400 sm:size-[18px]" />}
          {label}
        </label>
        <div className={`${theme.badge} flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border sm:border-2 shadow-lg group focus-within:border-sky-500/50 transition-all w-full sm:w-auto justify-end`}>
          {unit === '₹' && <span className="text-sm sm:text-lg font-black mr-1 opacity-70">₹</span>}
          <input 
            type="number"
            step="any"
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') {
                onChange('0');
              } else {
                onChange(val);
              }
            }}
            onBlur={(e) => {
              if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
                onChange(min.toString());
              }
            }}
            className="bg-transparent border-none outline-none text-sm sm:text-lg font-black w-full sm:w-32 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {unit !== '₹' && <span className="text-[10px] sm:text-sm font-bold ml-1 opacity-70 uppercase tracking-tighter">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-1.5 sm:h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${theme.accent} transition-all hover:h-2 sm:hover:h-3`}
      />
    </div>
  );
};

const Button = ({ onClick, children, className = "" }: any) => (
  <button
    onClick={onClick}
    className={`w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-4 px-6 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 ${className}`}
  >
    {children}
  </button>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('emi');
  const [searchQuery, setSearchQuery] = useState('');

  // Construction State
  const [length, setLength] = useState('15');
  const [width, setWidth] = useState('40');
  const [floors, setFloors] = useState('1');
  const [cementPrice, setCementPrice] = useState('350');
  const [sandPrice, setSandPrice] = useState('1500');
  const [gittiPrice, setGittiPrice] = useState('1400');
  const [steelPrice, setSteelPrice] = useState('60');
  const [paintPrice, setPaintPrice] = useState('250');
  const [tilePrice, setTilePrice] = useState('50');
  const [plasterPrice, setPlasterPrice] = useState('30');
  const [constructionResult, setConstructionResult] = useState<ConstructionResult | null>(null);

  // EMI State
  const [loan, setLoan] = useState('1000000');
  const [rate, setRate] = useState('6.5');
  const [years, setYears] = useState('5');
  const [emiResult, setEmiResult] = useState<EMIResult | null>(null);

  // GST State
  const [gstAmount, setGstAmount] = useState('5000');
  const [gstRate, setGstRate] = useState('18');
  const [gstResult, setGstResult] = useState<GSTResult | null>(null);

  // BMI State
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);

  // Age State
  const [dob, setDob] = useState('');
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);

  // Discount State
  const [price, setPrice] = useState('1000');
  const [discount, setDiscount] = useState('10');
  const [discountResult, setDiscountResult] = useState<DiscountResult | null>(null);

  // Percentage State
  const [number, setNumber] = useState('100');
  const [percent, setPercent] = useState('20');
  const [percentageResult, setPercentageResult] = useState<PercentageResult | null>(null);

  // New Calculators State
  const [sipAmt, setSipAmt] = useState('5000');
  const [sipRate, setSipRate] = useState('12');
  const [sipYears, setSipYears] = useState('10');
  const [sipRes, setSipRes] = useState<number | null>(null);

  const [fdP, setFdP] = useState('100000');
  const [fdR, setFdR] = useState('7');
  const [fdT, setFdT] = useState('5');
  const [fdRes, setFdRes] = useState<number | null>(null);

  const [intP, setIntP] = useState('50000');
  const [intR, setIntR] = useState('10');
  const [intT, setIntT] = useState('2');
  const [intRes, setIntRes] = useState<number | null>(null);

  const [income, setIncome] = useState('50000');
  const [expense, setExpense] = useState('20000');
  const [loanElig, setLoanElig] = useState<number | null>(null);

  const [cp, setCp] = useState('1000');
  const [sp, setSp] = useState('1200');
  const [profitRes, setProfitRes] = useState<number | null>(null);

  const [ft, setFt] = useState('10');
  const [unitRes, setUnitRes] = useState<string | null>(null);

  const [hours, setHours] = useState('2');
  const [minutes, setMinutes] = useState('30');
  const [timeRes, setTimeRes] = useState<number | null>(null);

  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  const [dateRes, setDateRes] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  const [marks, setMarks] = useState('85');
  const [cgpaRes, setCgpaRes] = useState<string | null>(null);

  const [bmrWt, setBmrWt] = useState('70');
  const [bmrHt, setBmrHt] = useState('170');
  const [bmrAge, setBmrAge] = useState('25');
  const [bmrRes, setBmrRes] = useState<number | null>(null);

  const [calWt, setCalWt] = useState('70');
  const [calRes, setCalRes] = useState<number | null>(null);

  const [idealHt, setIdealHt] = useState('170');
  const [idealRes, setIdealRes] = useState<number | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Currency State
  const [usdVal, setUsdVal] = useState('1');
  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [currencyRes, setCurrencyRes] = useState<number | null>(null);
  const [isFetchingRate, setIsFetchingRate] = useState(false);

  // Multi-Currency State
  const [multiAmt, setMultiAmt] = useState('100');
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('INR');
  const [multiRes, setMultiRes] = useState<string | null>(null);
  const [isFetchingMulti, setIsFetchingMulti] = useState(false);
  const [allRates, setAllRates] = useState<Record<string, number>>({});

  // Crypto State
  const [cryptoAmt, setCryptoAmt] = useState('1');
  const [cryptoType, setCryptoType] = useState('bitcoin');
  const [cryptoRes, setCryptoRes] = useState<string | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<any>(null);
  const [lastCryptoUpdate, setLastCryptoUpdate] = useState<number>(0);
  const [isFetchingCrypto, setIsFetchingCrypto] = useState(false);

  const loadRate = async () => {
    const savedRates = localStorage.getItem("all_rates");
    const savedTime = localStorage.getItem("rates_time");

    // 1 hour cache (3600000 ms)
    if (savedRates && savedTime && (Date.now() - parseInt(savedTime) < 3600000)) {
      const rates = JSON.parse(savedRates);
      setAllRates(rates);
      if (rates.INR) setLiveRate(rates.INR);
      return rates;
    }

    setIsFetchingRate(true);
    setIsFetchingMulti(true);
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await res.json();
      const rates = data.rates;
      setAllRates(rates);
      if (rates.INR) setLiveRate(rates.INR);
      localStorage.setItem("all_rates", JSON.stringify(rates));
      localStorage.setItem("rates_time", Date.now().toString());
      return rates;
    } catch (err) {
      console.error("Error fetching live rates", err);
      if (savedRates) {
        const rates = JSON.parse(savedRates);
        setAllRates(rates);
        return rates;
      }
    } finally {
      setIsFetchingRate(false);
      setIsFetchingMulti(false);
    }
    return null;
  };

  const convertCurrency = async () => {
    const rates = await loadRate();
    if (rates && rates.INR) {
      setCurrencyRes(parseFloat(usdVal) * rates.INR);
    }
  };

  const convertMultiCurrency = async () => {
    const rates = await loadRate();
    if (rates && rates[fromCurr] && rates[toCurr]) {
      const usd = parseFloat(multiAmt) / rates[fromCurr];
      const result = (usd * rates[toCurr]).toFixed(2);
      setMultiRes(result);
    }
  };

  // Auto-calculate multi-currency when inputs change
  useEffect(() => {
    if (allRates[fromCurr] && allRates[toCurr] && multiAmt) {
      const usd = parseFloat(multiAmt) / allRates[fromCurr];
      const result = (usd * allRates[toCurr]).toFixed(2);
      setMultiRes(result);
    }
  }, [multiAmt, fromCurr, toCurr, allRates]);

  const loadCryptoPrices = async () => {
    // 1. Try Cache first (Instant)
    const cache = localStorage.getItem("crypto_prices");
    const time = localStorage.getItem("crypto_time");

    const fallbackPrices = {
      bitcoin: { inr: 5000000 },
      ethereum: { inr: 300000 },
      dogecoin: { inr: 10 }
    };

    if (cache && time) {
      const prices = JSON.parse(cache);
      setCryptoPrices(prices);
      setLastCryptoUpdate(parseInt(time));
      
      // If cache is fresh (5 min), don't fetch
      if (Date.now() - parseInt(time) < 300000) {
        return prices;
      }
    } else {
      // No cache? Use fallbacks for instant show
      setCryptoPrices(fallbackPrices);
    }

    // 2. Background Update (Non-blocking)
    setIsFetchingCrypto(true);
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=inr");
      const data = await res.json();
      setCryptoPrices(data);
      setLastCryptoUpdate(Date.now());
      localStorage.setItem("crypto_prices", JSON.stringify(data));
      localStorage.setItem("crypto_time", Date.now().toString());
      return data;
    } catch (e) {
      console.error("Error fetching crypto prices", e);
      // If fetch fails and we have no cache, keep fallbacks
      if (!cryptoPrices) setCryptoPrices(fallbackPrices);
    } finally {
      setIsFetchingCrypto(false);
    }
    return null;
  };

  const refreshCryptoPrices = async () => {
    // Force a fresh fetch
    setIsFetchingCrypto(true);
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=inr");
      const data = await res.json();
      setCryptoPrices(data);
      setLastCryptoUpdate(Date.now());
      localStorage.setItem("crypto_prices", JSON.stringify(data));
      localStorage.setItem("crypto_time", Date.now().toString());
    } catch (e) {
      console.error("Error refreshing crypto prices", e);
    } finally {
      setIsFetchingCrypto(false);
    }
  };

  // Auto-calculate crypto when inputs change
  useEffect(() => {
    if (cryptoPrices && cryptoPrices[cryptoType]) {
      const rate = cryptoPrices[cryptoType].inr;
      const total = (parseFloat(cryptoAmt) || 0) * rate;
      setCryptoRes(total.toFixed(2));
    }
  }, [cryptoAmt, cryptoType, cryptoPrices]);

  // Initial load of crypto prices
  useEffect(() => {
    loadCryptoPrices();
  }, []);

  // Auto-calculate currency when rate or value changes
  useEffect(() => {
    if (liveRate && usdVal) {
      setCurrencyRes(parseFloat(usdVal) * liveRate);
    }
  }, [usdVal, liveRate]);

  // Basic Calculator State
  const [bNum1, setBNum1] = useState('');
  const [bNum2, setBNum2] = useState('');
  const [basicRes, setBasicRes] = useState<number | string | null>(null);

  const calculateBasic = (op: 'add' | 'sub' | 'mul' | 'div') => {
    const n1 = parseFloat(bNum1);
    const n2 = parseFloat(bNum2);
    if (isNaN(n1) || isNaN(n2)) {
      setBasicRes('❌ Enter valid numbers');
      return;
    }

    switch (op) {
      case 'add': setBasicRes(`➕ Result: ${n1 + n2}`); break;
      case 'sub': setBasicRes(`➖ Result: ${n1 - n2}`); break;
      case 'mul': setBasicRes(`✖ Result: ${n1 * n2}`); break;
      case 'div': 
        if (n2 === 0) {
          setBasicRes('❌ Cannot divide by 0');
        } else {
          setBasicRes(`➗ Result: ${(n1 / n2).toFixed(2)}`);
        }
        break;
    }
  };

  const resetConstruction = () => {
    setLength('15');
    setWidth('40');
    setFloors('1');
    setCementPrice('350');
    setSandPrice('1500');
    setGittiPrice('1400');
    setSteelPrice('60');
    setPaintPrice('250');
    setTilePrice('50');
    setPlasterPrice('30');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareResult = (type: TabType, data: any) => {
    const params = new URLSearchParams(data).toString();
    const url = `${window.location.origin}${window.location.pathname}?${params}#${type}`;
    const shareText = `Check this result on Shree Calculator Hub! 🔥\n${url}`;

    if (navigator.share) {
      navigator.share({
        title: "Shree Calculator Hub 🔥",
        text: "Check this result on Shree Calculator Hub!",
        url: url
      }).catch(console.error);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  // Handle query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '') as TabType;

    if (params.toString() !== "") {
      if (params.get('dob')) setDob(params.get('dob')!);
      if (params.get('loan')) setLoan(params.get('loan')!);
      if (params.get('rate')) setRate(params.get('rate')!);
      if (params.get('years')) setYears(params.get('years')!);
      if (params.get('usd')) setUsdVal(params.get('usd')!);
      if (params.get('amt')) setMultiAmt(params.get('amt')!);
      if (params.get('from')) setFromCurr(params.get('from')!);
      if (params.get('to')) setToCurr(params.get('to')!);
      if (params.get('cryptoAmt')) setCryptoAmt(params.get('cryptoAmt')!);
      if (params.get('cryptoType')) setCryptoType(params.get('cryptoType')!);
      if (params.get('d1')) setD1(params.get('d1')!);
      if (params.get('d2')) setD2(params.get('d2')!);
      
      if (hash && tabs.some(t => t.id === hash)) {
        setActiveTab(hash);
      } else if (params.get('dob')) {
        setActiveTab('age');
      } else if (params.get('usd')) {
        setActiveTab('currency');
      } else if (params.get('loan')) {
        setActiveTab('emi');
      } else if (params.get('amt')) {
        setActiveTab('multiCurrency');
      } else if (params.get('cryptoAmt')) {
        setActiveTab('crypto');
      } else if (params.get('d1')) {
        setActiveTab('date');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    loadRate();
  }, []);

  // Lumpsum State
  const [lumpAmt, setLumpAmt] = useState('100000');
  const [lumpRate, setLumpRate] = useState('12');
  const [lumpYears, setLumpYears] = useState('10');
  const [lumpRes, setLumpRes] = useState<number | null>(null);

  // SWP State
  const [swpAmt, setSwpAmt] = useState('1000000');
  const [swpWithdrawal, setSwpWithdrawal] = useState('10000');
  const [swpRate, setSwpRate] = useState('8');
  const [swpYears, setSwpYears] = useState('10');
  const [swpRes, setSwpRes] = useState<number | null>(null);

  // RD State
  const [rdAmt, setRdAmt] = useState('5000');
  const [rdRate, setRdRate] = useState('7');
  const [rdYears, setRdYears] = useState('5');
  const [rdRes, setRdRes] = useState<number | null>(null);

  // PPF State
  const [ppfAmt, setPpfAmt] = useState('150000');
  const [ppfYears, setPpfYears] = useState('15');
  const [ppfRes, setPpfRes] = useState<number | null>(null);

  // Income Tax State
  const [taxIncome, setTaxIncome] = useState('1000000');
  const [taxDeductions, setTaxDeductions] = useState('150000');
  const [taxRes, setTaxRes] = useState<number | null>(null);

  // EPF State
  const [epfBasic, setEpfBasic] = useState('20000');
  const [epfAge, setEpfAge] = useState('25');
  const [epfRes, setEpfRes] = useState<number | null>(null);

  // SSY State
  const [ssyAmt, setSsyAmt] = useState('50000');
  const [ssyAge, setSsyAge] = useState('5');
  const [ssyRes, setSsyRes] = useState<number | null>(null);

  // Construction Calculation
  useEffect(() => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const f = parseFloat(floors);
    const cp = parseFloat(cementPrice);
    const sp = parseFloat(sandPrice);
    const gp = parseFloat(gittiPrice);
    const stp = parseFloat(steelPrice);
    const ptp = parseFloat(paintPrice);
    const tlp = parseFloat(tilePrice);
    const plp = parseFloat(plasterPrice);

    if (isNaN(l) || isNaN(w) || isNaN(f)) return;
    
    const area = l * w * f;
    const cement = Math.round(area / 2.5);
    const sand = area / 20;
    const gitti = area / 25;
    const steel = area * 3;
    const paint = area / 6;
    const tiles = area * 1.1;
    const plaster = area * 0.2;

    const cementCost = cement * (isNaN(cp) ? 350 : cp);
    const sandCost = sand * (isNaN(sp) ? 1500 : sp);
    const gittiCost = gitti * (isNaN(gp) ? 1400 : gp);
    const steelCost = steel * (isNaN(stp) ? 60 : stp);
    const paintCost = paint * (isNaN(ptp) ? 250 : ptp);
    const tilesCost = tiles * (isNaN(tlp) ? 50 : tlp);
    const plasterCost = plaster * (isNaN(plp) ? 30 : plp);

    const totalCost = cementCost + sandCost + gittiCost + steelCost + paintCost + tilesCost + plasterCost;
    
    setConstructionResult({ 
      area, cement, sand, gitti, steel, paint, tiles, plaster,
      cementCost, sandCost, gittiCost, steelCost, paintCost, tilesCost, plasterCost, totalCost 
    });
  }, [length, width, floors, cementPrice, sandPrice, gittiPrice, steelPrice, paintPrice, tilePrice, plasterPrice]);

  // EMI Calculation
  useEffect(() => {
    const P = parseFloat(loan);
    const r = parseFloat(rate) / 12 / 100;
    const N = parseFloat(years) * 12;
    if (isNaN(P) || isNaN(r) || isNaN(N) || N === 0) return;
    const EMI = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    const totalPayment = EMI * N;
    const totalInterest = totalPayment - P;
    setEmiResult({ monthlyEMI: EMI, totalInterest, totalPayment, principal: P });
  }, [loan, rate, years]);

  // GST Calculation
  useEffect(() => {
    const amt = parseFloat(gstAmount);
    const rt = parseFloat(gstRate);
    if (isNaN(amt) || isNaN(rt)) return;
    const gst = (amt * rt) / 100;
    setGstResult({ gstAmount: gst, totalAmount: amt + gst });
  }, [gstAmount, gstRate]);

  // BMI Calculation
  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (isNaN(w) || isNaN(h) || h === 0) return;
    const bmi = w / (h * h);
    let category = "Normal";
    let color = "text-emerald-400";
    if (bmi < 18.5) { category = "Underweight"; color = "text-sky-400"; }
    else if (bmi >= 25 && bmi < 30) { category = "Overweight"; color = "text-amber-400"; }
    else if (bmi >= 30) { category = "Obese"; color = "text-rose-400"; }
    setBmiResult({ bmi, category, color });
  }, [weight, height]);

  // Age Calculation
  useEffect(() => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    setAgeResult({ years, months, days });
  }, [dob]);

  // Discount Calculation
  useEffect(() => {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (isNaN(p) || isNaN(d)) return;
    const savings = (p * d) / 100;
    setDiscountResult({ finalPrice: p - savings, savings });
  }, [price, discount]);

  // Percentage Calculation
  useEffect(() => {
    const n = parseFloat(number);
    const p = parseFloat(percent);
    if (isNaN(n) || isNaN(p)) return;
    setPercentageResult({ result: (n * p) / 100 });
  }, [number, percent]);

  // SIP Calculation
  useEffect(() => {
    const m = parseFloat(sipAmt), r = parseFloat(sipRate) / 100 / 12, n = parseFloat(sipYears) * 12;
    if (isNaN(m) || isNaN(r) || isNaN(n) || r === 0) return;
    const fv = m * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    setSipRes(fv);
  }, [sipAmt, sipRate, sipYears]);

  // FD Calculation
  useEffect(() => {
    const p = parseFloat(fdP), r = parseFloat(fdR) / 100, t = parseFloat(fdT);
    if (isNaN(p) || isNaN(r) || isNaN(t)) return;
    const a = p * Math.pow((1 + r), t);
    setFdRes(a);
  }, [fdP, fdR, fdT]);

  // Interest Calculation
  useEffect(() => {
    const p = parseFloat(intP), r = parseFloat(intR), t = parseFloat(intT);
    if (isNaN(p) || isNaN(r) || isNaN(t)) return;
    setIntRes((p * r * t) / 100);
  }, [intP, intR, intT]);

  // Loan Eligibility
  useEffect(() => {
    const i = parseFloat(income), e = parseFloat(expense);
    if (isNaN(i) || isNaN(e)) return;
    setLoanElig((i - e) * 60);
  }, [income, expense]);

  // Profit/Loss
  useEffect(() => {
    const c = parseFloat(cp), s = parseFloat(sp);
    if (isNaN(c) || isNaN(s)) return;
    setProfitRes(s - c);
  }, [cp, sp]);

  // Unit Converter
  useEffect(() => {
    const f = parseFloat(ft);
    if (isNaN(f)) return;
    setUnitRes((f * 0.3048).toFixed(4));
  }, [ft]);

  // Time Converter
  useEffect(() => {
    const h = parseFloat(hours), m = parseFloat(minutes);
    if (isNaN(h) || isNaN(m)) return;
    setTimeRes(h * 60 + m);
  }, [hours, minutes]);

  // Date Difference
  useEffect(() => {
    if (!d1 || !d2) return;
    let start = new Date(d1);
    let end = new Date(d2);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    if (end < start) {
      [start, end] = [end, start];
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDateRes({ years, months, days, totalDays });
  }, [d1, d2]);

  // CGPA
  useEffect(() => {
    const m = parseFloat(marks);
    if (isNaN(m)) return;
    setCgpaRes((m / 9.5).toFixed(2));
  }, [marks]);

  // BMR
  useEffect(() => {
    const w = parseFloat(bmrWt), h = parseFloat(bmrHt), a = parseFloat(bmrAge);
    if (isNaN(w) || isNaN(h) || isNaN(a)) return;
    setBmrRes(10 * w + 6.25 * h - 5 * a + 5);
  }, [bmrWt, bmrHt, bmrAge]);

  // Calories
  useEffect(() => {
    const w = parseFloat(calWt);
    if (isNaN(w)) return;
    setCalRes(w * 30);
  }, [calWt]);

  // Ideal Weight
  useEffect(() => {
    const h = parseFloat(idealHt);
    if (isNaN(h)) return;
    setIdealRes(h - 100);
  }, [idealHt]);

  // Lumpsum Calculation
  useEffect(() => {
    const p = parseFloat(lumpAmt), r = parseFloat(lumpRate) / 100, t = parseFloat(lumpYears);
    if (isNaN(p) || isNaN(r) || isNaN(t)) return;
    setLumpRes(p * Math.pow(1 + r, t));
  }, [lumpAmt, lumpRate, lumpYears]);

  // SWP Calculation
  useEffect(() => {
    const p = parseFloat(swpAmt), w = parseFloat(swpWithdrawal), r = parseFloat(swpRate) / 100 / 12, n = parseFloat(swpYears) * 12;
    if (isNaN(p) || isNaN(w) || isNaN(r) || isNaN(n)) return;
    // Simplified SWP calculation
    let balance = p;
    for (let i = 0; i < n; i++) {
      balance = balance * (1 + r) - w;
      if (balance < 0) { balance = 0; break; }
    }
    setSwpRes(balance);
  }, [swpAmt, swpWithdrawal, swpRate, swpYears]);

  // RD Calculation
  useEffect(() => {
    const p = parseFloat(rdAmt), r = parseFloat(rdRate) / 100 / 4, t = parseFloat(rdYears) * 4;
    if (isNaN(p) || isNaN(r) || isNaN(t)) return;
    // RD maturity formula: M = R * [(1+i)^n - 1] / (1 - (1+i)^-1/3)
    // Simplified:
    const n = parseFloat(rdYears) * 12;
    const i = parseFloat(rdRate) / 100 / 12;
    const m = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    setRdRes(m);
  }, [rdAmt, rdRate, rdYears]);

  // PPF Calculation
  useEffect(() => {
    const p = parseFloat(ppfAmt), t = parseFloat(ppfYears), r = 0.071; // Current PPF rate
    if (isNaN(p) || isNaN(t)) return;
    let balance = 0;
    for (let i = 0; i < t; i++) {
      balance = (balance + p) * (1 + r);
    }
    setPpfRes(balance);
  }, [ppfAmt, ppfYears]);

  // Income Tax Calculation (Simplified)
  useEffect(() => {
    const income = parseFloat(taxIncome), deductions = parseFloat(taxDeductions);
    if (isNaN(income) || isNaN(deductions)) return;
    const taxable = Math.max(0, income - deductions);
    let tax = 0;
    if (taxable > 1500000) tax += (taxable - 1500000) * 0.3 + 150000;
    else if (taxable > 1200000) tax += (taxable - 1200000) * 0.2 + 90000;
    else if (taxable > 900000) tax += (taxable - 900000) * 0.15 + 45000;
    else if (taxable > 600000) tax += (taxable - 600000) * 0.1 + 15000;
    else if (taxable > 300000) tax += (taxable - 300000) * 0.05;
    setTaxRes(tax);
  }, [taxIncome, taxDeductions]);

  // EPF Calculation
  useEffect(() => {
    const basic = parseFloat(epfBasic), age = parseFloat(epfAge);
    if (isNaN(basic) || isNaN(age)) return;
    const years = 58 - age;
    const monthlyContribution = basic * 0.12;
    const rate = 0.0815;
    let balance = 0;
    for (let i = 0; i < years * 12; i++) {
      balance = (balance + monthlyContribution * 2) * (1 + rate / 12);
    }
    setEpfRes(balance);
  }, [epfBasic, epfAge]);

  // SSY Calculation
  useEffect(() => {
    const amt = parseFloat(ssyAmt), age = parseFloat(ssyAge);
    if (isNaN(amt) || isNaN(age)) return;
    const years = 21 - age; // scheme matures when girl turns 21
    const rate = 0.082;
    const contributionYears = Math.min(15, years); // max 15 years OR until maturity
    let balance = 0;
    for (let i = 0; i < contributionYears; i++) {
      balance = (balance + amt) * (1 + rate);
    }
    // Compounding for remaining years after contribution stops
    for (let i = 0; i < (years - contributionYears); i++) {
      balance = balance * (1 + rate);
    }
    setSsyRes(balance);
  }, [ssyAmt, ssyAge]);

  const filteredTabs = tabs.filter(tab => 
    tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-sky-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => { setActiveTab('emi'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <Logo />
          </div>
          
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search 23+ calculators..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => copyToClipboard(window.location.href)}
              className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800/50 rounded-xl transition-all"
              title="Share App"
            >
              <TrendingUp size={20} />
            </button>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-slate-800 text-sky-400' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Mobile Menu */}
        <div className="md:hidden flex overflow-x-auto no-scrollbar border-t border-slate-800 bg-slate-900/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-none px-6 py-4 text-sm font-medium transition-all flex items-center gap-2 border-b-2 ${
                activeTab === tab.id 
                  ? 'border-sky-500 text-sky-400 bg-sky-500/5' 
                  : 'border-transparent text-slate-400'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Search Results Overlay when searching */}
        {searchQuery && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-slate-900/80 backdrop-blur-xl border-2 border-sky-500/30 rounded-[2.5rem] shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <BarChart3 className="text-sky-500" />
                Search Results ({filteredTabs.length})
              </h2>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
              >
                Close Search
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTabs.slice(0, 6).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-4 p-3 bg-slate-800/50 hover:bg-sky-500/10 border border-slate-700 hover:border-sky-500/30 rounded-2xl transition-all group"
                >
                  <div className="p-2 bg-slate-700 rounded-xl group-hover:bg-sky-500 group-hover:text-slate-950 transition-colors">
                    <tab.icon size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white group-hover:text-sky-400">{tab.label}</p>
                    <p className="text-[10px] text-slate-500">{tab.category}</p>
                  </div>
                </button>
              ))}
            </div>
            {filteredTabs.length > 6 && (
              <p className="text-center text-[10px] text-slate-600 mt-4 font-bold uppercase tracking-widest">
                Scroll down to Tools Directory for more results
              </p>
            )}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="mb-16"
          >
            {activeTab === 'currency' && (
              <Card className="flex flex-col border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] mobile-section">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl">
                    <ArrowLeftRight className="text-emerald-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Currency Converter</h3>
                    <p className="text-slate-400 text-sm">Live USD to INR instantly.</p>
                  </div>
                </div>
                <div className="space-y-8 flex-1">
                  {currencyRes !== null && (
                    <div className="mt-4 p-4 sm:p-6 bg-emerald-500/5 rounded-2xl sm:rounded-3xl border border-emerald-500/20 space-y-2 sm:space-y-4 sticky-result">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium text-xs sm:text-base">Live Rate</span>
                        <span className="text-sm sm:text-xl font-bold text-emerald-400">₹{liveRate?.toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-slate-800" />
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium text-xs sm:text-base">Converted</span>
                        <span className="text-xl sm:text-3xl font-black text-white">₹{currencyRes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <IndianRupee size={14} /> Enter USD ($)
                    </label>
                    <input
                      type="number"
                      value={usdVal}
                      onChange={(e) => setUsdVal(e.target.value)}
                      placeholder="Enter USD ($)"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  
                  <Button 
                    onClick={convertCurrency}
                    disabled={isFetchingRate}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  >
                    {isFetchingRate ? 'Fetching Rate...' : 'Convert Live'} <ArrowRight size={18} />
                  </Button>

                  {currencyRes !== null && (
                    <button 
                      onClick={() => shareResult('currency', { usd: usdVal })}
                      className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-white font-black text-xs rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <ArrowLeftRight size={14} /> Share Result
                    </button>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'multiCurrency' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl">
                    <ArrowLeftRight className="text-emerald-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Multi-Currency Converter</h3>
                    <p className="text-slate-400 text-sm">Live exchange rates for multiple currencies.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Amount</label>
                    <input
                      type="number"
                      value={multiAmt}
                      onChange={(e) => setMultiAmt(e.target.value)}
                      placeholder="Enter Amount"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">From</label>
                      <select
                        value={fromCurr}
                        onChange={(e) => setFromCurr(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      >
                        <option value="USD">USD</option>
                        <option value="INR">INR</option>
                        <option value="EUR">EUR</option>
                        <option value="AED">AED</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">To</label>
                      <select
                        value={toCurr}
                        onChange={(e) => setToCurr(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="AED">AED</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  <Button 
                    onClick={convertMultiCurrency}
                    disabled={isFetchingMulti}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  >
                    {isFetchingMulti ? 'Fetching Rate...' : 'Convert Live'} <ArrowRight size={18} />
                  </Button>

                  {multiRes !== null && (
                    <div className="mt-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Result</span>
                        <span className="text-2xl font-black text-white">
                          {multiAmt} {fromCurr} = {multiRes} {toCurr}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          Rate: 1 {fromCurr} = {(allRates[toCurr] / allRates[fromCurr]).toFixed(4)} {toCurr}
                        </p>
                      </div>
                      <button 
                        onClick={() => shareResult('multiCurrency', { amt: multiAmt, from: fromCurr, to: toCurr })}
                        className="w-full py-3 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-white font-black text-xs rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <ArrowLeftRight size={14} /> Share Result
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'crypto' && (
              <Card className="flex flex-col mobile-section">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-amber-500/10 p-3 rounded-2xl">
                    <Coins className="text-amber-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Crypto Converter</h3>
                    <p className="text-slate-400 text-sm">Live cryptocurrency prices in INR (Ultra Fast).</p>
                  </div>
                </div>
                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Amount</label>
                    <input
                      type="number"
                      value={cryptoAmt}
                      onChange={(e) => setCryptoAmt(e.target.value)}
                      placeholder="Enter Amount"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Crypto Type</label>
                    <select
                      value={cryptoType}
                      onChange={(e) => setCryptoType(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    >
                      <option value="bitcoin">Bitcoin (BTC)</option>
                      <option value="ethereum">Ethereum (ETH)</option>
                      <option value="dogecoin">Dogecoin (DOGE)</option>
                    </select>
                  </div>
                  
                  {cryptoRes !== null && cryptoPrices && cryptoPrices[cryptoType] && (
                    <div className="mt-4 p-6 bg-amber-500/5 rounded-3xl border border-amber-500/20 space-y-4 sticky-result">
                      <div className="text-center">
                        <span className="text-slate-400 font-medium block mb-2">Converted Value</span>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-lg font-bold text-amber-500/50">₹</span>
                          <span className="text-4xl font-black text-white">
                            {parseFloat(cryptoRes).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4">
                          1 {cryptoType.toUpperCase()} = ₹{cryptoPrices[cryptoType].inr.toLocaleString()}
                        </p>
                      </div>
                      <button 
                        onClick={() => shareResult('crypto', { cryptoAmt, cryptoType })}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm rounded-2xl shadow-[0_10px_20px_-5px_rgba(245,158,11,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <ArrowLeftRight size={18} /> Share Result
                      </button>
                    </div>
                  )}
                  
                  <Button 
                    onClick={refreshCryptoPrices}
                    disabled={isFetchingCrypto}
                    className="w-full py-6 bg-slate-800 hover:bg-slate-700 text-amber-500 font-bold rounded-2xl border border-slate-700"
                  >
                    {isFetchingCrypto ? 'Updating...' : 'Refresh Prices'} <ArrowRight size={18} />
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'basic' && (
              <Card className="flex flex-col mobile-section">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-sky-500/10 p-3 rounded-2xl">
                    <Calculator className="text-sky-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Basic Calculator</h3>
                    <p className="text-slate-400 text-sm">Simple arithmetic operations.</p>
                  </div>
                </div>
                <div className="space-y-6 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">First Number</label>
                      <input
                        type="number"
                        value={bNum1}
                        onChange={(e) => setBNum1(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Second Number</label>
                      <input
                        type="number"
                        value={bNum2}
                        onChange={(e) => setBNum2(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => calculateBasic('add')} className="py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                      ➕ Add
                    </button>
                    <button onClick={() => calculateBasic('sub')} className="py-4 bg-rose-500 hover:bg-rose-400 text-white font-black rounded-2xl shadow-lg shadow-rose-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                      ➖ Subtract
                    </button>
                    <button onClick={() => calculateBasic('mul')} className="py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-sky-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                      ✖ Multiply
                    </button>
                    <button onClick={() => calculateBasic('div')} className="py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                      ➗ Divide
                    </button>
                  </div>

                  {basicRes !== null && (
                    <div className="mt-4 p-6 bg-sky-500/5 rounded-3xl border border-sky-500/20 text-center sticky-result">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Result</p>
                      <p className="text-xl font-black text-white drop-shadow-[0_0_10px_rgba(14,165,233,0.3)]">
                        {basicRes}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {['emi', 'homeLoan', 'carLoan', 'sbiLoan', 'hdfcLoan', 'axisLoan', 'iciciLoan'].includes(activeTab) && (
              <Card className="flex flex-col border-sky-500/20 shadow-[0_0_30px_rgba(14,165,233,0.1)] mobile-section">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-sky-500/10 p-3 rounded-2xl">
                    {activeTab === 'carLoan' ? <Car className="text-sky-500" size={28} /> : 
                     activeTab === 'homeLoan' ? <Home className="text-sky-500" size={28} /> :
                     <CreditCard className="text-sky-500" size={28} />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {tabs.find(t => t.id === activeTab)?.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-10">
                  <SliderGroup label="Loan Amount" value={loan} min="10000" max="10000000" step="10000" onChange={setLoan} unit="₹" icon={IndianRupee} color="cyan" />
                  <SliderGroup label="Interest Rate (p.a)" value={rate} min="1" max="25" step="0.1" onChange={setRate} unit="%" icon={Percent} color="emerald" />
                  <SliderGroup label="Loan Tenure" value={years} min="1" max="30" step="1" onChange={setYears} unit="Yr" icon={Calendar} color="sky" />
                  {emiResult && (
                    <div className="mt-4 p-4 sm:p-8 bg-slate-900/80 rounded-2xl sm:rounded-[2.5rem] border-2 border-sky-500/30 space-y-4 sm:space-y-8 shadow-[0_0_50px_-12px_rgba(14,165,233,0.2)] sticky-result">
                      <div className="flex flex-col lg:flex-row gap-4 sm:gap-10 items-center">
                        <div className="flex-1 space-y-4 sm:space-y-8 w-full">
                          <div className="text-center lg:text-left space-y-1 sm:space-y-2">
                            <span className="text-cyan-400 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">Monthly EMI</span>
                            <div className="flex items-baseline justify-center lg:justify-start gap-2">
                              <span className="text-lg sm:text-2xl font-bold text-cyan-500/50">₹</span>
                              <span className="text-3xl sm:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                                {Math.round(emiResult.monthlyEMI).toLocaleString()}
                              </span>
                              <button 
                                onClick={() => copyToClipboard(`Monthly EMI: ₹${Math.round(emiResult.monthlyEMI).toLocaleString()}`)}
                                className="ml-2 sm:ml-4 p-1.5 sm:p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-cyan-400 transition-colors"
                                title="Copy Result"
                              >
                                <FileText size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 sm:gap-4">
                            <div className="p-2 sm:p-4 bg-slate-800/40 rounded-xl sm:rounded-2xl border border-slate-700/50">
                              <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Principal</span>
                              <span className="text-xs sm:text-lg font-bold text-white">₹{emiResult.principal.toLocaleString()}</span>
                            </div>
                            <div className="p-2 sm:p-4 bg-slate-800/40 rounded-xl sm:rounded-2xl border border-slate-700/50">
                              <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Interest</span>
                              <span className="text-xs sm:text-lg font-bold text-cyan-400">₹{Math.round(emiResult.totalInterest).toLocaleString()}</span>
                            </div>
                            <div className="p-2 sm:p-4 bg-cyan-500/10 rounded-xl sm:rounded-2xl border border-cyan-500/20">
                              <span className="text-[8px] sm:text-[10px] font-bold text-cyan-500/70 uppercase tracking-widest block mb-1">Total</span>
                              <span className="text-xs sm:text-lg font-black text-cyan-400">₹{Math.round(emiResult.totalPayment).toLocaleString()}</span>
                            </div>
                          </div>

                          {emiResult && (() => {
                            const total = emiResult.principal + emiResult.totalInterest;
                            const principalPct = Math.round((emiResult.principal / total) * 100);
                            const interestPct = 100 - principalPct;
                            return (
                              <div className="w-full space-y-2">
                                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                                  <span>Principal vs Interest</span>
                                </div>
                                <div className="flex h-3 rounded-full overflow-hidden">
                                  <div className="bg-sky-400 transition-all duration-500" style={{ width: `${principalPct}%` }} />
                                  <div className="bg-emerald-500 flex-1" />
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400">
                                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span>Principal {principalPct}%</span>
                                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>Interest {interestPct}%</span>
                                </div>
                              </div>
                            );
                          })()}

                          <div className="flex flex-row items-center justify-between sm:justify-start gap-4">
                            <button 
                              onClick={() => setShowSchedule(!showSchedule)}
                              className="text-[10px] sm:text-xs font-bold text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors"
                            >
                              {showSchedule ? 'Hide' : 'Show'} Schedule
                              <ChevronRight size={12} className={showSchedule ? 'rotate-90' : ''} />
                            </button>
                            <button 
                              onClick={() => shareResult(activeTab, { loan, rate, years })}
                              className="px-3 py-1.5 bg-gradient-to-r from-sky-400 to-blue-500 text-white font-black text-[8px] sm:text-[10px] rounded-lg shadow-[0_0_10px_rgba(14,165,233,0.3)] flex items-center gap-1 uppercase tracking-widest"
                            >
                              <ArrowLeftRight size={10} /> Share
                            </button>
                          </div>

                  {emiResult && showSchedule && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="overflow-hidden bg-slate-950/50 rounded-xl border border-slate-800"
                    >
                      <div className="max-h-40 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-[8px] sm:text-[10px] text-left">
                          <thead className="sticky top-0 bg-slate-900 text-slate-500 uppercase tracking-tighter">
                            <tr>
                              <th className="p-2">Month</th>
                              <th className="p-2">Principal</th>
                              <th className="p-2">Interest</th>
                              <th className="p-2">Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {Array.from({ length: Math.min(parseInt(years) * 12, 60) }).map((_, i) => {
                              const P = parseFloat(loan);
                              const r = parseFloat(rate) / 12 / 100;
                              const EMI = emiResult.monthlyEMI;
                              let balance = P;
                              let interest = 0;
                              let principal = 0;
                              for (let j = 0; j <= i; j++) {
                                interest = balance * r;
                                principal = EMI - interest;
                                balance -= principal;
                              }
                              return (
                                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                  <td className="p-2 text-slate-400">{i + 1}</td>
                                  <td className="p-2 text-white font-bold">₹{Math.round(principal).toLocaleString()}</td>
                                  <td className="p-2 text-sky-400">₹{Math.round(interest).toLocaleString()}</td>
                                  <td className="p-2 text-slate-500 font-mono">₹{Math.max(0, Math.round(balance)).toLocaleString()}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                        </div>
                      </div>
                    </div>
                  )}
                  <Button className="w-full py-6 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98] group">
                    Check Loan Limit 
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'construction' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-amber-500/10 p-3 rounded-2xl">
                    <HardHat className="text-amber-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Construction Estimator</h3>
                    <p className="text-slate-400 text-sm">Estimate building costs and materials with our Construction Estimator tool.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Dimensions</h4>
                      <SliderGroup label="Length" value={length} min="10" max="100" step="1" onChange={setLength} unit="ft" icon={Ruler} color="amber" />
                      <SliderGroup label="Width" value={width} min="10" max="100" step="1" onChange={setWidth} unit="ft" icon={Ruler} color="amber" />
                      <SliderGroup label="Floors" value={floors} min="1" max="5" step="1" onChange={setFloors} unit="" icon={Building2} color="amber" />
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-base font-black text-white uppercase tracking-[0.2em] border-b border-slate-800 pb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Material Prices (₹)</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-300">Cement / bag</label>
                          <input type="number" value={cementPrice} onChange={(e) => setCementPrice(e.target.value)} className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white text-lg font-black focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-300">Sand / m³</label>
                          <input type="number" value={sandPrice} onChange={(e) => setSandPrice(e.target.value)} className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white text-lg font-black focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-300">Gitti / m³</label>
                          <input type="number" value={gittiPrice} onChange={(e) => setGittiPrice(e.target.value)} className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white text-lg font-black focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-300">Steel / kg</label>
                          <input type="number" value={steelPrice} onChange={(e) => setSteelPrice(e.target.value)} className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white text-lg font-black focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-300">Paint / L</label>
                          <input type="number" value={paintPrice} onChange={(e) => setPaintPrice(e.target.value)} className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white text-lg font-black focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-300">Tiles / sq ft</label>
                          <input type="number" value={tilePrice} onChange={(e) => setTilePrice(e.target.value)} className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white text-lg font-black focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-300">Plaster / sq ft</label>
                          <input type="number" value={plasterPrice} onChange={(e) => setPlasterPrice(e.target.value)} className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white text-lg font-black focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {constructionResult && (
                      <div className="p-8 bg-slate-900/80 rounded-[2.5rem] border-2 border-amber-500/30 space-y-8 shadow-[0_0_50px_-12px_rgba(245,158,11,0.15)] h-full flex flex-col">
                        <div className="text-center space-y-2">
                          <span className="text-sky-400 font-black uppercase tracking-[0.2em] text-xs">Total Area</span>
                          <div className="flex items-baseline justify-center gap-2">
                            <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                              {Math.round(constructionResult.area).toLocaleString()}
                            </span>
                            <span className="text-xl font-bold text-sky-500/50">sq ft</span>
                          </div>
                        </div>

                        <div className="h-px bg-slate-800/50" />

                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                          {[
                            { label: 'Cement', qty: `${Math.round(constructionResult.cement)} bags`, cost: constructionResult.cementCost },
                            { label: 'Sand', qty: `${constructionResult.sand.toFixed(2)} m³ (≈${Math.round(constructionResult.sand * 35.3)} CFT)`, cost: constructionResult.sandCost },
                            { label: 'Gitti', qty: `${constructionResult.gitti.toFixed(2)} m³ (≈${Math.round(constructionResult.gitti * 35.3)} CFT)`, cost: constructionResult.gittiCost },
                            { label: 'Steel', qty: `${Math.round(constructionResult.steel)} kg`, cost: constructionResult.steelCost },
                            { label: 'Paint', qty: `${constructionResult.paint.toFixed(1)} Liters`, cost: constructionResult.paintCost },
                            { label: 'Tiles', qty: `${Math.round(constructionResult.tiles)} sq ft`, cost: constructionResult.tilesCost },
                            { label: 'Plaster', qty: 'Material Estimate', cost: constructionResult.plasterCost },
                          ].map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:border-sky-500/30 transition-colors group">
                              <div className="space-y-1">
                                <span className="text-sky-400 font-black text-xs uppercase tracking-wider block group-hover:text-sky-300 transition-colors">{item.label}</span>
                                <span className="text-xs text-slate-500 font-medium">{item.qty}</span>
                              </div>
                              <span className="text-lg font-bold text-white font-mono">₹{Math.round(item.cost).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-6 border-t border-slate-800/50">
                          <div className="flex justify-between items-center p-4 bg-emerald-500/10 rounded-2xl border-2 border-emerald-500/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
                            <span className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px]">Estimated Total</span>
                            <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">₹{Math.round(constructionResult.totalCost).toLocaleString()}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 mt-4 italic text-center">*Estimated cost. Prices may vary by location.</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <Button 
                        onClick={resetConstruction}
                        className="flex-1 py-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all active:scale-[0.98]"
                      >
                        Reset
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsDownloading(true);
                          setTimeout(() => setIsDownloading(false), 2000);
                        }}
                        className="flex-[2] py-6 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98] group"
                      >
                        {isDownloading ? 'Generating PDF...' : 'Download Estimate'}
                        {!isDownloading && <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'gst' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-indigo-500/10 p-3 rounded-2xl">
                    <IndianRupee className="text-indigo-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">GST Calculator</h3>
                    <p className="text-slate-400 text-sm">Goods and Services Tax calculation for businesses.</p>
                  </div>
                </div>
                <div className="space-y-10">
                  <SliderGroup label="Base Amount" value={gstAmount} min="100" max="100000" step="100" onChange={setGstAmount} unit="₹" icon={IndianRupee} color="sky" />
                  <SliderGroup label="GST Rate" value={gstRate} min="0" max="28" step="1" onChange={setGstRate} unit="%" icon={Percent} color="emerald" />
                  {gstResult && (
                    <div className="mt-4 p-8 bg-slate-900/80 rounded-[2.5rem] border-2 border-emerald-500/30 space-y-6 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]">
                      <div className="text-center space-y-2">
                        <span className="text-sky-400 font-black uppercase tracking-[0.2em] text-xs">Total Amount</span>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-2xl font-bold text-sky-500/50">₹</span>
                          <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                            {Math.round(gstResult.totalAmount).toLocaleString()}
                          </span>
                          <button 
                            onClick={() => copyToClipboard(`Total Amount: ₹${Math.round(gstResult.totalAmount).toLocaleString()}`)}
                            className="ml-2 p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-sky-400 transition-colors"
                          >
                            <FileText size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="h-px bg-slate-800/50" />
                      <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">GST Amount ({gstRate}%)</span>
                        <span className="text-xl font-black text-emerald-400">₹{Math.round(gstResult.gstAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <Button className="w-full py-6 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98] group">
                    Generate Invoice 
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'bmi' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-sky-500/10 p-3 rounded-2xl">
                    <Activity className="text-sky-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">BMI Calculator</h3>
                    <p className="text-slate-400 text-sm">Body Mass Index, health status.</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Weight" value={weight} min="30" max="200" step="1" onChange={setWeight} unit="kg" icon={Scale} color="emerald" />
                  <SliderGroup label="Height" value={height} min="100" max="250" step="1" onChange={setHeight} unit="cm" icon={User} color="emerald" />
                  {bmiResult && (
                    <div className="mt-4 space-y-6">
                      <div className="p-6 bg-slate-900/80 rounded-3xl border-2 border-sky-500/30 space-y-6 shadow-[0_0_30px_-10px_rgba(14,165,233,0.2)]">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Your BMI Score</span>
                          <span className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{bmiResult.bmi.toFixed(1)}</span>
                        </div>
                        
                        {/* Visual Scale */}
                        <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden flex">
                          <div className="h-full bg-sky-400 w-[18.5%]" title="Underweight" />
                          <div className="h-full bg-emerald-400 w-[6.5%]" title="Normal" />
                          <div className="h-full bg-amber-400 w-[5%]" title="Overweight" />
                          <div className="h-full bg-rose-400 flex-1" title="Obese" />
                          
                          {/* Marker */}
                          <motion.div 
                            initial={{ left: 0 }}
                            animate={{ left: `${Math.min(100, (bmiResult.bmi / 40) * 100)}%` }}
                            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                          <span className="text-slate-500 text-sm font-bold">Health Status</span>
                          <span className={`text-xl font-black ${bmiResult.color} uppercase tracking-wider`}>{bmiResult.category}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Normal Range</span>
                          <span className="text-emerald-400 font-bold">18.5 - 24.9</span>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Ideal Weight</span>
                          <span className="text-sky-400 font-bold">{Math.round(22 * Math.pow(parseFloat(height)/100, 2))} kg</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <Button className="bg-sky-500 hover:bg-sky-400 text-slate-950">Health Tips <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'age' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-rose-500/10 p-3 rounded-2xl">
                    <Clock className="text-rose-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Age Calculator</h3>
                    <p className="text-slate-400 text-sm">Exact age in years, months, days.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Calendar size={14} /> Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
                    />
                  </div>
                  {ageResult && (
                    <div className="mt-4 p-6 bg-rose-500/5 rounded-3xl border border-rose-500/20">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-slate-800/50 rounded-2xl">
                          <p className="text-3xl font-black text-white">{ageResult.years}</p>
                          <p className="text-xs text-slate-500 uppercase font-bold mt-1">Years</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-2xl">
                          <p className="text-3xl font-black text-white">{ageResult.months}</p>
                          <p className="text-xs text-slate-500 uppercase font-bold mt-1">Months</p>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-2xl">
                          <p className="text-3xl font-black text-white">{ageResult.days}</p>
                          <p className="text-xs text-slate-500 uppercase font-bold mt-1">Days</p>
                        </div>
                      </div>
                      
                      {/* Next Birthday */}
                      <div className="mt-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-rose-500/20 p-2 rounded-lg">
                            <Calendar className="text-rose-500" size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">Next Birthday</p>
                            <p className="text-sm font-bold text-white">
                              {(() => {
                                const bday = new Date(dob);
                                const today = new Date();
                                let nextBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
                                if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1);
                                const diff = nextBday.getTime() - today.getTime();
                                const days = Math.ceil(diff / (1000 * 3600 * 24));
                                return `${days} days to go`;
                              })()}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(`My Age: ${ageResult.years} Years, ${ageResult.months} Months, ${ageResult.days} Days`)}
                          className="p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <FileText size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <Button className="bg-rose-500 hover:bg-rose-400 text-slate-950">Life Milestones <ArrowRight size={18} /></Button>
                    {ageResult && (
                      <button 
                        onClick={() => shareResult('age', { dob })}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-sm rounded-2xl shadow-[0_10px_20px_-5px_rgba(244,63,94,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <ArrowLeftRight size={18} /> Share Result
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'discount' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-sky-500/10 p-3 rounded-2xl">
                    <Ticket className="text-sky-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Discount Calculator</h3>
                    <p className="text-slate-400 text-sm">Sales discount, savings, final price.</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Original Price" value={price} min="10" max="10000" step="10" onChange={setPrice} unit="₹" icon={Tag} color="sky" />
                  <SliderGroup label="Discount Percentage" value={discount} min="0" max="100" step="1" onChange={setDiscount} unit="%" icon={Percent} color="sky" />
                  {discountResult && (
                    <div className="mt-4 p-6 bg-sky-500/5 rounded-3xl border border-sky-500/20 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Final Price</span>
                        <span className="text-3xl font-black text-white">₹{Math.round(discountResult.finalPrice).toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-slate-800" />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">You Save</span>
                        <span className="text-sky-400 font-bold">₹{Math.round(discountResult.savings).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                  <Button className="bg-sky-500 hover:bg-sky-400 text-slate-950">Shop Smart <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'percentage' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-violet-500/10 p-3 rounded-2xl">
                    <Hash className="text-violet-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Percentage Calculator</h3>
                    <p className="text-slate-400 text-sm">Percentage of a number, ratio.</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Number" value={number} min="1" max="10000" step="1" onChange={setNumber} unit="" icon={Hash} color="violet" />
                  <SliderGroup label="Percentage" value={percent} min="0" max="100" step="0.1" onChange={setPercent} unit="%" icon={Percent} color="violet" />
                  {percentageResult && (
                    <div className="mt-4 p-6 bg-violet-500/5 rounded-3xl border border-violet-500/20 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Result</span>
                        <span className="text-3xl font-black text-white">{percentageResult.result.toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-slate-800" />
                      <div className="text-xs text-slate-500 text-center">
                        {percent}% of {number} is {percentageResult.result}
                      </div>
                    </div>
                  )}
                  <Button className="bg-violet-500 hover:bg-violet-400 text-slate-950">Quick Math <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'sip' && (
              <Card className="flex flex-col border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)] mobile-section">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-indigo-500/10 p-3 rounded-2xl"><TrendingUp className="text-indigo-500" size={28} /></div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">SIP Calculator</h3>
                    <p className="text-slate-400 text-sm">Plan your investments instantly.</p>
                  </div>
                </div>
                <div className="space-y-10 flex-1">
                  {sipRes && (
                    <div className="mt-4 p-4 sm:p-8 bg-slate-900/80 rounded-2xl sm:rounded-[2.5rem] border-2 border-emerald-500/30 space-y-2 sm:space-y-4 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] text-center sticky-result">
                      <span className="text-sky-400 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">Estimated Future Value</span>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-lg sm:text-2xl font-bold text-sky-500/50">₹</span>
                        <span className="text-3xl sm:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                          {Math.round(sipRes).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  <SliderGroup label="Monthly Investment" value={sipAmt} min="500" max="100000" step="500" onChange={setSipAmt} unit="₹" icon={IndianRupee} color="sky" />
                  <SliderGroup label="Expected Return Rate" value={sipRate} min="1" max="30" step="0.5" onChange={setSipRate} unit="%" icon={Percent} color="emerald" />
                  <SliderGroup label="Time Period" value={sipYears} min="1" max="40" step="1" onChange={setSipYears} unit="Yr" icon={Calendar} color="sky" />
                  
                  <Button className="w-full py-6 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98] group">
                    Invest Now 
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'lumpsum' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-indigo-500/10 p-3 rounded-2xl"><Coins className="text-indigo-500" size={28} /></div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Lumpsum Calculator</h3>
                    <p className="text-slate-400 text-sm">Calculate future value of your one-time investment.</p>
                  </div>
                </div>
                <div className="space-y-10">
                  <SliderGroup label="Total Investment" value={lumpAmt} min="1000" max="10000000" step="1000" onChange={setLumpAmt} unit="₹" icon={IndianRupee} color="sky" />
                  <SliderGroup label="Expected Return Rate" value={lumpRate} min="1" max="30" step="0.5" onChange={setLumpRate} unit="%" icon={Percent} color="emerald" />
                  <SliderGroup label="Time Period" value={lumpYears} min="1" max="40" step="1" onChange={setLumpYears} unit="Yr" icon={Calendar} color="sky" />
                  {lumpRes && (
                    <div className="mt-4 p-8 bg-slate-900/80 rounded-[2.5rem] border-2 border-emerald-500/30 space-y-4 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] text-center">
                      <span className="text-sky-400 font-black uppercase tracking-[0.2em] text-xs">Estimated Future Value</span>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-2xl font-bold text-sky-500/50">₹</span>
                        <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                          {Math.round(lumpRes).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  <Button className="w-full py-6 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98] group">
                    Calculate Returns 
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'swp' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-indigo-500/10 p-3 rounded-2xl"><TrendingUp className="text-indigo-500" size={28} /></div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">SWP Calculator</h3>
                    <p className="text-slate-400 text-sm">Systematic Withdrawal Plan estimator for regular income.</p>
                  </div>
                </div>
                <div className="space-y-10">
                  <SliderGroup label="Total Investment" value={swpAmt} min="10000" max="10000000" step="10000" onChange={setSwpAmt} unit="₹" icon={IndianRupee} color="sky" />
                  <SliderGroup label="Monthly Withdrawal" value={swpWithdrawal} min="500" max="500000" step="500" onChange={setSwpWithdrawal} unit="₹" icon={IndianRupee} color="emerald" />
                  <SliderGroup label="Expected Return Rate" value={swpRate} min="1" max="30" step="0.5" onChange={setSwpRate} unit="%" icon={Percent} color="emerald" />
                  <SliderGroup label="Time Period" value={swpYears} min="1" max="40" step="1" onChange={setSwpYears} unit="Yr" icon={Calendar} color="sky" />
                  {swpRes && (
                    <div className="mt-4 p-8 bg-slate-900/80 rounded-[2.5rem] border-2 border-emerald-500/30 space-y-4 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] text-center">
                      <span className="text-sky-400 font-black uppercase tracking-[0.2em] text-xs">Final Balance</span>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-2xl font-bold text-sky-500/50">₹</span>
                        <span className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                          {Math.round(swpRes).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  <Button className="w-full py-6 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98] group">
                    Plan SWP 
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'mfReturns' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-indigo-500/10 p-3 rounded-2xl"><TrendingUp className="text-indigo-500" size={28} /></div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Mutual Fund Returns</h3>
                    <p className="text-slate-400 text-sm">Estimate returns on your mutual fund investments.</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Total Investment" value={lumpAmt} min="1000" max="10000000" step="1000" onChange={setLumpAmt} unit="₹" icon={IndianRupee} color="indigo" />
                  <SliderGroup label="Expected Return Rate" value={lumpRate} min="1" max="30" step="0.5" onChange={setLumpRate} unit="%" icon={Percent} color="indigo" />
                  <SliderGroup label="Time Period" value={lumpYears} min="1" max="40" step="1" onChange={setLumpYears} unit="Yr" icon={Calendar} color="indigo" />
                  {lumpRes && (
                    <div className="mt-4 p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Estimated Returns</span>
                      <span className="text-3xl font-black text-white">₹{Math.round(lumpRes - parseFloat(lumpAmt)).toLocaleString()}</span>
                    </div>
                  )}
                  <Button className="bg-indigo-500 hover:bg-indigo-400 text-slate-950">Check Returns <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'fd' && (
              <Card className="flex flex-col border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] mobile-section">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl"><Banknote className="text-emerald-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">FD Calculator</h3><p className="text-slate-400 text-sm">Fixed Deposit maturity instantly.</p></div>
                </div>
                <div className="space-y-10 flex-1">
                  {fdRes && (
                    <div className="mt-4 p-4 sm:p-8 bg-slate-900/80 rounded-2xl sm:rounded-[2.5rem] border-2 border-emerald-500/30 space-y-2 sm:space-y-4 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] text-center sticky-result">
                      <span className="text-sky-400 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">Maturity Value</span>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-lg sm:text-2xl font-bold text-sky-500/50">₹</span>
                        <span className="text-3xl sm:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                          {Math.round(fdRes).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  <SliderGroup label="Deposit Amount" value={fdP} min="1000" max="10000000" step="1000" onChange={setFdP} unit="₹" icon={IndianRupee} color="emerald" />
                  <SliderGroup label="Interest Rate" value={fdR} min="1" max="15" step="0.1" onChange={setFdR} unit="%" icon={Percent} color="emerald" />
                  <SliderGroup label="Tenure" value={fdT} min="1" max="20" step="1" onChange={setFdT} unit="Yr" icon={Calendar} color="emerald" />
                  
                  <Button className="w-full py-6 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-black text-lg rounded-2xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] transition-all active:scale-[0.98] group">
                    Save More 
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            )}

            {activeTab === 'rd' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl"><PiggyBank className="text-emerald-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">RD Calculator</h3><p className="text-slate-400 text-sm">Recurring Deposit maturity calculator.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Monthly Deposit" value={rdAmt} min="500" max="100000" step="500" onChange={setRdAmt} unit="₹" icon={IndianRupee} color="emerald" />
                  <SliderGroup label="Interest Rate" value={rdRate} min="1" max="15" step="0.1" onChange={setRdRate} unit="%" icon={Percent} color="emerald" />
                  <SliderGroup label="Tenure" value={rdYears} min="1" max="10" step="1" onChange={setRdYears} unit="Yr" icon={Calendar} color="emerald" />
                  {rdRes && (
                    <div className="mt-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Maturity Value</span>
                      <span className="text-3xl font-black text-white">₹{Math.round(rdRes).toLocaleString()}</span>
                    </div>
                  )}
                  <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950">Calculate <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'ppf' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl"><PiggyBank className="text-emerald-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">PPF Calculator</h3><p className="text-slate-400 text-sm">Public Provident Fund returns estimator.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Annual Investment" value={ppfAmt} min="500" max="150000" step="500" onChange={setPpfAmt} unit="₹" icon={IndianRupee} color="emerald" />
                  <SliderGroup label="Time Period" value={ppfYears} min="15" max="50" step="1" onChange={setPpfYears} unit="Yr" icon={Calendar} color="emerald" />
                  {ppfRes && (
                    <div className="mt-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Maturity Amount</span>
                      <span className="text-3xl font-black text-white">₹{Math.round(ppfRes).toLocaleString()}</span>
                    </div>
                  )}
                  <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950">Check PPF <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'epf' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl"><Briefcase className="text-emerald-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">EPF Calculator</h3><p className="text-slate-400 text-sm">Employee Provident Fund maturity calculator.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Monthly Basic + DA" value={epfBasic} min="5000" max="500000" step="1000" onChange={setEpfBasic} unit="₹" icon={IndianRupee} color="emerald" />
                  <SliderGroup label="Current Age" value={epfAge} min="18" max="57" step="1" onChange={setEpfAge} unit="Yr" icon={Clock} color="emerald" />
                  {epfRes && (
                    <div className="mt-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Maturity Amount (at 58)</span>
                      <span className="text-3xl font-black text-white">₹{Math.round(epfRes).toLocaleString()}</span>
                    </div>
                  )}
                  <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950">Plan Retirement <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'ssy' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl"><PiggyBank className="text-emerald-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">SSY Calculator</h3><p className="text-slate-400 text-sm">Sukanya Samriddhi Yojana maturity estimator.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Annual Investment" value={ssyAmt} min="250" max="150000" step="250" onChange={setSsyAmt} unit="₹" icon={IndianRupee} color="emerald" />
                  <SliderGroup label="Girl's Age" value={ssyAge} min="1" max="10" step="1" onChange={setSsyAge} unit="Yr" icon={Clock} color="emerald" />
                  {ssyRes && (
                    <div className="mt-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Maturity Amount (at 21)</span>
                      <span className="text-3xl font-black text-white">₹{Math.round(ssyRes).toLocaleString()}</span>
                    </div>
                  )}
                  <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950">Plan Future <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'incomeTax' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-amber-500/10 p-3 rounded-2xl"><FileText className="text-amber-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">Income Tax</h3><p className="text-slate-400 text-sm">Estimate your income tax for the current financial year.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Annual Income" value={taxIncome} min="100000" max="10000000" step="10000" onChange={setTaxIncome} unit="₹" icon={IndianRupee} color="amber" />
                  <SliderGroup label="Total Deductions" value={taxDeductions} min="0" max="1000000" step="5000" onChange={setTaxDeductions} unit="₹" icon={IndianRupee} color="amber" />
                  {taxRes !== null && (
                    <div className="mt-4 p-6 bg-amber-500/5 rounded-3xl border border-amber-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Estimated Tax (New Regime)</span>
                      <span className="text-3xl font-black text-white">₹{Math.round(taxRes).toLocaleString()}</span>
                    </div>
                  )}
                  <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950">Calculate Tax <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'interest' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-amber-500/10 p-3 rounded-2xl"><Percent className="text-amber-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">Interest Calculator</h3><p className="text-slate-400 text-sm">Simple interest calculation.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Principal" value={intP} min="100" max="1000000" step="100" onChange={setIntP} unit="₹" icon={IndianRupee} color="amber" />
                  <SliderGroup label="Rate" value={intR} min="0.1" max="50" step="0.1" onChange={setIntR} unit="%" icon={Percent} color="amber" />
                  <SliderGroup label="Time" value={intT} min="1" max="30" step="1" onChange={setIntT} unit="Yr" icon={Calendar} color="amber" />
                  {intRes && (
                    <div className="mt-4 p-6 bg-amber-500/5 rounded-3xl border border-amber-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Simple Interest</span>
                      <span className="text-3xl font-black text-white">₹{Math.round(intRes).toLocaleString()}</span>
                    </div>
                  )}
                  <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950">Calculate <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'loan' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-sky-500/10 p-3 rounded-2xl"><Wallet className="text-sky-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">Loan Eligibility</h3><p className="text-slate-400 text-sm">Loan eligibility based on income.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Monthly Income" value={income} min="5000" max="500000" step="1000" onChange={setIncome} unit="₹" icon={IndianRupee} color="sky" />
                  <SliderGroup label="Monthly Expenses" value={expense} min="0" max="400000" step="1000" onChange={setExpense} unit="₹" icon={IndianRupee} color="sky" />
                  {loanElig && (
                    <div className="mt-4 p-6 bg-sky-500/5 rounded-3xl border border-sky-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Estimated Eligibility</span>
                      <span className="text-3xl font-black text-white">₹{Math.round(loanElig).toLocaleString()}</span>
                    </div>
                  )}
                  <Button className="bg-sky-500 hover:bg-sky-400 text-slate-950">Apply Now <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'profit' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-rose-500/10 p-3 rounded-2xl"><BarChart3 className="text-rose-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">Profit/Loss</h3><p className="text-slate-400 text-sm">Profit and loss percentage.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Cost Price" value={cp} min="1" max="100000" step="1" onChange={setCp} unit="₹" icon={Tag} color="rose" />
                  <SliderGroup label="Selling Price" value={sp} min="1" max="100000" step="1" onChange={setSp} unit="₹" icon={Tag} color="rose" />
                  {profitRes !== null && (
                    <div className={`mt-4 p-6 rounded-3xl border space-y-2 ${profitRes >= 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                      <span className="text-slate-400 font-medium block">{profitRes >= 0 ? 'Profit' : 'Loss'}</span>
                      <span className={`text-3xl font-black ${profitRes >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>₹{Math.abs(Math.round(profitRes)).toLocaleString()}</span>
                    </div>
                  )}
                  <Button className="bg-rose-500 hover:bg-rose-400 text-slate-950">Analyze <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'unit' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-violet-500/10 p-3 rounded-2xl"><ArrowLeftRight className="text-violet-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">Unit Converter</h3><p className="text-slate-400 text-sm">Feet to meter, length conversion.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Feet" value={ft} min="0" max="1000" step="0.1" onChange={setFt} unit="ft" icon={Ruler} color="violet" />
                  {unitRes && (
                    <div className="mt-4 p-6 bg-violet-500/5 rounded-3xl border border-violet-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Meters</span>
                      <span className="text-3xl font-black text-white">{unitRes} m</span>
                    </div>
                  )}
                  <Button className="bg-violet-500 hover:bg-violet-400 text-slate-950">Convert <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'time' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-indigo-500/10 p-3 rounded-2xl"><Timer className="text-indigo-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">Time Calculator</h3><p className="text-slate-400 text-sm">Hours and minutes to total minutes.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Hours" value={hours} min="0" max="24" step="1" onChange={setHours} unit="h" icon={Clock} color="indigo" />
                  <SliderGroup label="Minutes" value={minutes} min="0" max="60" step="1" onChange={setMinutes} unit="m" icon={Clock} color="indigo" />
                  {timeRes !== null && (
                    <div className="mt-4 p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Total Minutes</span>
                      <span className="text-3xl font-black text-white">{timeRes} min</span>
                    </div>
                  )}
                  <Button className="bg-indigo-500 hover:bg-indigo-400 text-slate-950">Calculate <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'date' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl"><CalendarRange className="text-emerald-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">Date Difference</h3><p className="text-slate-400 text-sm">Difference between two dates.</p></div>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500">Start Date</label>
                      <input type="date" value={d1} onChange={(e) => setD1(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-500">End Date</label>
                      <input type="date" value={d2} onChange={(e) => setD2(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white" />
                    </div>
                  </div>
                  {dateRes !== null && (
                    <div className="mt-4 space-y-6">
                      <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                            <p className="text-3xl font-black text-white">{dateRes.years}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Years</p>
                          </div>
                          <div className="text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                            <p className="text-3xl font-black text-white">{dateRes.months}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Months</p>
                          </div>
                          <div className="text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                            <p className="text-3xl font-black text-white">{dateRes.days}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Days</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                          <span className="text-slate-500 text-sm font-bold">Total Days</span>
                          <span className="text-2xl font-black text-emerald-400">{dateRes.totalDays.toLocaleString()}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => shareResult('date', { d1, d2 })}
                        className="w-full py-4 bg-gradient-to-r from-sky-400 to-emerald-500 hover:from-sky-300 hover:to-emerald-400 text-white font-black text-sm rounded-2xl shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <ArrowLeftRight size={18} /> Share Result
                      </button>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => { setD1(''); setD2(''); setDateRes(null); }}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      Reset
                    </Button>
                    <Button className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-slate-950">
                      Calculate <ArrowRight size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'cgpa' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-amber-500/10 p-3 rounded-2xl"><GraduationCap className="text-amber-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">CGPA Calculator</h3><p className="text-slate-400 text-sm">Percentage to CGPA converter.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Percentage" value={marks} min="0" max="100" step="0.1" onChange={setMarks} unit="%" icon={Percent} color="amber" />
                  {cgpaRes && (
                    <div className="mt-4 p-6 bg-amber-500/5 rounded-3xl border border-amber-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Estimated CGPA</span>
                      <span className="text-3xl font-black text-white">{cgpaRes}</span>
                    </div>
                  )}
                  <Button className="bg-amber-500 hover:bg-amber-400 text-slate-950">Check Score <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'bmr' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-rose-500/10 p-3 rounded-2xl"><Flame className="text-rose-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">BMR Calculator</h3><p className="text-slate-400 text-sm">Basal Metabolic Rate.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Weight" value={bmrWt} min="30" max="200" step="1" onChange={setBmrWt} unit="kg" icon={Scale} color="rose" />
                  <SliderGroup label="Height" value={bmrHt} min="100" max="250" step="1" onChange={setBmrHt} unit="cm" icon={User} color="rose" />
                  <SliderGroup label="Age" value={bmrAge} min="1" max="100" step="1" onChange={setBmrAge} unit="yr" icon={Clock} color="rose" />
                  {bmrRes && (
                    <div className="mt-4 p-6 bg-rose-500/5 rounded-3xl border border-rose-500/20">
                      <span className="text-slate-400 font-medium block mb-2">BMR Score</span>
                      <span className="text-3xl font-black text-white">{Math.round(bmrRes)} <span className="text-sm text-slate-500">kcal/day</span></span>
                    </div>
                  )}
                  <Button className="bg-rose-500 hover:bg-rose-400 text-slate-950">Health Check <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'calorie' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-sky-500/10 p-3 rounded-2xl"><Flame className="text-sky-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">Calorie Calculator</h3><p className="text-slate-400 text-sm">Daily calorie requirements.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Weight" value={calWt} min="30" max="200" step="1" onChange={setCalWt} unit="kg" icon={Scale} color="sky" />
                  {calRes && (
                    <div className="mt-4 p-6 bg-sky-500/5 rounded-3xl border border-sky-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Daily Calories</span>
                      <span className="text-3xl font-black text-white">{Math.round(calRes)} <span className="text-sm text-slate-500">kcal</span></span>
                    </div>
                  )}
                  <Button className="bg-sky-500 hover:bg-sky-400 text-slate-950">Plan Diet <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}

            {activeTab === 'weight' && (
              <Card className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-violet-500/10 p-3 rounded-2xl"><Dumbbell className="text-violet-500" size={28} /></div>
                  <div><h3 className="text-2xl font-bold text-white">Ideal Weight</h3><p className="text-slate-400 text-sm">Ideal body weight based on height.</p></div>
                </div>
                <div className="space-y-8">
                  <SliderGroup label="Height" value={idealHt} min="100" max="250" step="1" onChange={setIdealHt} unit="cm" icon={User} color="violet" />
                  {idealRes && (
                    <div className="mt-4 p-6 bg-violet-500/5 rounded-3xl border border-violet-500/20">
                      <span className="text-slate-400 font-medium block mb-2">Ideal Weight</span>
                      <span className="text-3xl font-black text-white">{idealRes} kg</span>
                    </div>
                  )}
                  <Button className="bg-violet-500 hover:bg-violet-400 text-slate-950">Fitness Goal <ArrowRight size={18} /></Button>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* All Calculators Grid (Tools Directory) */}
        <section className="mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Tools Directory</h2>
              <p className="text-slate-400">Explore our complete suite of {tabs.length} professional tools.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Filter tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-sky-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group p-6 rounded-3xl border transition-all text-left flex flex-col gap-4 ${
                  activeTab === tab.id 
                    ? 'bg-sky-500/10 border-sky-500/50' 
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl transition-colors ${
                    activeTab === tab.id ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400 group-hover:text-sky-400'
                  }`}>
                    <tab.icon size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md">
                    {tab.category}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-sky-400 transition-colors">{tab.label}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tab.description}</p>
                </div>
                <div className="flex items-center text-xs font-bold text-sky-500 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  Open Tool <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
          
          {filteredTabs.length === 0 && (
            <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
              <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="text-slate-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">No tools found</h3>
              <p className="text-slate-500 mt-2">Try searching for something else like "EMI" or "Construction".</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-sky-500 font-bold hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => { setActiveTab('emi'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <Logo className="scale-75 origin-left" />
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Your all-in-one destination for professional financial, construction, health, and general-purpose calculators. Fast, accurate, and free.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/50 transition-all">
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-current rounded-sm opacity-20" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Finance Tools</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><button onClick={() => { setActiveTab('emi'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-sky-400 transition-colors">EMI Calculator</button></li>
                <li><button onClick={() => { setActiveTab('sip'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-sky-400 transition-colors">SIP Calculator</button></li>
                <li><button onClick={() => { setActiveTab('gst'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-sky-400 transition-colors">GST Calculator</button></li>
                <li><button onClick={() => { setActiveTab('incomeTax'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-sky-400 transition-colors">Income Tax</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Other Tools</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><button onClick={() => { setActiveTab('construction'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-sky-400 transition-colors">Construction Estimator</button></li>
                <li><button onClick={() => { setActiveTab('bmi'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-sky-400 transition-colors">BMI Calculator</button></li>
                <li><button onClick={() => { setActiveTab('age'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-sky-400 transition-colors">Age Calculator</button></li>
                <li><button onClick={() => { setActiveTab('unit'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-sky-400 transition-colors">Unit Converter</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Contact & Support</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li className="flex items-center gap-2 cursor-pointer hover:text-sky-400 transition-colors"><Info size={14} /> Help Center</li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-sky-400 transition-colors"><FileText size={14} /> Privacy Policy</li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-sky-400 transition-colors"><Scale size={14} /> Terms of Service</li>
                <li className="text-sky-500 font-bold">support@shreecalc.com</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs text-center md:text-left">
              © {new Date().getFullYear()} Shree Calculator Hub. All rights reserved. Designed for precision and speed.
            </p>
            <div className="flex items-center gap-6 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Systems Operational</span>
              <span>v2.4.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-4 bg-sky-500 text-slate-950 rounded-full shadow-2xl shadow-sky-500/40 hover:scale-110 active:scale-95 transition-all z-40 md:hidden"
      >
        <Calculator size={24} />
      </button>
    </div>
  );
}
