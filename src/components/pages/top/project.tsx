import Picture from '@/components/ui/picture';

export default function Project() {
  return (
    <div className="p-project" data-scope="p-project">
      <div
        className="_thumb js-webglThumb"
        data-texture="https://picsum.photos/600/400"
      >
        <Picture
          img={{
            src: 'https://picsum.photos/600/400',
            alt: '',
            width: 600,
            height: 400,
          }}
          width="400"
        />
      </div>

      <ul className="_list">
        <li className="_item">
          <a className="_link" href="">
            TEST
          </a>
        </li>
        <li className="_item">
          <a className="_link" href="">
            TEST
          </a>
        </li>
        <li className="_item">
          <a className="_link" href="">
            TEST
          </a>
        </li>
        <li className="_item">
          <a className="_link" href="">
            TEST
          </a>
        </li>
        <li className="_item">
          <a className="_link" href="">
            TEST
          </a>
        </li>
        <li className="_item">
          <a className="_link" href="">
            TEST
          </a>
        </li>
        <li className="_item">
          <a className="_link" href="">
            TEST
          </a>
        </li>
        <li className="_item">
          <a className="_link" href="">
            TEST
          </a>
        </li>
        <li className="_item">
          <a className="_link" href="">
            TEST
          </a>
        </li>
      </ul>
    </div>
  );
}
