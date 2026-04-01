import Picture from '../../ui/picture';
import Button from '../../ui/button';
import Icon from '@/components/ui/icon';

export default function Pages() {
  return (
    <div>
      <h2>TOP</h2>

      <Picture
        img={{
          src: 'https://placehold.jp/150x150.png',
          alt: 'Sample Image',
          width: 600,
          height: 400,
        }}
        sp={{
          src: 'https://placehold.jp/150x150.png',
          width: 300,
          height: 200,
        }}
        width="400px"
      />

      <Icon name="arrow" width={40} height={40} />
      <Button label="test" />
    </div>
  );
}
