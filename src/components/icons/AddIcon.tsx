export default function AddIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`transition-transform duration-300 ease-in-out hover:scale-140 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="12" strokeWidth={2} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
        className="stroke-gray-400 transition-colors duration-300 hover:stroke-white"
      />
    </svg>
  );
}
