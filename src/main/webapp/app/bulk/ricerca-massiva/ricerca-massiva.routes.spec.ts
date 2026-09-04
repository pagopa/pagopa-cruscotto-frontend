import ricercaMassivaRoutes from './ricerca-massiva.routes';

describe('ricercaMassivaRoutes', () => {
  it('lazy-loads the list component on the empty path', async () => {
    const route = ricercaMassivaRoutes.find(r => r.path === '');
    expect(route).toBeDefined();

    const { RicercaMassivaComponent } = await import('./list/ricerca-massiva.component');
    const component = await route!.loadComponent!();
    expect(component).toBe(RicercaMassivaComponent);
  });

  it('lazy-loads the create component on the "new" path', async () => {
    const route = ricercaMassivaRoutes.find(r => r.path === 'new');
    expect(route).toBeDefined();
    expect(route!.canActivate).toBeDefined();

    const { RicercaMassivaCreateComponent } = await import('./create/ricerca-massiva-create.component');
    const component = await route!.loadComponent!();
    expect(component).toBe(RicercaMassivaCreateComponent);
  });

  it('no longer exposes the removed instance detail route', () => {
    const route = ricercaMassivaRoutes.find(r => r.path === ':id/view');
    expect(route).toBeUndefined();
  });
});
