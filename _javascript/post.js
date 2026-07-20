import { basic, initTopbar, initSidebar } from './modules/layouts';

import {
  loadImg,
  imgPopup,
  initClipboard,
  initToc,
  loadMermaid,
  newTabLinks
} from './modules/components';

loadImg();
initToc();
imgPopup();
initSidebar();
initClipboard();
initTopbar();
loadMermaid();
newTabLinks();
basic();
