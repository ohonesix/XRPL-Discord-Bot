import sleep from './sleep';

describe('sleep util', () => {
  it('should wait for the specified number of milliseconds before resolving', async () => {
    const start = new Date();
    await sleep(100);
    const end = new Date();

    expect(end.getTime() - start.getTime()).toBeGreaterThanOrEqual(100);
  });
});
