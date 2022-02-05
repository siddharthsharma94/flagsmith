import BaseUtils from './base/_utils'

export const Utils = {
  ...BaseUtils,
  escapeHtml(html:string) {
    if (typeof document !== 'undefined') {
      const text = document.createTextNode(html);
      const p = document.createElement('p');
      // @ts-ignore
      p.appendChild(text);
      return p.innerHTML;
    }
  },
}
