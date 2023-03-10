import React, { useEffect, useState } from "react";
import { Select } from "antd";
import PropTypes from "prop-types";
import { queryCountByOfficeId } from "../../api/asset.js";
const Query = (props) => {
  console.log(props, 6);
  const [selectWidth, setSelectWidth] = useState(180);
  const [officeData, setOfficeData] = useState([]);
  const [userId, setUserId] = useState("");
  const [defaultDep, setDefaultDep] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const customConfig = JSON.parse(props?.component?.customPluginConfig || "{}");
  const initComData = () => {
    console.log(props);
    queryCountByOfficeId().then((res) => {
      let message = officeData;
      message = [
        ...flatten([res.data[0].office], window.currentUser?.officeId),
      ];
      console.log(message);
      message.forEach((item) => {
        if (item.id == window.currentUser?.officeId) {
          setDefaultDep(item.name);
          handleChange(null, {
            id: item.id,
            name: item.name,
          });
        }
      });
      setOfficeData(message);
    });
    customConfig.userId && setUserId(customConfig.userId);
    customConfig.selectWidth && setSelectWidth(customConfig.selectWidth);
    if (customConfig.userId == window.currentUser?.id) {
      setIsDisable(true);
    }
  };
  const handleChange = (value, option) => {
    console.log(option);
    const { onChange } = props.queryProps;
    console.log(onChange, props.queryProps);
    onChange([
      {
        colId: props.queryProps.data.id,
        coLName:
          props.queryProps.data.componentBusinessConfigList[0].businessName,
        value: option.id,
        type: 2,
      },
    ]);
    setDefaultDep(option.name);
  };
  const flatten = (tree, id) => {
    if (id === "123456789") {
      // 如果 id 等于 '123456789'，则直接将整个树形数据转成一维数组返回
      const flatten = [];
      function traverse(node) {
        flatten.push(node);
        if (node.children) {
          node.children.forEach(traverse);
        }
      }
      tree.forEach(traverse);
      return flatten;
    }
    // 否则按照原来的逻辑进行处理
    const result = [];
    function traverse(node) {
      if (node.id === id) {
        result.push(node);
        if (node.children) {
          node.children.forEach((child) => {
            result.push(child);
            traverse(child);
          });
        }
      } else if (node.children) {
        node.children.forEach(traverse);
      }
    }
    tree.forEach(traverse);
    return result;
  };
  useEffect(() => {
    initComData();
  }, []);
  return (
    <>
      <div>
        <Select
          value={defaultDep}
          style={{
            width: Number(selectWidth),
          }}
          disabled={isDisable}
          fieldNames={{
            lable: "id",
            value: "name",
          }}
          onChange={handleChange}
          options={officeData}
        />
      </div>
    </>
  );
};

Query.propTypes = {
  data: PropTypes.string,
};

export default Query;
