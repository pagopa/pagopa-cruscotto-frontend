import ricercaMassivaRoutes from './ricerca-massiva.routes';

describe('ricercaMassivaRoutes', () => {
  it('lazy-loads the list component on the empty path', async () => {
    const route = ricercaMassivaRoutes.find(r => r.path === '');
    expect(route).toBeDefined();
    expect(route!.pathMatch).toBe('full');

    const { RicercaMassivaComponent } = await import('./list/ricerca-massiva.component');
    const component = await route!.loadComponent!();
    expect(component).toBe(RicercaMassivaComponent);
  });

  it('lazy-loads the CSV upload component on the "csv" path', async () => {
    const route = ricercaMassivaRoutes.find(r => r.path === 'csv');
    expect(route).toBeDefined();
    expect(route!.canActivate).toBeDefined();

    const { RicercaMassivaCsvUploadComponent } = await import('./csv-upload/ricerca-massiva-csv-upload.component');
    const component = await route!.loadComponent!();
    expect(component).toBe(RicercaMassivaCsvUploadComponent);
  });

  it('lazy-loads the create component on the "new" path', async () => {
    const route = ricercaMassivaRoutes.find(r => r.path === 'new');
    expect(route).toBeDefined();
    expect(route!.canActivate).toBeDefined();

    const { RicercaMassivaCreateComponent } = await import('./create/ricerca-massiva-create.component');
    const component = await route!.loadComponent!();
    expect(component).toBe(RicercaMassivaCreateComponent);
  });

  it('exposes the instance detail page on the id route', async () => {
    const route = ricercaMassivaRoutes.find(r => r.path === ':id/view');
    expect(route).toBeDefined();
    expect(route!.canActivate).toBeDefined();
    expect(route!.resolve?.detailInstance).toBeDefined();

    const { RicercaMassivaCreateComponent } = await import('./create/ricerca-massiva-create.component');
    const component = await route!.loadComponent!();
    expect(component).toBe(RicercaMassivaCreateComponent);
  });
});
