import { TestWindow } from '@stencil/core/testing';
import { FavePage } from './fave-page';

describe('fave-page', () => {
  it('should build', () => {
    expect(new FavePage()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLFavePageElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [FavePage],
        html: '<fave-page></fave-page>'
      });
    });

    // See https://stenciljs.com/docs/unit-testing
    {cursor}

  });
});
