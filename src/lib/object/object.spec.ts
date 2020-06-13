import { mapFromArray, getDelta } from './object';
describe('object lib', () => {
  it('mapFromArray', () => {
    const title1 = 'title 1';
    const o = [
      { id: 1, title: title1 },
      { id: 2, title: 'title 2' },
      { id: 3, title: 'title 3' },
    ];

    const result = mapFromArray(o, 'title');
    expect(result).toHaveProperty(title1, o[0]);
  });

  describe('getDelta', () => {
    it('with all', () => {
      const o = [
        { id: 1, title: 'title 1' },
        { id: 2, title: 'title 2' },
        { id: 3, title: 'title 3' },
      ];

      const n = [
        { id: 1, title: 'title 1' },
        { id: 2, title: 'title updated' },
        { id: 4, title: 'title 4' },
      ];

      const result = getDelta(o, n, 'id', (o, n) => o.title === n.title);
      expect(result).toEqual({
        added: [{ id: 4, title: 'title 4' }],
        changed: [{ id: 2, title: 'title updated' }],
        deleted: [{ id: 3, title: 'title 3' }],
      });
    });
  });
});
