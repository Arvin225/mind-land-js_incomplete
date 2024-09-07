import React, { useEffect, useState } from 'react';

// 图标
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    CheckCircleOutlined,
    EditOutlined,
    BookOutlined,
    AppstoreOutlined,
    CommentOutlined,
    ContainerOutlined,
    HomeOutlined,
    InboxOutlined,
    FileTextOutlined,
    ForkOutlined,
    ProfileOutlined,
    AuditOutlined,
    PartitionOutlined
} from '@ant-design/icons';

import { Button, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomToDoList } from '@/store/modules/customToDoListStore';

const { Header, Sider, Content } = Layout;


function Container() {

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 处理菜单点击后的路由跳转
    const navigate = useNavigate()
    const handleMenuClick = ({ key }) => {
        if (key === 'home') {
            key = ''
        }
        navigate(`/${key}`)
    }

    const dispatch = useDispatch()
    // 获取ToDo的自定义列表
    const { customToDoList } = useSelector(state => state.customToDoList)
    // 异步请求ToDo的自定义列表
    useEffect(() => {
        dispatch(fetchCustomToDoList())
    }, [dispatch])

    return (
        <>
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
                        defaultSelectedKeys={['home']}
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
                                                key: 'todo',
                                                // icon: <UploadOutlined />,
                                                label: '全部',
                                                style: { fontSize: '12px' }
                                            },
                                            {
                                                key: 'todo/星标',
                                                // icon: <UploadOutlined />,
                                                label: '星标',
                                                style: { fontSize: '12px' }
                                            },
                                            {
                                                key: 'todo/已完成',
                                                // icon: <UploadOutlined />,
                                                label: '已完成',
                                                style: { fontSize: '12px' }
                                            },
                                            {
                                                key: 'todo/回收站',
                                                // icon: <UploadOutlined />,
                                                label: '回收站',
                                                style: { fontSize: '12px' }
                                            },
                                            { type: 'divider' },
                                            ...customToDoList,
                                            {
                                                key: '新建列表',
                                                disabled: true,
                                                label: '+新建列表',
                                                style: { fontSize: '12px' },
                                                type: ''
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
                <Layout>
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                        }}
                    >

                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >

                        {/* 其他组件路由出口 */}
                        <Outlet />

                    </Content>
                </Layout>
            </Layout>

        </>
    )
}

export default Container