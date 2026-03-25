import FeatureCard from '@/components/features/featureCard';

export default function Feature() {
  return (
    <div className="p-feature" data-scope="p-feature">
      <div className="o-container">
        <div
          className="o-grid"
          style="--_grid-gap: 2rem; --_grid-min-size: 10rem;"
        >
          <FeatureCard
            item={{
              src: 'https://picsum.photos/600/400',
              title: 'PNRMWORK',
              category: 'PNRMWORK',
            }}
          />
          <FeatureCard
            item={{
              src: 'https://picsum.photos/600/400',
              title: 'PNRMWORK',
              category: 'PNRMWORK',
            }}
          />
          <FeatureCard
            item={{
              src: 'https://picsum.photos/600/400',
              title: 'PNRMWORK',
              category: 'PNRMWORK',
            }}
          />
        </div>
      </div>
    </div>
  );
}
