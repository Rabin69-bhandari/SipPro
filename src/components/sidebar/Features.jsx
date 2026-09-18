function Feature({ text }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700">

      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-600">
        ✓
      </span>

      {text}

    </div>
  );
}

export default Feature