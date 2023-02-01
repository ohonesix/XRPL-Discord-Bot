import Sleep from './Sleep';

describe('Sleep util', () => {
  it('should wait for the specified number of milliseconds before resolving', async () => {
    const start = new Date();
    await Sleep(100);
    const end = new Date();

    expect(end.getTime() - start.getTime()).toBeGreaterThanOrEqual(100);
  });
});
