import { NavLink } from "react-router-dom";

interface CardProps {
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  redirect?: string;
  accentFrom?: string;
  accentTo?: string;
  badges?: string[];
}

function Card({
  title = "Placeholder title",
  subtitle,
  description = "Lorem Ipsum",
  image = "",
  redirect = "/",
  accentFrom = "#000000",
  accentTo = "#ffffff",
}: CardProps) {
  const isEmoji = image && image.length <= 2;

  return (
    <NavLink to={redirect} className="block h-full">
      <div
        className="
        group h-full rounded-[1.75rem] border border-stone-200/80 bg-white/95 overflow-hidden
        shadow-[0_20px_60px_-36px_rgba(15,23,42,0.45)]
        transition-all duration-200 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_24px_80px_-38px_rgba(15,23,42,0.55)]"
      >
        {image &&
          (isEmoji ? (
            <div className="flex aspect-video w-full items-center justify-center bg-stone-50 text-5xl">
              {image}
            </div>
          ) : (
            <img
              src={image}
              alt={title}
              className="aspect-video w-full object-cover"
            />
          ))}

        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
          }}
        />

        <div className="flex h-full flex-col p-4">
          <p className="mb-1 font-serif text-xl font-semibold text-stone-900 transition-colors group-hover:text-black">
            {title}
          </p>

          {subtitle && (
            <p className="mb-3 font-serif text-sm italic text-stone-500">
              {subtitle}
            </p>
          )}

          {description && (
            <p className="line-clamp-4 text-sm leading-relaxed text-stone-600">
              {description}
            </p>
          )}
        </div>
      </div>
    </NavLink>
  );
}

interface CardGridProps {
  children: React.ReactNode;
}

export function CardGrid({ children }: CardGridProps) {
  return (
    <div className="pb-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {children}
      </div>
    </div>
  );
}

export default Card;

// ─── Exemples ────────────────────────────────────────────────────
//
// Avec image (emoji) :
// <RPGCard
//   image="⚔️"
//   title="Guerrier"
//   subtitle="Maître des armes"
//   description="Combattant robuste spécialisé dans les armures lourdes."
//   accentFrom="#E24B4A"
//   accentTo="#7a1e1e"
// />
//
// Avec image (URL) :
// <RPGCard
//   image="https://example.com/mage.jpg"
//   title="Mage"
//   subtitle="Tisseur d'arcane"
//   description="Lance des sorts dévastateurs depuis les lignes arrières."
//   accentFrom="#7F77DD"
//   accentTo="#3C3489"
// />
//
// Sans image :
// <RPGCard
//   title="Elfe"
//   subtitle="Ancien & gracieux"
//   description="Vision nocturne et affinité naturelle pour la magie."
//   accentFrom="#1D9E75"
//   accentTo="#04342C"
// />
