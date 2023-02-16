import React, { useState } from "react";
import PropTypes from "prop-types";
import {Modal,Button} from 'antd';
import Map from '../Map';
const Table = ({ data, formConfig }) => {
  const [isModalOpen,setIsModalOpen] = useState(false)
  return <>
    <div 
      style={{display: 'flex',alignItems: 'center',width: 50,height: 50}} 
      onClick={()=>{
        setIsModalOpen(true)
      }}
    > 
      <Map 
        data={data ?? '{}'} zoom={10} isDetail={true} styles={{width: '50px',height: '50px',cursor: 'pointer'}}
      />
    </div>
    {isModalOpen && <Modal 
        width={800} 
        title="区域或定位点" 
        footer={null}
        open={isModalOpen} 
        onCancel={()=>setIsModalOpen(false)}
      >
        <Map data={data} isDetail={true}/>
      </Modal>
    }
  </>;
};

Table.propTypes = {
  data: PropTypes.string,
};

export default Table;
