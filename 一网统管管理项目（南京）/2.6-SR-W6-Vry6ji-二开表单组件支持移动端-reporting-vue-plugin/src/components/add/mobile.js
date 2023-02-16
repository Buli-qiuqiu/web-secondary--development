import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from 'antd';
import { useMemoizedFn } from 'ahooks';
import Map from '../Map';

import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";

const Add = (props) => {
    const { onChange } = props
    const Event_Center_getName = () => {
        return `${props.formConfig?.form_name}-${props.component.columnStyle.title}`;
    };
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newData, setNewData] = useState();
    const triggerEventCenter = async (targetValue) => {
        await window.eventCenter.triggerEventNew({
            objectId: props.formConfig?.id,
            componentId: props.component.id,
            type: "report",
            event: "change",
            payload: {
                value: targetValue,
                childIndex: props.index,
            },
        });
    };
    const [initData, setInitData] = useState()
    useEffect(() => {
        if (props?.data) {
            setNewData(props.data)
            setInitData(props.data)
        }
    }, [props.data])
    const do_EventCenter_getValue = useMemoizedFn(() => {
        console.log(newData);
        return {
            value: newData ? JSON.parse(newData)?.type === 'point' ? JSON.parse(newData)?.list?.[0]?.areaId : '' : '',
        };
    });
    useDelegator(
        props.component.id,
        { Event_Center_getName, do_EventCenter_getValue },
        eventActionDefine,
        props.formConfig?.id,
        props.child_id,
        props.index,
        { eventCenter: window.eventCenter, componentCenter: window.componentCenter }
    );
    const handleSubmit = useMemoizedFn(() => {
        triggerEventCenter({ newData });
        setInitData(newData)
        onChange && onChange(newData)
        setIsModalOpen(false)
    })

    return <>
        <div
            style={{ display: 'flex', alignItems: 'center', width: 50, height: 50 }}
            onClick={() => {
                setIsModalOpen(true)
            }}
        >
            {
                !isModalOpen &&
                <Map
                    {...props}
                    styles={{ width: '50px', height: '50px', cursor: 'pointer' }}
                    isDetail={true}
                    zoom={10}
                    data={initData || props?.data}
                    updateData={(value) => {
                        setNewData(value)
                    }}
                />
            }
        </div>

        <Modal
            width={800}
            onOk={
                handleSubmit
            }
            maskClosable={false}
            okText={'确定'}
            cancelText={'取消'}
            closable={false}
            title="选择区域或定位点"
            wrapClassName="map_modal"
            visible={isModalOpen}
            destroyOnClose
            onCancel={() => {
                setNewData(initData)
                setIsModalOpen(false)
            }}
        >
            <Map
                {...props}
                data={initData || props?.data}
                keyNode='mobile'
                updateData={(value) => {
                    setNewData(value)
                }}
            />
        </Modal>

    </>;
};
Add.propTypes = {
    data: PropTypes.string,
};
export default Add;



