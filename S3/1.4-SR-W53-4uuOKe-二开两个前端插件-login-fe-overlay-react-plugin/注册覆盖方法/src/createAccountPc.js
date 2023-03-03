import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import PersonalizedForm from './PersonalizedForm';
import { message, notification, Modal } from "antd";
import errorCode from './ERROR_zh_CN.json'
// 登录接口
import { createAccount2, createAccountWeb } from "./api/asset";

const openNotification = (title, message) => {
    notification.open({
        message: title,
        description: message,
        duration: null,
    });
};

let mobile = ''
const App = ({ type, ...props }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [funstate, setFunstate] = useState({});
    // const [messageApi, contextHolder] = message.useMessage();
    const [token, setToken] = useState('');
    const pathName = window.location.pathname.includes('/application/register')
    const generateUUID = () => {
        let d = new Date().getTime();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
    }
    const submit = (params, { history }) => {
        // const submit = (params) => {
        // 执行注册/登录时会触发此方法，所有参数在 params 中
        // // ...
        // console.log(params, '====参数');
        return new Promise((resolve, reject) => {
            //存储resolve方法到留资弹框
            setFunstate({
                stateTest: resolve, isModalFn: function () {
                    setIsModalOpen(false)
                }
            })
            if (pathName) {
                let createForm = JSON.parse(JSON.stringify(params))
                createForm.password = props.Encrypt(createForm.password)
                createForm.newPassword = props.Encrypt(createForm.newPassword)
                createAccountWeb(createForm).then(res => {
                    const login = {
                        success: true,
                        token: res.data,
                    };
                    // debugger
                    setToken(login)
                    //判断是否有需要跳转留资接口
                    if (res.orchResult && res.orchResult?.needMessage) {
                        setIsModalOpen(true)
                    } else {
                        resolve(login);
                    }
                }).catch(err => {
                    message.error(errorCode[`ERROR.${err.data.code}`] || '注册失败');

                    reject({ success: false })
                })
            } else {
                let loginForm = {
                    "id": generateUUID(),
                    "loginName": params.loginName,
                    "password": props.Encrypt && props.Encrypt(params.password),
                    "channel": "web",
                    "register_type": 0
                }
                let queryParams = {
                    code: params.captcha,
                    imageCode: params.imageCode
                }
                mobile = params.loginName
                createAccount2(loginForm, params.captcha, params.codeImage, params.imageCode)
                    .then((res) => {
                        const login = {
                            success: true,
                            token: res.data,
                        };
                        // debugger
                        setToken(login)
                        //判断是否有需要跳转留资接口
                        if (res.orchResult && res.orchResult?.needMessage) {
                            setIsModalOpen(true)
                        } else {
                            resolve(login);
                        }
                    })
                    .catch((err) => {
                        message.error(errorCode[`ERROR.${err.data.code}`] || '注册失败');
                        // if (err.data.code == 100000017) {
                        //     message.error('图片验证码校验失败');
                        // }
                        // if (err.data?.message == 'Login is already in use!') {
                        //     message.error('该用户已经注册成功');
                        // }

                        reject({ success: false })
                    });
            }


        });
    };
    useEffect(() => {
        props.bindSubmit(submit); // 绑定监听方法
        console.log("登录覆盖已绑定");
    }, []);
    const PcClose = () => {
        funstate?.stateTest(token);
        setIsModalOpen(false)
    }
    let Comp = () => <> <Modal title="" open={isModalOpen} onCancel={PcClose} width='100%' footer={null}>
        <PersonalizedForm funstate={funstate} token={token} mobile={mobile} ></PersonalizedForm>
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
