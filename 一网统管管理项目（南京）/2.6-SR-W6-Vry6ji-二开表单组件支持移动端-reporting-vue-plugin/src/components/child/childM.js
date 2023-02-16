import React, { useRef, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { AimOutlined } from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import { Button, Modal } from 'antd';
import Map from '../Map';

import useDelegator from "../../UseDelegator";
import eventActionDefine from "../../msgCompConfig";

const Child = ({
    data,
    onChange,
    formConfig,
    component,
    configuration: propsConfiguration,
    theme,
    child_id,
    index,
    ...other
}) => {
    const state2 = useRef(data);
    const [state, setState] = useState();
    const [configuration, setConfiguration] = useState({});

    const [initData, setInitData] = useState()

    useEffect(() => {
        if (!state && data) {
            setState(data)
            setInitData(data)
        }
    }, [data, state])

    useEffect(() => {
        try {
            console.log(propsConfiguration);
            setConfiguration(JSON.parse(propsConfiguration));
        } catch (error) {
            console.error("configuration解析错误", error);
        }
    }, []);

    const triggerEventCenter = async (targetValue) => {
        await window.eventCenter.triggerEventNew({
            objectId: formConfig?.id,
            componentId: component.id,
            type: "report",
            event: "change",
            payload: {
                value: targetValue,
                childIndex: index,
            },
        });
    };

    const do_EventCenter_getValue = useMemoizedFn(() => {
        console.log(state2.current);
        return {
            value: state ? JSON.parse(state)?.type === 'point' ? JSON.parse(state)?.list?.[0]?.areaId : '' : '',
        };
    });

    const do_EventCenter_setValue = function ({ value }) {
        setState(value);
        // state2.current = value;
    };

    const Event_Center_getName = () => {
        return `${formConfig?.form_name}-${component.columnStyle.title}`;
    };
    const handleSubmit = useMemoizedFn(() => {
        triggerEventCenter({ state });
        setInitData(state)
        onChange && onChange(state)
        setIsModalOpen(false)
    })
    // 事件中心注册挂载
    useDelegator(
        component.id,
        { Event_Center_getName, do_EventCenter_getValue, do_EventCenter_setValue },
        eventActionDefine,
        formConfig?.id,
        child_id,
        index,
        { eventCenter: window.eventCenter, componentCenter: window.componentCenter }
    );
    const [isModalOpen, setIsModalOpen] = useState(false)
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
                    styles={{ width: '50px', height: '50px', cursor: 'pointer' }}
                    isDetail={true}
                    zoom={10}
                    onChange={onChange}
                    componentId={other.componentId}
                    data={state || data}
                    updateData={(value) => {
                        setState(value)
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
                setState(initData)
                setIsModalOpen(false)
            }}
        >
            <Map
                onChange={onChange}
                componentId={other.componentId}
                keyNode='mobile'
                data={state || data}
                updateData={(value) => {
                    setState(value)
                }}
            />
        </Modal>
    </>;
};

Child.propTypes = {
    data: PropTypes.string,
};

export default Child;
