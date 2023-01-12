import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import PersonalizedForm from './PersonalizedForm';
import { message, notification, Modal } from "antd";
import errorCode from './ERROR_zh_CN.json'
// 登录接口
import { loginAccount } from "./api/asset";

const openNotification = (title, message) => {
    notification.open({
        message: title,
        description: message,
        duration: null,
    });
};

const App = ({ type, ...props }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [funstate, setFunstate] = useState({});
    // const [messageApi, contextHolder] = message.useMessage();
    const [token, setToken] = useState('');
    const submit = (params, { history }) => {
        // const submit = (params) => {
        // 执行注册/登录时会触发此方法，所有参数在 params 中
        // ...
        return new Promise((resolve, reject) => {
            //存储resolve方法到留资弹框
            setFunstate({
                stateTest: resolve, isModalFn: function () {
                    setIsModalOpen(false)
                }
            })
            let loginForm = {
                account: params.loginName,
                username: params.loginName,
                imageCode: params.imageCode,
                password: props.Encrypt && props.Encrypt(params.password),
            };
            loginAccount(loginForm)
                .then((res) => {
                    const login = {
                        success: true,
                        token: res.data.tokenInfo,
                    };
                    setToken(login)
                    //判断是否有需要跳转留资接口
                    if (res?.data?.endNodeResult?.needMessage) {
                        setIsModalOpen(true)
                    } else {
                        resolve(login);
                    }
                })
                .catch((err) => {
                    message.error(errorCode[`ERROR.${err.data.code}`] || '注册失败');
                    // if (err.data?.message == 'Wrong user name or password!') {
                    //     message.error('用户名或密码错误');
                    // } else {
                    //     message.error('图片验证码校验失败');
                    // }
                    reject(err)
                });

        });
    };
    useEffect(() => {
        console.log(props, "登录覆盖已绑定2");
        props.bindSubmit(submit); // 绑定监听方法

    }, []);
    const PcClose = () => {
        funstate?.stateTest(token);
        setIsModalOpen(false)
    }
    let Comp = () => <> <Modal title="" open={isModalOpen} width='100%' footer={null} onCancel={PcClose}>
        <PersonalizedForm funstate={funstate} token={token}></PersonalizedForm>
    </Modal></>;
    return <Comp {...props} />;
};

App.propTypes = {
    type: PropTypes.string,
    bindSubmit: PropTypes.func,
    history: PropTypes.object,
    Encrypt: PropTypes.func
};

export default App;
