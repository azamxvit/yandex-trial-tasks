module.exports = function (maps) {
  const norm = maps.map(([x1, y1, x2, y2]) => [
    Math.min(x1, x2),
    Math.min(y1, y2),
    Math.max(x1, x2),
    Math.max(y1, y2),
  ]);

  const n = norm.length;
  const visited = new Array(n).fill(false);

  
  const intersects = (a, b) => {
    const [x1, y1, x2, y2] = a;
    const [x3, y3, x4, y4] = b;
    return !(x2 < x3 || x4 < x1 || y2 < y3 || y4 < y1);
  };

  
  const dfs = (i, group) => {
    visited[i] = true;
    group.push(i);
    for (let j = 0; j < n; j++) {
      if (!visited[j] && intersects(norm[i], norm[j])) {
        dfs(j, group);
      }
    }
  };

  const pages = [];

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      const group = [];
      dfs(i, group);

      
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      for (const idx of group) {
        const [x1, y1, x2, y2] = norm[idx];
        minX = Math.min(minX, x1);
        minY = Math.min(minY, y1);
        maxX = Math.max(maxX, x2);
        maxY = Math.max(maxY, y2);
      }

      pages.push({
        box: [minX, minY, maxX, maxY],
        indexes: group,
      });
    }
  }

  return pages;
};
