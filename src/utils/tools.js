export default {
  generateRoutes(tree) {
    let arr = [];
    if (!tree.length) return arr;
    tree.forEach((item) => {
      if (item.children) {
        arr = arr.concat(this.generateRoutes(item.children));
      }
      arr.push({
        path: item.path,
        name: item.component,
        component: item.component,
        meta: {
          title: item.menuName,
        },
        menuType: item.menuType,
      });
    });
    arr = arr.filter((item) => item.menuType !== 2);
    return arr;
  },
};
