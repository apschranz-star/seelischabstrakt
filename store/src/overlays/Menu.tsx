/* The menu on a phone: the sections of the page in large type. */
import {Drawer, DrawerHeader} from '@astryxdesign/core/Drawer';
import {Link} from '@astryxdesign/core/Link';
import {useNav} from '../components/Shell';
import {useShop} from '../lib/shop';
import {useUi} from '../lib/ui';

export function Menu() {
  const {t} = useShop();
  const {close} = useUi();
  const nav = useNav();
  return (
    <Drawer isOpen onOpenChange={(open) => !open && close()} label={t('nav.menu')} side="start" width={420} padding={4}>
      <DrawerHeader title={t('nav.menu')} onOpenChange={(open) => !open && close()} />
      <nav aria-label={t('nav.main')}>
        <ul className="menu-links">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} color="inherit" type="inherit" onClick={close}>
                {t(n.key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Drawer>
  );
}
