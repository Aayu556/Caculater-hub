import React, { useState, useEffect } from 'react';
import { CreditCard, IndianRupee, Percent, Calendar, ChevronRight, Home, Car, Building, FileText, ArrowLeftRight } from 'lucide-react';
import { motion } from 'motion/react';

interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
}

const loanTypes = [
  { id: 'emi', label: 'EMI Calculator', icon: CreditCard, defaultRate: '10' },
  { id: 'homeLoan', label: 'Home Loan', icon: Home, defaultRate: '8.5' },
  { id: 'carLoan', label: 'Car Loan', icon: Car, defaultRate: '9' },
  { id: 'sbiLoan', label: 'SBI Loan', icon: Building, defaultRate: '8.75' },
  { id: 'hdfcLoan', label: 'HDFC Loan', icon: Building, defaultRate: '8.9' },
];

const SliderGroup = ({ label, value, min, max, step, onChange, unit, icon: Icon, color = 'sky' }: any) => {
  const themes: Record<string, { badge: string; accent: string }> = {
    sky: { badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20', accent: 'accent-sky-500' },
    emerald: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', accent: 'accent-emerald-500' },
    cyan: { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', accent: 'accent-cyan-500' },
  };
  const theme = themes[color] || themes.sky;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
        <label className="text-xs sm:text-base font-bold text-slate-300 flex items-center gap-2 shrink-0">
          {Icon && <Icon size={14} className="text-sky-400 sm:size-[18px]" />}
          {label}
        </label>
        <div className={`${theme.badge} flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border sm:border-2 shadow-lg w-full sm:w-auto justify-end`}>
          {unit === '₹' && <span className="text-sm sm:text-lg font-black mr-1 opacity-70">₹</span>}
          <input
            type="number"
            step="any"
            value={value}
            onChange={(e) => onChange(e.target.value === '' ? '0' : e.target.value)}
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
        className={`w-full h-1.5 sm:h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${theme.accent}`}
      />
    </div>
  );
};

export default function EmiPage() {
  const [activeLoan, setActiveLoan] = useState('emi');
  const [loan, setLoan] = useState('1000000');
  const [rate, setRate] = useState('10');
  const [years, setYears] = useState('5');
  const [emiResult, setEmiResult] = useState<EMIResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const P = parseFloat(loan);
    const r = parseFloat(rate) / 12 / 100;
    const N = parseFloat(years) * 12;
    if (isNaN(P) || isNaN(r) || isNaN(N) || N === 0 || r === 0) return;
    const EMI = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    const totalPayment = EMI * N;
    const totalInterest = totalPayment - P;
    setEmiResult({ monthlyEMI: EMI, totalInterest, totalPayment, principal: P });
  }, [loan, rate, years]);

  const handleLoanTypeChange = (id: string) => {
    setActiveLoan(id);
    const found = loanTypes.find(l => l.id === id);
    if (found) setRate(found.defaultRate);
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  const currentLoan = loanTypes.find(l => l.id === activeLoan) || loanTypes[0];
  const LoanIcon = currentLoan.icon;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 50%, #0a0f1e 100%)' }}>
      {/* Header */}
      <header className="border-b border-slate-800 px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', boxShadow: '0 0 0 2px rgba(56,189,248,0.7), 0 0 16px rgba(0,150,255,0.8)' }}>
            <img src="/logo.jpg" alt="Shree Calculator Hub" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', fontWeight: 800, color: '#e2e8f0', textTransform: 'uppercase' }}>Shree</div>
            <div style={{ fontSize: 16, fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #bae6fd 40%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Calculator Hub</div>
          </div>
        </a>
        <a href="/" className="text-xs text-sky-400 border border-sky-500/30 px-3 py-1.5 rounded-lg hover:bg-sky-500/10 transition-colors">
          ← All Calculators
        </a>
      </header>

      {/* Page Title */}
      <div className="text-center px-4 pt-10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">EMI Calculator</h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Calculate your monthly loan EMI instantly. Enter loan amount, interest rate and tenure to see your repayment breakdown.
        </p>
      </div>

      {/* Loan Type Tabs */}
      <div className="flex overflow-x-auto gap-2 px-4 pb-2 max-w-3xl mx-auto scrollbar-hide">
        {loanTypes.map(lt => (
          <button
            key={lt.id}
            onClick={() => handleLoanTypeChange(lt.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeLoan === lt.id
                ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:border-sky-500/50 hover:text-sky-400'
            }`}
          >
            <lt.icon size={14} />
            {lt.label}
          </button>
        ))}
      </div>

      {/* Calculator Card */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl border-sky-500/20 shadow-sky-500/10"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-sky-500/10 p-3 rounded-2xl">
              <LoanIcon className="text-sky-500" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{currentLoan.label}</h2>
              <p className="text-slate-400 text-sm">Enter your loan details below</p>
            </div>
          </div>

          <div className="space-y-6">
            <SliderGroup label="Loan Amount" value={loan} min="10000" max="10000000" step="10000" onChange={setLoan} unit="₹" icon={IndianRupee} color="cyan" />
            <SliderGroup label="Interest Rate (p.a)" value={rate} min="1" max="25" step="0.1" onChange={setRate} unit="%" icon={Percent} color="emerald" />
            <SliderGroup label="Loan Tenure" value={years} min="1" max="30" step="1" onChange={setYears} unit="Yr" icon={Calendar} color="sky" />

            {emiResult && (
              <div className="mt-2 p-5 bg-slate-900/80 rounded-2xl border-2 border-sky-500/30 space-y-4 shadow-[0_0_50px_-12px_rgba(14,165,233,0.2)]">
                <div className="text-center space-y-1">
                  <span className="text-cyan-400 font-black uppercase tracking-[0.2em] text-xs">Monthly EMI</span>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-2xl font-bold text-cyan-500/50">₹</span>
                    <span className="text-5xl sm:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                      {Math.round(emiResult.monthlyEMI).toLocaleString()}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`Monthly EMI: ₹${Math.round(emiResult.monthlyEMI).toLocaleString()}`)}
                      className="ml-2 p-2 bg-slate-800 rounded-lg text-slate-500 hover:text-cyan-400 transition-colors"
                      title="Copy Result"
                    >
                      <FileText size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Principal</span>
                    <span className="text-xs font-bold text-white">₹{emiResult.principal.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Interest</span>
                    <span className="text-xs font-bold text-cyan-400">₹{Math.round(emiResult.totalInterest).toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-center">
                    <span className="text-[9px] font-bold text-cyan-500/70 uppercase tracking-widest block mb-1">Total</span>
                    <span className="text-xs font-black text-cyan-400">₹{Math.round(emiResult.totalPayment).toLocaleString()}</span>
                  </div>
                </div>

                {(() => {
                  const principalPct = Math.round((emiResult.principal / (emiResult.principal + emiResult.totalInterest)) * 100);
                  return (
                    <div className="space-y-2">
                      <div className="flex h-3 rounded-full overflow-hidden">
                        <div className="bg-sky-400 transition-all duration-500" style={{ width: `${principalPct}%` }} />
                        <div className="bg-emerald-500 flex-1" />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />Principal {principalPct}%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Interest {100 - principalPct}%</span>
                      </div>
                    </div>
                  );
                })()}

                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="text-xs font-bold text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors"
                >
                  {showSchedule ? 'Hide' : 'Show'} Repayment Schedule
                  <ChevronRight size={12} className={showSchedule ? 'rotate-90' : ''} />
                </button>

                {showSchedule && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden bg-slate-950/50 rounded-xl border border-slate-800">
                    <div className="max-h-52 overflow-y-auto">
                      <table className="w-full text-[10px] text-left">
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
            )}
          </div>
        </motion.div>

        {/* SEO Content */}
        <div className="mt-10 text-slate-400 text-sm space-y-4">
          <h2 className="text-white font-bold text-lg">How does the EMI Calculator work?</h2>
          <p>EMI (Equated Monthly Installment) is calculated using the formula: <strong className="text-sky-400">EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ - 1)</strong>, where P is the principal loan amount, r is the monthly interest rate, and n is the number of months.</p>
          <p>Our free EMI calculator supports Home Loan, Car Loan, SBI, HDFC and ICICI bank loan calculations with accurate results.</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Home Loan EMI', 'Car Loan EMI', 'Personal Loan EMI', 'SBI Loan EMI', 'HDFC Loan EMI'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-slate-700">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-600 text-xs border-t border-slate-800 mt-10">
        <p>&copy; 2026 Shree Calculator Hub. All rights reserved.</p>
        <a href="/" className="text-sky-500 hover:text-sky-400 mt-1 inline-block">← Back to all calculators</a>
      </footer>
    </div>
  );
}
