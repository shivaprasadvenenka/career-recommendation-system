export default function NoResults({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="text-8xl mb-6">🔍☁️</div>
      <h2 className="font-heading text-xl font-bold text-cardtext mb-2">
        No matching careers found.
      </h2>
      <p className="text-gray-500 mb-6">Try changing your skills or filters.</p>
      {onClear && (
        <button onClick={onClear} className="btn-primary">
          Clear Filters
        </button>
      )}
    </div>
  );
}
