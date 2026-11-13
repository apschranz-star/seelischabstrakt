/* A paper surface: label, card, sheet. Inside it the theme switches to its
   light mode, so every Astryx component reads as ink on paper. */
import type {ReactNode} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {seelischTheme} from '../theme/seelisch';

export function Paper({children}: {children: ReactNode}) {
  return (
    <Theme theme={seelischTheme} mode="light">
      {children}
    </Theme>
  );
}

/** Back onto the dark ground, for a sheet that should sit in the carpet's colours. */
export function Ground({children}: {children: ReactNode}) {
  return (
    <Theme theme={seelischTheme} mode="dark">
      {children}
    </Theme>
  );
}
