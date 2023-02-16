import React, { useEffect, useState, useRef } from "react";
import * as echarts from "echarts";
import { dataSource } from "../development/mockData";
const Main = (props) => {
  const developers = process.env.REACT_APP_DEVELOPERS || "";
  const [id, setId] = useState(
    "charts" + Math.random().toFixed(6).split(".")[1]
  );
  const [width, setWdith] = useState("100%");
  const [height, setHeight] = useState("100%");
  const [number, setNumber] = useState(1);

  const initComData = () => {
    const customConfig = props?.customConfig;
    //customOptions为传统的输入框形式的配置项
    const customOptions = props.options?.externalVariables || {};
    customOptions?.width && setWdith(customOptions.width);
    customOptions?.height && setHeight(customOptions.height);
    customConfig.number && setNumber(customConfig.number);
  };
  const actionDefinitions = {
    // do_EventCenter_
  };
  const triggerEvent = (eventName, payload) => {
    props.componentId &&
      window.eventCenter?.triggerEvent(
        props.componentId,
        eventName,
        //payload需为一个object
        payload
      );
  };
  const initEcharts = (data) => {
    let options = JSON.parse(
      JSON.stringify(props.options?.externalVariables || "{}")
    );
    let 系列颜色 = options.系列颜色?.split(",") || [
      "#38AE52",
      "#F40A05",
      "#31ABEA",
    ];
    let 柱体圆角 = Number(options.柱体圆角) || 10;
    let 柱体宽度 = Number(options.柱体宽度) || 40;
    console.log(系列颜色);
    let Xdata = [];
    let seriesInfo = [];
    data[0].forEach((item, index) => {
      if (item == "name") {
        data.forEach((item2, index2) => {
          if (index2 > 0) {
            Xdata.push(item2[index]);
          }
        });
      } else {
        let message = {
          name: item,
          data: [],
        };
        seriesInfo.push(message);
        data.forEach((item2, index2) => {
          if (index2 > 0) {
            message.data.push(item2[index]);
          }
        });
      }
    });
    console.log(seriesInfo);
    const myChart = echarts.init(document.getElementById("stackingAnalyzer"));
    let option = {
      backgroundColor: "rgba(255, 255, 255, 1)",
      legend: {
        show: true,
        right: '10%',
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      xAxis: {
        type: "category",
        axisLine: {
          show: true,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          margin: 20,
        },
        data: Xdata,
      },
      yAxis: {
        type: "value",
        show: true,
        axisLine: {
          show: true,
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
          },
        },
      },
      series: [
        {
          data: seriesInfo[0].data,
          type: "bar",
          name: seriesInfo[0].name,
          stack: "one",
          barWidth: 柱体宽度,
          itemStyle: {
            borderWidth: 0,
            borderColor: "rgba(255, 255, 255, 1)", //同背景色一样
            color: 系列颜色[0],
            barBorderRadius: 柱体圆角,
          },
          emphasis: {
            itemStyle: {
              borderColor: "rgba(255, 255, 255, 1)",
            },
          },
        },
        {
          data: seriesInfo[1].data,
          type: "bar",
          name: seriesInfo[1].name,
          stack: "one", //堆叠
          barWidth: 柱体宽度,
          color: 系列颜色[1],
          itemStyle: {
            borderWidth: 0, //用border设置两个柱形图之间的间距
            borderColor: "rgba(255, 255, 255, 1)", //同背景色一样
            barBorderRadius: 柱体圆角,
          },
          emphasis: {
            itemStyle: {
              borderColor: "rgba(255, 255, 255, 1)",
            },
          },
        },
        {
          data: seriesInfo[2].data,
          type: "bar",
          name: seriesInfo[2].name,
          stack: "one", //堆叠
          barWidth: 柱体宽度,
          color: 系列颜色[2],
          itemStyle: {
            borderWidth: 0, //用border设置两个柱形图之间的间距
            borderColor: "rgba(255, 255, 255, 1)", //同背景色一样
            barBorderRadius: 柱体圆角,
          },
          emphasis: {
            itemStyle: {
              borderColor: "rgba(255, 255, 255, 1)",
            },
          },
        },
      ],
    };
    myChart.setOption(option, true);
    function debounce(func, ms = 1000) {
      let timer;
      return function (...args) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          func.apply(this, args);
        }, ms);
      };
    }
    const task = () => {
      console.log("resize");
      myChart.resize();
    };
    const debounceTask = debounce(task, 1000);
    let resizeObserver = null;
    resizeObserver = new ResizeObserver(() => {
      // 宽高等变化后需要执行的逻辑
      debounceTask();
    });
    resizeObserver.observe(document.querySelector(`#${id}`));
    window.addEventListener("resize", debounceTask);
  };
  const handleClick = () => {
    triggerEvent("click", { value: "123" });
  };
  useEffect(() => {
    props.mainInit && props.mainInit(props, setId, { ...actionDefinitions });
    initEcharts(dataSource);
  }, []);

  return (
    <>
      {/*大屏定义外层容器百分百，不可删除*/}
      <div
        id={id}
        style={{ width, height }}
        className="analyzer-secondary"
        developers={developers}
      >
        <div
          id="stackingAnalyzer"
          style={{ width: "100%", height: "100%" }}
        ></div>
        ;
      </div>
    </>
  );
};

export default Main;
