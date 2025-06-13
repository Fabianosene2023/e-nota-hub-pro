
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer(
  http.post('*/rest/v1/*', () => {
    return HttpResponse.json({ data: [] });
  }),
  http.get('*/rest/v1/*', () => {
    return HttpResponse.json({ data: [] });
  })
);
