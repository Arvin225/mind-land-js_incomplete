import { Input, Flex } from "antd"
import SlipEditor from "./components/SlipEditor";
import { fetchGetCards, fetchGetTags } from "@/store/modules/slipBoxStore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CardList from "./components/CardList";
import PathBar from "./components/PathBar";
import SortMenu from "./components/SortMenu";
import RightSider from "./components/RightSider";
import SearchBar from "./components/SearchBar";
import _ from "lodash";

function SlipBox() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGetCards())
        dispatch(fetchGetTags())
    }, [])
    // 得到cards、tags的loading状态
    const { loadingCards, loadingTags } = useSelector(state => state.slipBox)
    // 得到store里的cards tags
    const { cards, tags } = useSelector(state => state.slipBox)


    /* -------------------------------------未获取到数据之前不允许进一步执行（数据拼接构造、渲染等)------------------------------------- */
    if (loadingCards || loadingTags) return
    /* -------------------------------------未获取到数据之前不允许进一步执行（数据拼接构造、渲染等)------------------------------------- */

    // 标签树数组
    const tagTrees = []
    // 初始化标记
    const tags_ = tags.map(tag => ({ ...tag, TreeBuildAccomplished: false }))
    console.log(tags_);

    // 构建标签树的函数
    function buildTagTree(tag) {
        // 递归终止条件：已完成标签树的构建
        if (tag.TreeBuildAccomplished) {
            // 查找该标签树的索引
            const tempTreeIndex = tagTrees.findIndex(tree => tree.key === tag.id)
            // 获得该标签树
            const tempTree = tagTrees[tempTreeIndex]
            // 删除该标签树
            tagTrees.splice(tempTreeIndex, 1)
            return tempTree
        }

        const children = tag.children
        // 有孩子
        if (children.length) {
            const childNodes = []
            children.forEach(cid => {
                const ctag = tags_.find(tag => tag.id === cid) // todo 后续看是否可优化
                //递归
                childNodes.push(buildTagTree(ctag))
            })

            // 标记当前tag为已构建标签树
            tag.TreeBuildAccomplished = true

            // 业务逻辑
            return ({
                title: _.last(tag.tagName.split('/')),
                key: tag.id,
                icon: '#',
                children: childNodes
            })
        } else {
            // 无孩子（临界值处理）：叶子节点直接返回
            tag.TreeBuildAccomplished = true // 标记为已构建
            return ({
                title: _.last(tag.tagName.split('/')),
                key: tag.id,
                icon: '#',
                isLeaf: true
            })
        }
    }

    // 开始构建
    tags_.forEach(tag => {
        if (!tag.TreeBuildAccomplished) tagTrees.push(buildTagTree(tag))
    })

    // 路径项
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
                <RightSider treeData={tagTrees} />
            </Flex >
        </>


    )
}

export default SlipBox