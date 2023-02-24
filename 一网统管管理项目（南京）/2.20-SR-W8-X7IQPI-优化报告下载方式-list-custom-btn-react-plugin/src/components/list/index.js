import React, { useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom';
import PropTypes from "prop-types";
import { Row, Col, Modal, Button, message } from "antd";
import { getAssetJSONForProduct } from "./../../api/asset";
import moment from 'moment'
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas'
import { jsPDF } from "jspdf";
import "./index.less";


const List = ({ dataSource, customParams, dataId, deleteData }) => {
  const printIframe = useRef(null);
  // console.log(dataSource, customParams);
  let { type } = customParams || "";
  let { department } = customParams || "";
  let { fieldName } = customParams || "";
  let { dayUrl } = customParams || "";
  let { monUrl } = customParams || "";
  let { yearUrl } = customParams || "";
  let [iframURL, setIframURL] = useState("");
  let [title, setITitle] = useState("日报");
  let [create_time, setCreate_time] = useState("");
  let [testImg, setTestImg] = useState("");
  let [iframIsOk, setIiframIsOk] = useState(true);
  useEffect(() => {
    let time = "";
    let typeRow = "";
    let departmentRow = "";
    if (dataSource) {
      dataSource.forEach((element) => {
        if (element.title == fieldName) {
          time = element.value.value;
        }
        if (element.title == type) {
          typeRow = element.value.value;
        }
        if (element.title == department) {
          departmentRow = element.value.value;
        }
      });
    }
    if (typeRow == 1) {
      setITitle("月报");
      setIframURL(`${monUrl}&type=${typeRow}&department=${departmentRow}&createtime=${time}`);
    } else if (typeRow == 2) {
      setITitle("年报");
      setIframURL(`${yearUrl}&type=${typeRow}&department=${departmentRow}&createtime=${time}`);
    } else {
      setITitle("日报");
      setIframURL(`${dayUrl}&type=${typeRow}&department=${departmentRow}&createtime=${time}`);
    }
    handleClick();
  }, []);

  const handleClick = async () => {
    setModalVisible(true);
  };
  const printHTML = () => {
    message.loading("下载中，请稍等", [0]);
    // 系统打印
    // document.getElementById("printIframe").contentWindow.print();
    const node = ReactDOM.findDOMNode(printIframe.current.contentWindow.document.body)
    setTimeout(() => {
      printDetails(node, title);
    }, 300)
  };

  const printDetails = (ref, fileName) => {
    // const pdf = new jsPDF('I', 'mm', 'a4');
    const pdf = new jsPDF('p', 'pt', 'a4')
    let height = pdf.internal.pageSize.height;
    let pageHeightInPixels = ref.clientHeight;
    let pageHeightInMM = pageHeightInPixels / 3.78;
    let pages = pageHeightInMM / height;
    const roundOff = Number(pages.toString().split('.')[1].substring(0, 1));
    const pageNo = (roundOff > 0 ? pages + 1 : pages);
    let pageCount = pages < 1 ? 1 : Math.trunc(pageNo);
    // let imageHeight = height;
    // 生成海报
    html2canvas(ref, {
      scale: 1,
      // height: ref.offsetHeight,
      // width: ref.offsetWidth,
      useCORS: true,
    }).then((canvas) => {
      let url = canvas.toDataURL("image/png");
      setTestImg(url);
      var contentWidth = canvas.width
      var contentHeight = canvas.height
      // A4纸宽高
      var A4Width = 595.28
      // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
      var imgWidth = A4Width
      var imgHeight = A4Width / contentWidth * contentHeight
      var pageData = canvas.toDataURL('image/jpeg', 1.0)

      for (let i = 1; i <= pageCount; i++) {
        let pdfStartingHeight = height * (i - 1);
        pdf.addImage(pageData, 'JPEG', 0, -pdfStartingHeight, imgWidth, imgHeight);
        if (i < pageCount) {
          pdf.addPage();
        }
      }

      pdf.save(`${fileName}.pdf`)
      message.destroy()
    }).catch(err => {
      message.destroy()
      message.error("下载失败！", [3])
      console.log('err', err)
    })
  }

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Modal
      title={title}
      visible={modalVisible}
      footer={null}
      onCancel={() => setModalVisible(false)}
      className="tranfer-table-filter-modal"
      width="60%"
      bodyStyle={{ height: "600px" }}
    >
      <Button type="primary" onClick={printHTML} disabled={iframIsOk}>
        报告下载
      </Button>
      <iframe ref={printIframe} src={iframURL} id="printIframe" frameBorder={0} width="100%" height="95%" onLoad={() => { setIiframIsOk(false) }}></iframe>
    </Modal>
  );
};

List.propTypes = {
  isDesign: PropTypes.bool,
  tableColumns: PropTypes.array,
  modelInfo: PropTypes.object,
};

export default List;
