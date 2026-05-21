import Hero from '../components/Hero.jsx'
import CategoryCard from '../components/CategoryCard.jsx'
import LatestUpdates from '../components/LatestUpdates.jsx'
import { categories } from '../data/categories.js'
import Seo from '../components/Seo.jsx'

export default function HomePage({ onNavigate }) {
  return (
    <>
      <Seo title="Home" description="NTE Community Database home for Neverness to Everness characters, weapons, modules, vehicles, builds, tier lists, codes, and news." />
      <Hero onNavigate={onNavigate} />

      <section aria-label="Categories" className="mt-2">
        <div className="dense-grid grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              title={cat.title}
              description={cat.description}
              accent={cat.accent}
              icon={cat.icon}
              status={cat.status}
              onOpen={() => onNavigate?.(cat.id)}
            />
          ))}
        </div>
      </section>

      <LatestUpdates />
    </>
  )
}
