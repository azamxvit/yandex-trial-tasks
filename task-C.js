const uniqArrayItemGenerator = (array, path) => {
  const visited = new Set();
  const uniqueIndexes = [];
  let index = 0;

  const getValueByPath = (obj, path) => {
    if (!path) return obj;
    let value = obj;
    const tokens = path.match(/[^.[\]()]+|\(\)|\[\d+\]/g);

    for (let token of tokens) {
      if (token === "()") {
        if (typeof value === "function") {
          value = value();
        } else {
          return undefined;
        }
      } else if (token.startsWith("[")) {
        const idx = parseInt(token.slice(1, -1));
        value = Array.isArray(value) || typeof value === "string" ? value[idx] : undefined;
      } else {
        value = value?.[token];
      }

      
      if (value === undefined) break;
    }

    return value;
  };

  
  const next = () => {
    while (index < array.length) {
      const val = getValueByPath(array[index], path);
      const key = JSON.stringify(val);
      const curr = index++;
      if (!visited.has(key)) {
        visited.add(key);
        uniqueIndexes.push(curr);
        return { done: false, value: curr };
      }
    }

    return { done: true, value: uniqueIndexes };
  };

  return { next };
};

module.exports = uniqArrayItemGenerator;
