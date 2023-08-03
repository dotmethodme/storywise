export function undefinedValuesToNull<T>(obj: T): T {
  const newObj = { ...obj };
  for (const key in newObj) {
    if (newObj[key] === undefined) {
      // @ts-ignore
      newObj[key] = null;
    }
  }
  return newObj;
}
