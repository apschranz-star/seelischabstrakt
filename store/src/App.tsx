import {Theme} from '@astryxdesign/core/theme';
import {Page} from './components/Page';
import {ShopProvider, type ShopData} from './lib/shop';
import {UiProvider} from './lib/ui';
import {seelischTheme} from './theme/seelisch';

/* The page itself is the carpet: the theme's dark mode. Paper surfaces switch
   to its light mode where they begin (components/Paper.tsx). */
export function App({initial}: {initial: ShopData}) {
  return (
    <ShopProvider initial={initial}>
      <UiProvider>
        <Theme theme={seelischTheme} mode="dark">
          <Page />
        </Theme>
      </UiProvider>
    </ShopProvider>
  );
}
