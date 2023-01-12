const DATAID_KEY = "data_id";
const PARENT_KEY = "parent_id";
const DISPLAY_KEY = "name";

const NodeData = {
  nodeData: {
    id: "root",
    topic: "Mind Elixir",
    root: true,
    children: [
      {
        topic: "What is Minde Elixir",
        id: "bd4313fbac40284b",
        direction: 0,
        expanded: true,
        children: [
          {
            topic: "A mind map core",
            id: "beeb823afd6d2114",
            tags: ["E() function return"],
            children: [
              { topic: "删除", id: "bd4313fbac40284b" },
              { topic: "添加", id: "bd4313fbac40284b" },
            ],
          },
          { topic: "Free", id: "c1f068377de9f3a0" },
          { topic: "Open-Source", id: "c1f06d38a09f23ca" },
          {
            topic: "Use without JavaScript framework",
            id: "c1f06e4cbcf16463",
            expanded: true,
            children: [],
          },
          {
            topic: "Use in your own project",
            id: "c1f1f11a7fbf7550",
            children: [
              {
                topic: "import MindElixir from 'mind-elixir'",
                id: "c1f1e245b0a89f9b",
              },
              {
                topic: "new MindElixir({...}).init(data)",
                id: "c1f1ebc7072c8928",
              },
            ],
          },
          {
            topic: "Easy to use",
            id: "c1f0723c07b408d7",
            expanded: true,
            children: [
              {
                topic: "Use it like other mind map application",
                id: "c1f09612fd89920d",
              },
            ],
          },
        ],
      },
      {
        topic: "Basics",
        id: "bd1b66c4b56754d9",
        direction: 0,
        expanded: true,
        children: [
          { topic: "tab - Create a child node", id: "bd1b6892bcab126a" },
          { topic: "enter - Create a sibling node", id: "bd1b6b632a434b27" },
          { topic: "del - Remove a node", id: "bd1b983085187c0a" },
        ],
      },
    ],
    expanded: true,
  },
  linkData: {},
};

export const buildMindTreeData = (treeData, urlList) => {
  const dps = (treeData, level) => {
    return {
      id: treeData[DATAID_KEY].value,
      topic: treeData[DISPLAY_KEY].value,
      root: level === 0 ? true : false,
      expanded: !!treeData.children?.length,
      children: treeData.children
        ? treeData.children.map((node) => dps(node, level + 1))
        : undefined,
      hyperLink: urlList[level]
        ? urlList[level] + `&dataId=${treeData[DATAID_KEY].value}`
        : undefined,
      detail: treeData,
    };
  };

  if (!treeData) {
    return {
      nodeData: {},
      linkData: {},
    };
  }

  return {
    nodeData: dps(treeData, 0),
    linkData: {},
  };
};

export const computeDataSource = (data, dataSource = []) => {
  return data.map((arr, index) =>
    arr.reduce(
      (acc, item) => {
        acc[item.label] = item.value;
        return acc;
      },
      {
        record: dataSource[index],
      }
    )
  );
};

export const computeTreeData = (dataSource, urlList = []) => {
  const idMapping = dataSource.reduce((acc, el, i) => {
    acc[el[DATAID_KEY].value] = i;
    return acc;
  }, {});

  let root;
  dataSource.forEach((el) => {
    // 判断根节点
    if (el[PARENT_KEY].value === null || el[PARENT_KEY].value === undefined) {
      root = el;
      return;
    }
    // 用映射表找到父元素
    const parentEl = dataSource[idMapping[el[PARENT_KEY].value]];
    // 把当前元素添加到父元素的`children`数组中
    parentEl.children = [...(parentEl.children || []), el];
  });

  return buildMindTreeData(root, urlList);
};

export default NodeData;
