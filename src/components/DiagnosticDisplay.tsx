import React, { useState } from 'react';
import { Activity, Gauge, Terminal, Cpu } from 'lucide-react';

interface DiagnosticDisplayProps {
  type?: 'scanner' | 'waveform' | 'cutaway' | 'wiring';
  title?: string;
  scannerData?: { parameter: string; value: string; unit: string; normal: string }[];
  dtcList?: { code: string; status: string; description: string }[];
  waveformType?: 'injector' | 'ckp_sine' | 'hall_square' | 'o2_narrow';
}

export const DiagnosticDisplay: React.FC<DiagnosticDisplayProps> = ({
  type = 'scanner',
  title = 'Live Diagnostic Telemetry - Launch X-431 Pro',
  scannerData = [
    { parameter: 'ENGINE SPEED', value: '750', unit: 'RPM', normal: '700 - 800' },
    { parameter: 'COOLANT TEMP (ECT)', value: '88.5', unit: '°C', normal: '80.0 - 95.0' },
    { parameter: 'MANIFOLD PRESSURE (MAP)', value: '31.2', unit: 'kPa', normal: '26.0 - 35.0' },
    { parameter: 'SHORT TERM FUEL TRIM (STFT)', value: '+1.5', unit: '%', normal: '-5.0 ~ +5.0' },
    { parameter: 'LONG TERM FUEL TRIM (LTFT)', value: '+2.3', unit: '%', normal: '-5.0 ~ +5.0' },
    { parameter: 'O2 SENSOR B1S1', value: '0.12 ~ 0.85', unit: 'V', normal: 'Oscillating' },
    { parameter: 'INJECTION PULSE WIDTH', value: '2.45', unit: 'ms', normal: '2.0 - 3.2' },
    { parameter: 'THROTTLE POSITION (TPS)', value: '14.2', unit: '%', normal: '12.0 - 16.0' }
  ],
  dtcList = [
    { code: 'P0171', status: 'CONFIRMED', description: 'System Too Lean (Bank 1)' },
    { code: 'P0300', status: 'PENDING', description: 'Random/Multiple Cylinder Misfire Detected' }
  ],
  waveformType = 'injector'
}) => {
  const [activeTab, setActiveTab] = useState<'stream' | 'dtc' | 'scope'>('stream');

  return (
    <div className="w-full my-4 rounded-xl border border-slate-700 bg-slate-900/90 overflow-hidden shadow-xl">
      {/* Scanner Diagnostic Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-white tracking-wide">LAUNCH X-431 PRO V+ DIAGNOSTIC DISPLAY</span>
          <span className="text-slate-500">|</span>
          <span className="font-mono text-cyan-400">OBD-II LIVE LINK (500 kbps)</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('stream')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'stream' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Data
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dtc')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'dtc' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            DTC Codes ({dtcList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scope')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'scope' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Oscilloscope
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4">
        {activeTab === 'stream' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {scannerData.map((item, idx) => (
                <div key={idx} className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 flex flex-col justify-between">
                  <span className="text-[11px] font-medium text-slate-400 tracking-wider truncate">
                    {item.parameter}
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-mono text-lg font-bold text-cyan-400 tabular-nums">
                      {item.value}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-1">{item.unit}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800/50">
                    Std: {item.normal}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2.5 text-right text-[11px] text-slate-400 font-mono">
              Vehicle: Toyota Avanza 1.3L DOHC Dual VVT-i (1NR-VE) · Engine Status: Normal Operating Temp (Closed Loop)
            </div>
          </div>
        )}

        {activeTab === 'dtc' && (
          <div className="space-y-2">
            {dtcList.map((dtc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded font-mono font-bold">
                    {dtc.code}
                  </span>
                  <span className="text-slate-200 font-medium">{dtc.description}</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  {dtc.status}
                </span>
              </div>
            ))}
            <div className="p-2.5 bg-slate-950 rounded-lg text-xs text-slate-400">
              Catatan Diagnostik: DTC terbaca dari modul Electronic Control Module (ECM). Disarankan melakukan pemeriksaan freeze frame data dan live sensor sebelum mereset memori DTC.
            </div>
          </div>
        )}

        {activeTab === 'scope' && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="text-emerald-400 font-bold">CH1: INJECTOR #1 DRIVER VOLTAGE (20V/Div · 1.0ms/Div)</span>
              <span className="text-amber-400">TRIGGER: FALLING EDGE @ 6.0V</span>
            </div>

            {/* SVG Waveform Graphic */}
            <div className="w-full h-36 bg-slate-900/90 rounded border border-slate-800 relative overflow-hidden flex items-center justify-center">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 opacity-20 pointer-events-none">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-cyan-500/40" />
                ))}
              </div>

              {/* Dynamic SVG Waveform */}
              <svg className="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
                {/* 12V supply line */}
                <line x1="0" y1="90" x2="120" y2="90" stroke="#38bdf8" strokeWidth="2" />
                {/* Transistor pulls to ground (0V) */}
                <line x1="120" y1="90" x2="120" y2="135" stroke="#38bdf8" strokeWidth="2" />
                {/* Injection duration (pulse width 2.5ms) */}
                <line x1="120" y1="135" x2="280" y2="135" stroke="#38bdf8" strokeWidth="2" />
                {/* Transistor cuts off -> Inductive flyback spike to ~70V */}
                <line x1="280" y1="135" x2="282" y2="15" stroke="#4ade80" strokeWidth="2.5" />
                {/* Flyback collapse decay */}
                <path d="M 282 15 Q 295 40 310 90" stroke="#4ade80" strokeWidth="2" fill="none" />
                {/* Residual oscillations */}
                <path d="M 310 90 Q 320 82 330 90 T 350 90" stroke="#38bdf8" strokeWidth="2" fill="none" />
                {/* Rest of line at 12V */}
                <line x1="350" y1="90" x2="600" y2="90" stroke="#38bdf8" strokeWidth="2" />
              </svg>

              {/* Annotations */}
              <div className="absolute top-2 left-64 text-[10px] text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                Peak Flyback Spike: 68.4 Volt (Inductive Kick)
              </div>
              <div className="absolute bottom-2 left-36 text-[10px] text-cyan-400 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                Durasi Injeksi: 2.67 ms
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>V-Max: 68.4 V · V-Min: 0.18 V (Good ECM Ground)</span>
              <span className="text-cyan-400">Kondisi Solenoid Injektor: NORMAL & SEHAT</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
