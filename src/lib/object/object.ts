// , K extends keyof T ??
function mapFromArray<T>(arr: T[], prop: string): Record<string, T> {
  return arr.reduce((map, obj) => {
    map[obj[prop]] = obj;
    return map;
  }, {});
}

export interface Delta<T> {
  deleted: T[];
  added: T[];
  changed: T[];
}

export function getDelta<T>(
  o: T[],
  n: T[],
  prop: string,
  compareFn: (o: T, n: T) => boolean,
): Delta<T> {
  const delta: Delta<T> = {
    added: [],
    changed: [],
    deleted: [],
  };

  const mapOld = mapFromArray(o, prop);
  const mapNew = mapFromArray(n, prop);

  for (const id of Object.keys(mapOld)) {
    if (!mapNew[id]) {
      delta.deleted.push(mapOld[id]);
    } else if (!compareFn(mapOld[id], mapNew[id])) {
      delta.changed.push(mapNew[id]);
    }
  }

  for (const id of Object.keys(mapNew)) {
    if (!mapOld[id]) {
      delta.added.push(mapNew[id]);
    }
  }

  return delta;
}
