import { Breadcrumb, Dropdown, Input, Flex, List, Card, Menu, Tree } from "antd"
import { DownOutlined, EllipsisOutlined } from "@ant-design/icons"
import Sider from "antd/es/layout/Sider"
import VirtualList from 'rc-virtual-list'
import SlipEditor from "./components/SlipEditor";

const { Search } = Input

function SlipBox() {

    const cards = [{
        id: '1',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    }, {
        id: '2',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    }, {
        id: '3',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    }, {
        id: '4',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    }, {
        id: '5',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    }, {
        id: '6',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    }, {
        id: '7',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    }, {
        id: '8',
        content: 'this is a slip',
        builtTime: '2024-09-20 22:15',
        statistics: { builtTime: '2024-09-20 22:15', updateTime: '2024-09-20 22:15', words: '11' },
        tagId: '3e5b',
        tagName: 'match/line'
    },]

    const treeData = [
        {
            title: 'tag1',
            key: '1',
            icon: '#',
            children: [{
                title: 'tag1-1',
                key: '1-1',
                icon: '#',
                isLeaf: true
            }]
        },
        {
            title: 'tag2',
            key: '2',
            icon: '#',
            isLeaf: true
        },
        {
            title: 'tag3',
            key: '3',
            icon: '#',
            isLeaf: true,
        },
    ];

    const cardMenuItems = [
        {
            key: 'edit',
            label: '编辑'
        },
        {
            key: 'pin',
            label: '置顶'
        },
        { type: 'divider' },
        {
            key: 'detail',
            label: '查看详情'
        },
        {
            key: 'comment',
            label: '批注'
        },
        {
            key: 'delete',
            label: '删除'
        },
        { type: 'divider' },
        {
            key: 'words',
            label: '字数'
        },
        {
            key: 'b-time',
            label: '创建时间'
        },
        {
            key: 'u-time',
            label: '最后编辑'
        }
    ];

    return (
        <>
            <Flex horizontal={'true'} gap={20} justify="center">
                <Flex vertical={'true'} style={{ width: '600px', border: '1px solid #40a9ff' }} justify={'flex-start'} align={'center'}>
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
                    <Flex style={{ width: '100%', paddingTop: '10px', paddingBottom: '10px' }} justify="center">
                        <SlipEditor />
                    </Flex>
                    <Flex style={{ width: '100%' }}>
                        <List split={false} style={{ width: '100%' }}>
                            <VirtualList data={cards} height={766.81} itemHeight={95.2} itemKey={'id'}>
                                {item => (
                                    <List.Item key={item.id} style={{ padding: '5px 0' }}>
                                        <Card style={{ width: '100%', backgroundColor: '#38393c' }} bordered={false}>
                                            <Flex justify="space-between">
                                                <div>{item.builtTime}</div>
                                                <Dropdown
                                                    menu={{ items: cardMenuItems, onClick: (e) => { } }}
                                                    placement="bottom"
                                                    overlayStyle={{ width: 180 }}
                                                >
                                                    <EllipsisOutlined />
                                                </Dropdown>
                                            </Flex>
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
                    <Tree treeData={[{
                        title: '全部标签',
                        key: '0',
                        icon: '#',
                        children: treeData
                    }]} showLine={true} showIcon={true} />
                </Sider>
            </Flex >
        </>


    )
}

export default SlipBox