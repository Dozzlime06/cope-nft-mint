interface ProgressBarProps {
  minted: number;
  total: number;
}

export function ProgressBar({ minted, total }: ProgressBarProps) {
  const percentage = (minted / total) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Collection Progress</span>
        <span className="text-sm font-bold text-violet-400">{percentage.toFixed(1)}%</span>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        <div
          className="h-full bg-violet-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{minted.toLocaleString()} minted</span>
        <span>{total.toLocaleString()} total</span>
        <span>{(total - minted).toLocaleString()} available</span>
      </div>
    </div>
  );
}
