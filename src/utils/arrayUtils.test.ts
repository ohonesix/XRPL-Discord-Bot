import groupBy from './arrayUtils';

describe('groupBy util', () => {
  it('should group the objects by the specified property', () => {
    const objects = [
      { name: 'John', age: 20 },
      { name: 'Jane', age: 20 },
      { name: 'Jim', age: 25 },
    ];
    expect(groupBy(objects, 'age')).toEqual({
      20: [
        { name: 'John', age: 20 },
        { name: 'Jane', age: 20 },
      ],
      25: [{ name: 'Jim', age: 25 }],
    });
  });

  it('should return an empty object if objectArray is empty', () => {
    expect(groupBy([], 'age')).toEqual({});
  });
});
