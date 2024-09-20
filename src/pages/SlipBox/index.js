import { Breadcrumb, Dropdown, Input, Flex, Space, List, Card, Typography, Menu, Tree } from "antd"
import { DownOutlined } from "@ant-design/icons"
import Sider from "antd/es/layout/Sider"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import VirtualList from 'rc-virtual-list'

const { Search } = Input

function SlipBox() {

    const cardList = [{
        id: '1',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    }, {
        id: '1',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    }, {
        id: '1',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    }]

    const treeData = [
        {
            title: 'Expand to load',
            key: '0',
            icon: '#',
            children: [{
                title: 'tag1',
                key: '0-0',
                icon: '#'
            }]
        },
        {
            title: 'Expand to load',
            key: '1',
            icon: '#'
        },
        {
            title: 'Tree Node',
            key: '2',
            icon: '#',
            isLeaf: true,
        },
    ];

    return (
        <>
            <Flex horizontal={true} gap={20} justify="center">
                <Flex vertical={true} style={{ width: '600px', border: '1px solid #40a9ff' }} justify={'flex-start'} align={'center'}>
                    <Flex justify={'space-between'} style={{ width: '100%' }}>
                        <Flex style={{ maxWidth: '60%' }} gap={10} align="center">
                            <Breadcrumb
                                style={{ fontSize: '16px', fontWeight: '700', fontFamily: ['HarmonyOS Sans SC', 'Consolas', 'Courier New', 'monospace'] }}
                                items={[
                                    {
                                        title: <a href="">全部卡片</a>,
                                    },
                                    {
                                        title: <a href="">标签1</a>,
                                    },
                                    {
                                        title: <a href="">标签1-1</a>,
                                    },
                                    {
                                        title: <a href="">标签1-1-1</a>,
                                    },

                                ]}
                            />
                            <Dropdown
                                menu={{
                                    items: [{
                                        key: 'c-asc',
                                        label: '创建时间升序'
                                    },
                                    {
                                        key: 'c-dec',
                                        label: '创建时间降序'
                                    },
                                    {
                                        key: 'e-asc',
                                        label: '编辑时间升序'
                                    },
                                    {
                                        key: 'e-dec',
                                        label: '编辑时间升序'
                                    }],
                                    selectable: true,
                                }}
                                trigger={['click']}
                            >
                                <DownOutlined onClick={(e) => e.preventDefault()} />

                            </Dropdown>
                        </Flex>
                        <Search
                            placeholder="Ctrl+K"
                            allowClear
                            onSearch={(value, _e, info) => { }}
                            size="large"
                            // variant="filled"
                            style={{
                                width: 218.182,
                            }}
                        />
                        <div style={{ display: "none" }}>filter</div>
                    </Flex>
                    <Flex style={{ width: '100%', height: '100%', paddingTop: '10px', paddingBottom: '10px' }} justify="center">
                        <ReactQuill theme="snow" style={{ width: '100%', minHeight: 97.017, height: 197.812, maxHeight: 247.273 }} />
                    </Flex>
                    <Flex style={{ width: '100%' }}>
                        <List split={false} style={{ width: '100%' }}>
                            <VirtualList data={cardList} height={633.2} itemHeight={95.2} itemKey={'id'}>
                                {item => (
                                    <List.Item>
                                        <Card style={{ width: '100%', background: '#38393c' }} bordered={false}>
                                            <div>{item.builtTime}</div>
                                            <div>{item.content}</div>
                                            <div>{'#' + item.tagName}</div>
                                        </Card>
                                    </List.Item>
                                )}
                            </VirtualList>
                        </List>
                    </Flex>
                </Flex>
                <Sider className='tagTree' width={260} style={{ minHeight: '100vh', border: '1px solid #40a9ff' }} theme="light" >
                    <Menu items={[{ key: 'all', label: '全部卡片' }]} />
                    <Tree treeData={treeData} showLine={true} showIcon={true} />
                </Sider>
            </Flex >
        </>


    )
}

export default SlipBox