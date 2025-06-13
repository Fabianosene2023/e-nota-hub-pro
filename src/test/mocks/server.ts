
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  rest.post('*/rest/v1/*', (req, res, ctx) => {
    return res(ctx.json({ data: [] }));
  }),
  rest.get('*/rest/v1/*', (req, res, ctx) => {
    return res(ctx.json({ data: [] }));
  })
);
