import { NavLink } from "react-router-dom";

interface CardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  redirect?: string;
  accentFrom?: string;
  accentTo?: string;
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
    <NavLink to={redirect}>
      <div
        className="
        bg-white border border-gray-200 rounded-2xl overflow-hidden
        transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:scale-105"
      >
        {/* Image ou placeholder emoji */}
        {image &&
          (isEmoji ? (
            <div className="w-full aspect-video flex items-center justify-center bg-gray-50 text-5xl">
              {image}
            </div>
          ) : (
            <img
              src={image}
              alt={title}
              className="w-full aspect-video object-cover"
            />
          ))}

        {/* Barre accent */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
          }}
        />

        {/* Corps */}
        <div className="p-3.5">
          <p className="font-serif text-xl font-semibold text-gray-900 mb-0.5">
            {title}
          </p>
          {subtitle && (
            <p className="font-serif text-xs italic text-gray-400 mb-2">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-xs text-gray-500 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${accentTo}, ${accentFrom})`,
          }}
        />
      </div>
    </NavLink>
  );
}

interface CardGridProps {
  children: React.ReactNode;
}

export function CardGrid({ children }: CardGridProps) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
