import Picture from '@/components/ui/picture';

type item = {
  src: string;
  title: string;
  category: string;
};

export default function FeatureCard({ item }: { item: item }) {
  return (
    <div className="f-featureCard" data-scope="f-featureCard">
      <div className="_thumb js-webglThumb" data-texture={item.src}>
        <Picture
          img={{
            src: item.src,
            alt: '',
            width: 600,
            height: 400,
          }}
        />
      </div>
      <div className="_title">{item.title}</div>
      <div className="_categoryWrapper">
        <span className="_category">{item.category}</span>
      </div>
    </div>
  );
}
