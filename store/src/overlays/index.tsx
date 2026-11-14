/* Everything that opens on top of the page. One at a time (lib/ui.tsx). */
import '../styles/overlays.css';
import {useUi} from '../lib/ui';
import {ContactSheet} from './ContactSheet';
import {LegalSheet} from './LegalSheet';
import {Menu} from './Menu';
import {OrderSheet} from './OrderSheet';
import {PhotoViewer} from './PhotoViewer';
import {WithdrawSheet} from './WithdrawSheet';
import {WorkSheet} from './WorkSheet';

export default function Overlays() {
  const {overlay} = useUi();
  if (!overlay) return null;
  switch (overlay.type) {
    case 'menu':
      return <Menu />;
    case 'work':
      return <WorkSheet key={overlay.id} id={overlay.id} index={overlay.index} />;
    case 'photo':
      return <PhotoViewer id={overlay.id} index={overlay.index} />;
    case 'order':
      return <OrderSheet key={overlay.id + overlay.variant.label} id={overlay.id} variant={overlay.variant} />;
    case 'legal':
      return <LegalSheet key={overlay.kind} kind={overlay.kind} />;
    case 'withdraw':
      return <WithdrawSheet />;
    case 'contact':
      return <ContactSheet subject={overlay.subject} />;
    default:
      return null;
  }
}
