import { newE2EPage } from '@stencil/core/testing';

it('icon: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/icon/test/basic?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
