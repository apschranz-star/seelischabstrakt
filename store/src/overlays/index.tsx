/* Everything that opens on top of the page. One at a time (lib/ui.tsx). */
import {useUi} from '../lib/ui';
import {Menu} from './Menu';

export default function Overlays() {
  const {overlay} = useUi();
  if (!overlay) return null;
  switch (overlay.type) {
    case 'menu':
      return <Menu />;
    default:
      return null;
  }
}
