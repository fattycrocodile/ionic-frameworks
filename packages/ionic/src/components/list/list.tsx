import { Component, h } from '@stencil/core';

@Component({
  tag: 'ion-list',
  styleUrls: {
    ios: 'list.ios.scss',
    md: 'list.md.scss',
    wp: 'list.wp.scss'
  },
  host: {
    theme: 'list'
  }
})
export class List {
  render() {
    return <slot></slot>;
  }
}
