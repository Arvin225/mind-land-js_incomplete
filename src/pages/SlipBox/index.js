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
import _, { forEachRight, update } from "lodash";
import { getTagByTagNameAPI, patchTagAPI, postCardAPI, postTagAPI } from "@/apis/slipBox";
import { Bounce, toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import { compile } from "html-to-text";

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

    /* 
        发送按钮
        获取编辑器输入内容
        post请求数据库
        更新store
        清空编辑区（editor.clear()）
    */
    const inputSubmit = async (editor) => {
        const contentWithHtml = editor.getHtml()
        const contentWithText = editor.getText()
        // 找出标签
        if (contentWithText) {
            // 按<p>分离
            const htmlContentArraySplitByP = contentWithHtml.split('<p>')
            // 再按<li>分离
            const htmlContentArraySplitByPAndLi = []
            htmlContentArraySplitByP.forEach(s => {
                htmlContentArraySplitByPAndLi.push(...s.split('<li>'))
            })
            // 清洗成text
            const compiledConvert = compile({
                selectors: [
                    // 配置跳过p和li标签的换行符输出
                    { selector: 'p', format: 'skip' },
                    { selector: 'li', format: 'skip' },
                ]
            })
            const textContentArraySplitByPAndLi = htmlContentArraySplitByPAndLi.map(compiledConvert)

            // 按空格分离
            const probTagNames = []
            textContentArraySplitByPAndLi.forEach(s => {
                probTagNames.push(...s.split(' '))
            })
            // 按空格分离
            // const probTagNames = contentWithText.split(' ') // todo 换行时的情况等等

            // 过滤并去重出标签
            const tagNames = _.uniq(probTagNames.filter(item => _.startsWith(item, '#')))

            // 定义card的标签数组，标签存放结束后该数组也收集完毕
            const cardTags = []

            // 保存标签到数据库的函数（不含计数）
            async function saveTag(name) {
                // 1.1 判断当前标签及其祖先标签是否存在
                const splitNames = name.split('/') // 去除“#”再按“/”分割
                let cid
                for (let i = splitNames.length; i > 0; i--) {
                    const tagName = splitNames.slice(0, i).join('/') // 取前i个分割的name以“/”组成各父级标签的tagName（或当前标签的tagName）

                    let tag
                    try {
                        // 数据库查询该标签
                        const res = await getTagByTagNameAPI(tagName)
                        tag = await res.data[0]
                    } catch (error) {
                        toast.error('提交失败，请稍后重试')
                        console.error('Error: ', error)
                    }

                    // 1.1.1 存在则将cid添加到children（如果为叶子标签则cid为空）
                    if (tag) {
                        cid && tag.children.push(cid) // 不是叶子标签时添加下一级标签的id到children
                        try {
                            await patchTagAPI(tag)
                            // 如果是叶子标签则收集到card的标签数组
                            i === splitNames.length && cardTags.push({ tagId: tag.id, tagName: tagName })

                            // 当第一个满足‘存在’的标签修改完成后，将cid置为空，后续父级标签便不再添加孩子
                            cid = ''
                        } catch (error) {
                            toast.error('提交失败，请稍后重试')
                            console.error('Error: ', error)
                        }

                        // 1.1.2 不存在则创建（将cardCount置为0，将cid添加到children）
                    } else {
                        try {
                            const newTag = { tagName: tagName, cardCount: 0, children: [] }
                            cid && (newTag.children = [cid])
                            await postTagAPI(newTag)
                            // 再查回来 // todo 暂时这样写，后续后端实现回传
                            const res = await getTagByTagNameAPI(tagName)
                            const id = await res.data[0].id
                            // 如果是叶子标签则收集到card的标签数组
                            i === splitNames.length && cardTags.push({ tagId: id, tagName: tagName })
                            // 1.1.2.1 得到其id，存放到cid，遍历上一级标签时添加 
                            cid = id
                        } catch (error) {
                            toast.error('提交失败，请稍后重试')
                            console.error(`${tagName} Error: `, error)
                        }
                    }
                }
            }

            const uniqLeafTagNames = []
            const preTagNames = []
            // 1.遍历标签，将标签存到tags表
            for (let i = 0; i < tagNames.length; i++) {
                const name = tagNames[i].slice(1) // 去除“#”
                // 将标签保存到tags表（无计数）
                await saveTag(name)

                uniqLeafTagNames.push(name)

                const splitNames = name.split('/') // 分离
                for (let j = splitNames.length - 1; j > 0; j--) {
                    preTagNames.push(splitNames.slice(0, j).join('/')) // 组合父级标签名并收集
                }
            }
            // 2.将所有标签（包括父级标签）去重后挨个提交cardCount+1
            // 去重父级标签
            const uniqPreTagNames = _.uniq(preTagNames)
            // 合并去重后的叶子及父级标签
            const uniqAllTagNames = uniqLeafTagNames.concat(uniqPreTagNames)
            // 开始提交cardCount+1
            const promiseList = []
            for (let i = 0; i < uniqAllTagNames.length; i++) {
                const name = uniqAllTagNames[i];
                // 获取当前标签
                promiseList.push(await getTagByTagNameAPI(name))
            }
            /* uniqAllTagNames.forEach(async name => {
                // 获取当前标签
                promiseList.push(await getTagByTagNameAPI(name))
            }) */
            Promise.all(promiseList).then(async resList => {
                const promiseList = []
                for (let i = 0; i < resList.length; i++) {
                    const id = await resList[i].data[0].id;
                    const cardCount = await resList[i].data[0].cardCount
                    // 提交cardCount+1
                    promiseList.push(await patchTagAPI({ id: id, cardCount: cardCount + 1 }))
                }
                /* resList.forEach(async res => {
                    const id = await res.data[0].id
                    const cardCount = await res.data[0].cardCount
                    // 提交cardCount+1
                    promiseList.push(await patchTagAPI({ id: id, cardCount: cardCount + 1 }))
                }) */
                Promise.all(promiseList).then(async resList => {
                    // 3.将id与html文本一起存到cards表
                    const currentDateTime = dayjs().format('YYYY-MM-DD HH:mm') // 格式化当前时间
                    try {
                        await postCardAPI(
                            {
                                content: contentWithHtml,
                                builtTime: currentDateTime,
                                statistics: {
                                    builtTime: currentDateTime,
                                    updateTime: currentDateTime,
                                    words: contentWithText.length
                                },
                                tags: cardTags
                            }
                        )
                        // 4.更新store (cards、tags) 
                        // 更新store-tags
                        dispatch(fetchGetTags())
                        // todo 判断添加的card的tag是否是在当前路径下，是则拉取cards
                        dispatch(fetchGetCards())
                        // 清空输入框
                        editor.clear()
                    } catch (error) {
                        toast.error('提交失败，请稍后重试')
                        console.error('Error: ', error);
                    }

                }).catch(error => {
                    toast.error('提交失败，请稍后重试')
                    console.error('Error: ', error);
                })
            }).catch(error => {
                toast.error('提交失败，请稍后重试')
                console.error('Error: ', error);
            })



        }
    }


    /* -------------------------------------未获取到数据之前不允许进一步执行（数据拼接构造、渲染等)------------------------------------- */
    if (loadingCards || loadingTags) return
    /* -------------------------------------未获取到数据之前不允许进一步执行（数据拼接构造、渲染等)------------------------------------- */

    // 标签树数组
    const tagTrees = []
    // 初始化标记
    const tags_ = tags.map(tag => ({ ...tag, TreeBuildAccomplished: false }))

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
            <ToastContainer position="top-center"
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
                        <SlipEditor inputSubmit={inputSubmit} />
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