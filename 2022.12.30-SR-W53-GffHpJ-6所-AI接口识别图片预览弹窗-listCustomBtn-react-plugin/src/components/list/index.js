import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Spin } from "antd";
import { queryBoatDetectAnalysis } from './../../api/asset';

import './index.less';

const List = (props) => {
  const {
    dataSource,
    customParams,
    dataId,
    deleteData,
    selectedRows
  } = props;
  console.log('props', props);
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (index) => <>{index+1}</>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    }
  ];
  const data = [
    {
      type: 'Brown',
      index: 0,
      key: "1",
      location: [38.0,299.0,11,33,455],
    },
    {
      type: 'Brown',
      index: 1,
      key: "2",
      location: [38.0, 299.0, 11, 33, 455],
    },
    {
      type: 'Brown',
      index: 2,
      key: "3",
      location: [38.0, 299.0, 11, 33, 455],
    }
  ];

  const width = customParams?.width || 600; 
  const imgKey = customParams?.imgKey || ""; 
  const imgSrc = customParams?.imgSrc;

  const [alarmUrl, setAlarmUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    handleClick();
  }, [])

  const handleClick = async () => {
    setModalVisible(true)
    // let imgLink = '[{ "uid": "rc-upload-1672729583616-2", "name": "boat94.png", "url": "/storage_area/form/1234567890/639ed170e1644bf685bba41ae98065cf.png" }]';
    let imgLink = "";
    let rows = selectedRows[0];
    Object.keys(rows).forEach(key => {
      if (key == imgSrc) {
        imgLink = JSON.parse(rows[key])[0].url
      }
    });
    try {
      const { data } = await queryBoatDetectAnalysis(imgLink);
      console.log('data', JSON.parse(data));
      let dataRes = JSON.parse(data)?.result || [];
      let tableData = dataRes.map(x=>{
        x.key = x.index.toString()
        return x;
      })
      setTableData(tableData);
      setAlarmUrl(imgLink);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  const destroyflvPlayer = () => {
    setModalVisible(false)
  }

  return (
    <Modal title="" visible={modalVisible} destroyOnClose={true} footer={null} closable={true} onCancel={destroyflvPlayer} className="tranfer-table-filter-modal" width={width}>
      <Spin size="large" spinning={loading}>
        <div className="dia_content">
          <span className="previwe">预览</span>
          <img className="event_img" src={alarmUrl} alt="" />
          <span className="previwe">信息</span>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            scroll={{
              y: 300,
            }}
          />
        </div>
      </Spin>
      {/* {  
        loading 
          ? <Spin size="large" spinning={loading} className="spinLoad"/>
        : <div className="dia_content">
            <span className="previwe">预览</span>
            <img className="event_img" src={alarmUrl} alt="" />
            <span className="previwe">信息</span>
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              scroll={{
                y: 240,
              }} 
            />
          </div>
      } */}
    </Modal>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
