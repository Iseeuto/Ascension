function Homepage() {
  const text = "Ascension";

  return (
    <div className="flex items-center justify-center h-2/3">
      <h1 className="font-[Vecna] font-bold text-9xl tracking-widest relative inline-block">
        <span className="inline-flex">
          {text.split("").map((letter, index) => (
            <span
              key={index}
              className="inline-block cursor-default animate-letter hover:scale-125 transition-transform duration-200 select-none"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>

        {/* barre */}
        <span
          className="absolute left-1/2 -bottom-2 w-[calc(100%+2rem)] h-1 bg-neutral-900 rounded-xs bar"
          style={{ animationDelay: "600ms" }}
        />

        {/* texte Wiki */}
        <span
          className="
    absolute left-1/2 -translate-x-1/2
    top-full mt-3
    text-6xl tracking-[0.3em]
    text-neutral-900 font-serif
    opacity-0 animate-wiki select-none
  "
          style={{ animationDelay: "900ms" }}
        >
          Wiki
        </span>
      </h1>
    </div>
  );
}

export default Homepage;
