/* A sheet of paper laid over the page: the shop's frame for every dialog.
   On a phone it takes the whole screen. */
import type {ReactNode} from 'react';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {Paper} from '../components/Paper';

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  width?: number;
  /** form: a click beside the sheet does not close it once something was typed */
  purpose?: 'info' | 'form';
  onClose: () => void;
  startContent?: ReactNode;
  children: ReactNode;
}

export function Sheet({title, subtitle, width = 760, purpose = 'info', onClose, startContent, children}: Props) {
  const phone = useMediaQuery('(max-width: 720px)');
  const change = (open: boolean) => {
    if (!open) onClose();
  };
  return (
    <Paper>
      <Dialog
        isOpen
        onOpenChange={change}
        width={width}
        maxHeight="92dvh"
        variant={phone ? 'fullscreen' : 'standard'}
        purpose={purpose}>
        <DialogHeader title={title} subtitle={subtitle} onOpenChange={change} startContent={startContent} />
        <div className="sheet-body">{children}</div>
      </Dialog>
    </Paper>
  );
}
