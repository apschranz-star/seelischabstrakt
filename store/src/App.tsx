import {Component, type ReactNode} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {Page} from './components/Page';
import {ShopProvider, type ShopData} from './lib/shop';
import {UiProvider} from './lib/ui';
import {seelischTheme} from './theme/seelisch';

/* If something in the page throws (bad content from the studio desk, a browser
   quirk), the visitor gets a plain page with a way to reach the studio instead
   of an empty screen. It uses no shop code on purpose: the fault may be there. */
class Guard extends Component<{email: string; children: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() {
    return {failed: true};
  }
  componentDidCatch(error: unknown) {
    console.error(error);
  }
  render() {
    if (!this.state.failed) return this.props.children;
    const de = (navigator.language || '').toLowerCase().startsWith('de');
    return (
      <main className="fail" id="top">
        <h1>seelischabstrakt</h1>
        <p>
          {de
            ? 'Hier ist etwas schiefgegangen. Lade die Seite neu oder schreib dem Atelier:'
            : 'Something went wrong here. Reload the page or write to the studio:'}{' '}
          {this.props.email && <a href={`mailto:${this.props.email}`}>{this.props.email}</a>}
        </p>
        <button type="button" onClick={() => location.reload()}>
          {de ? 'Seite neu laden' : 'Reload the page'}
        </button>
      </main>
    );
  }
}

/* The page itself is the carpet: the theme's dark mode. Paper surfaces switch
   to its light mode where they begin (components/Paper.tsx). */
export function App({initial}: {initial: ShopData}) {
  return (
    <Guard email={initial.site.legal?.email || ''}>
      <ShopProvider initial={initial}>
        <UiProvider>
          <Theme theme={seelischTheme} mode="dark">
            <Page />
          </Theme>
        </UiProvider>
      </ShopProvider>
    </Guard>
  );
}
