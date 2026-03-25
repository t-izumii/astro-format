import Picture from '@/components/ui/picture';

export default function Header() {
  return (
    <header className="l-header" data-scope="l-header">
      <div className="_inner">
        <h1 className="_logo">
          <Picture
            img={{
              src: 'https://picsum.photos/600/400',
              alt: 'Panorama',
              width: 600,
              height: 400,
            }}
            width="100"
          />
        </h1>
        <nav className="_nav">
          <ul className="_navList">
            <li>
              <a href="">WORK</a>
            </li>
            <li>
              <a href="">ABOUT</a>
            </li>
            <li>
              <a href="">SERVICE</a>
            </li>
            <li>
              <a href="">NEWS</a>
            </li>
            <li>
              <a href="">HOW WE WORK</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
