import { Input, Flex } from "antd"
import SlipEditor from "./components/SlipEditor";
import { fetchGetCards } from "@/store/modules/slipBoxStore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CardList from "./components/CardList";
import PathBar from "./components/PathBar";
import SortMenu from "./components/SortMenu";
import RightSider from "./components/RightSider";
import SearchBar from "./components/SearchBar";

function SlipBox() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGetCards())
    }, [])
    // 得到cards的loading状态
    const { loadingCards } = useSelector(state => state.slipBox)
    // 得到store里的cards
    const { cards } = useSelector(state => state.slipBox)

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

    const pathItems = [
        {
            title: <a href="">标签1</a>,
        },
        {
            title: <a href="">标签1-1</a>,
        },
        {
            title: <a href="">标签1-1-1</a>,
        },
    ]

    if (loadingCards) return

    return (
        <>
            <Flex horizontal={'true'} gap={20} justify="center">
                <Flex vertical={'true'} style={{ width: '600px', border: '1px solid #40a9ff' }} justify={'flex-start'} align={'center'}>
                    <Flex justify={'space-between'} style={{ width: '100%' }}>
                        <Flex style={{ maxWidth: '60%' }} gap={10} align="center">

                            {/* 路径栏 */}
                            <PathBar pathItems={pathItems} />

                            {/* 排序菜单 */}
                            <SortMenu />
                        </Flex>

                        {/* 搜索框 */}
                        <SearchBar />

                        {/* 筛选器 */}
                        <div style={{ display: "none" }}>filter</div>
                    </Flex>
                    <Flex style={{ width: '100%', paddingTop: '10px', paddingBottom: '10px' }} justify="center">

                        {/* 输入框 */}
                        <SlipEditor />
                    </Flex>
                    <Flex style={{ width: '100%' }}>

                        {/* 卡片容器 */}
                        <CardList cards={cards} />
                    </Flex>
                </Flex>

                {/* 右侧边栏-标签树 */}
                <RightSider treeData={treeData} />
            </Flex >
        </>


    )
}

export default SlipBox