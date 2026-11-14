/* A legal text as a sheet: imprint, privacy, terms, withdrawal notice,
   shipping, the EU notice on the legal guarantee, US buyers, accessibility. */
import {Button} from '@astryxdesign/core/Button';
import {useShop} from '../lib/shop';
import {useUi} from '../lib/ui';
import type {LegalKind} from '../lib/types';
import {LegalText} from '../legal/LegalText';
import {Sheet} from './Sheet';

export function LegalSheet({kind}: {kind: LegalKind}) {
  const {t} = useShop();
  const {close} = useUi();
  return (
    <Sheet title={t('legal.' + kind)} width={820} onClose={close}>
      <LegalText kind={kind} />
      <div className="form-actions start" style={{marginTop: 20}}>
        <Button label={t('order.print')} variant="secondary" onClick={() => window.print()} />
      </div>
    </Sheet>
  );
}
