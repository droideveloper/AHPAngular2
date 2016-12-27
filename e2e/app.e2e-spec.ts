import { BoilerWorkspacePage } from './app.po';

describe('boiler-workspace App', function() {
  let page: BoilerWorkspacePage;

  beforeEach(() => {
    page = new BoilerWorkspacePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
