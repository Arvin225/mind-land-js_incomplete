import React, { useEffect, useState } from 'react';
// 图标
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CheckCircleOutlined,
    EditOutlined,
    AppstoreOutlined,
    CommentOutlined,
    ContainerOutlined,
    InboxOutlined,
    ForkOutlined,
    ProfileOutlined,
    AuditOutlined
} from '@ant-design/icons';

import { Button, Layout, Input, Menu, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { fetchToDoListNames } from '@/store/modules/toDoStore';
import { postToDoListNameAPI } from '@/apis/layout';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import ListName from '../ToDo/components/ListName';

const { Header, Sider, Content } = Layout;


function Container() {

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const location = useLocation()

    // 处理菜单点击后的路由跳转
    const navigate = useNavigate()
    const handleMenuClick = ({ key }) => {
        // if (key === '新建列表') {
        //     return
        // }
        navigate(`/${key}`)
    }

    const dispatch = useDispatch()

    // 异步请求ToDo的自定义列表
    useEffect(() => {
        dispatch(fetchToDoListNames())
    }, [dispatch])

    // 获取loading
    const { loadingToDoListNames } = useSelector(state => state.toDo)
    // 获取ToDo的自定义列表
    const { toDoListNames } = useSelector(state => state.toDo)


    // 新增列表  
    // const [isEditing, setIsEditing] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const addToDoListName = (e) => {
        e.stopPropagation() // 阻止事件冒泡，以免触发父级菜单选中事件
        if (inputValue.trim()) {
            // 添加到数据库
            postToDoListNameAPI(inputValue).then(res => {
                // 成功 重新请求列表名 刷新store 重渲染
                dispatch(fetchToDoListNames())
                // 清空输入框
                setInputValue('');
                // setIsEditing(false)
            }).catch(err => {
                // 失败 提示用户
                toast.error('新增失败，请稍后重试')
            })
        }
    };

    if (loadingToDoListNames) {
        return
    }

    return (
        <>
            <ToastContainer position="top-left"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ minHeight: '100vh' }}>
                    <div className="demo-logo-vertical" />
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                            float: 'right'
                        }}
                    />
                    <Menu
                        theme="light"
                        mode="inline"
                        defaultSelectedKeys={[location.pathname === '/' ? 'home' : location.pathname.substring(1)]}
                        onClick={handleMenuClick}
                        items={[
                            {
                                key: 'ai',
                                icon: <CommentOutlined />,
                                label: 'AI',
                            },
                            {
                                key: 'home',
                                icon: <AppstoreOutlined />,
                                label: 'Home',
                            },
                            {
                                type: 'group',
                                children: [
                                    {
                                        key: 'todo',
                                        icon: <CheckCircleOutlined />,
                                        label: '待办',
                                        children: [
                                            {
                                                key: 'todo/all',
                                                // icon: <UploadOutlined />,
                                                label: '全部',
                                                style: { fontSize: '12px' }
                                            },
                                            {
                                                key: 'todo/star',
                                                // icon: <UploadOutlined />,
                                                label: '星标',
                                                style: { fontSize: '12px' }
                                            },
                                            {
                                                key: 'todo/done',
                                                // icon: <UploadOutlined />,
                                                label: '已完成',
                                                style: { fontSize: '12px' }
                                            },
                                            {
                                                key: 'todo/bin',
                                                // icon: <UploadOutlined />,
                                                label: '回收站',
                                                style: { fontSize: '12px' }
                                            },
                                            { type: 'divider' },

                                            ...(toDoListNames.map(item => ({
                                                key: `todo/${item.id}`,
                                                // icon: <UploadOutlined />,
                                                label: <ListName item={item} />,
                                                style: { fontSize: '12px' }
                                            }))),

                                            {
                                                type: 'group',
                                                label: (// isEditing ? 
                                                    (<Input
                                                        style={{ fontSize: '12px' }}
                                                        placeholder="新增列表"
                                                        value={inputValue}
                                                        onChange={e => setInputValue(e.target.value)}
                                                        // onBlur={() => { inputValue && setInputValue(''); setIsEditing(false) }}
                                                        onBlur={() => { inputValue && setInputValue('') }}
                                                        // onFocus={() => setInputValue('无标题列表')}
                                                        onPressEnter={addToDoListName} // 按下回车键时新增
                                                        variant="borderless"
                                                    />)
                                                    // : (<span onClick={(e) => { e.stopPropagation(); setIsEditing(true) }}>{'新增列表'}</span>)
                                                ),
                                            }
                                        ]
                                    },
                                    {
                                        key: 'draft',
                                        icon: <EditOutlined />,
                                        label: '稿纸',
                                    },
                                    {
                                        key: 'mindmap',
                                        icon: <ForkOutlined />,
                                        label: '脑图',
                                    }
                                ]
                            },
                            {
                                type: 'group',
                                children: [
                                    {
                                        key: 'slipbox',
                                        icon: <ContainerOutlined />,
                                        label: '卡片笔记',
                                    },
                                    {
                                        key: 'diary',
                                        icon: <AuditOutlined />,
                                        label: '日记',
                                    },
                                    {
                                        key: 'note',
                                        icon: <ProfileOutlined />,
                                        label: '大纲笔记',
                                    },
                                ]
                            },
                            {
                                type: 'group',
                                children: [
                                    {
                                        key: 'marklist',
                                        icon: <InboxOutlined />,
                                        label: '剪藏',
                                    }
                                ]
                            }


                        ]}
                    />
                </Sider>
                <Content
                    style={{
                        // marginLeft: '10px',
                        // marginRight: '10px',
                        minHeight: 280,
                        background: colorBgContainer,
                        // borderRadius: borderRadiusLG,
                    }}
                >
                    {/* 路由出口 */}
                    <Outlet />

                </Content>

                {/* <Layout>
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                        }}
                    >

                    </Header>
                    
                </Layout> */}

            </Layout>

        </>
    )
}

export default Container