import Picture from '../../ui/picture';
import Button from '../../ui/button';
import Kv from './kv';
import Feature from './feature';
import Project from './project';

export default function Pages() {
  return (
    <div>
      <Kv />
      <Feature />
      <Project />
    </div>
  );
}
