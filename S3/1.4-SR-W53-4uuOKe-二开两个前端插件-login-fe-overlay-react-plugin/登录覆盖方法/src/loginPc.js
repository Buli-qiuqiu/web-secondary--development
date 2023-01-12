import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import PersonalizedForm from './PersonalizedForm';
import { message, notification, Modal } from "antd";
import errorCode from './ERROR_zh_CN.json'
// 登录接口
import { loginAccount, getUser, loginByPhone } from "./api/asset";

const openNotification = (title, message) => {
    notification.open({
        message: title,
        description: message,
        duration: null,
    });
};

let mobileNew = '';

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

            if (params.loginType == 'code') {
                let loginForm = {
                    captcha: params.captcha,
                    imageCode: params.imageCode,
                    loginName: params.loginName,
                    phone: params.loginName,
                    smsCode: params.captcha,
                };
                loginByPhone(loginForm)
                    .then((res) => {
                        const login = {
                            success: true,
                            token: res.data.tokenInfo,
                            // token: res.data,
                        };
                        setToken(login)
                        mobileNew = params.loginName;
                        if (res?.data?.endNodeResult?.needMessage && mobileNew) {
                            setIsModalOpen(true)
                        } else {
                            resolve(login);
                        }

                        //判断是否有需要跳转留资接口

                    })
                    .catch((err) => {
                        message.error(errorCode[`ERROR.${err.data.code}`] || '登录失败');
                        // if (err.data?.message == 'Wrong user name or password!') {
                        //     message.error('用户名或密码错误');
                        // } else if (err.data?.message == 'Mobile phone verification code error') {
                        //     message.error('短信验证码错误');
                        // } else {
                        //     message.error('图片验证码校验失败');
                        // }
                        reject(err)
                    });
            } else {
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
                        getUser().then(resp => {
                            const { data = {} } = resp;
                            const { mobile } = data;
                            mobileNew = mobile;
                            if (res?.data?.endNodeResult?.needMessage && mobile) {
                                setIsModalOpen(true)
                            } else {
                                resolve(login);
                            }
                        })
                        setToken(login)
                        //判断是否有需要跳转留资接口

                    })
                    .catch((err) => {
                        message.error(errorCode[`ERROR.${err.data.code}`] || '登录失败');
                        // if (err.data?.message == 'Wrong user name or password!') {
                        //     message.error('用户名或密码错误');
                        // } else {
                        //     message.error('图片验证码校验失败');
                        // }
                        reject(err)
                    });
            }
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

    let Comp = () => <> <Modal title="" open={isModalOpen} width='100%' footer={null} onCancel={PcClose} >
        <PersonalizedForm funstate={funstate} token={token} mobileNew={mobileNew}></PersonalizedForm>
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
