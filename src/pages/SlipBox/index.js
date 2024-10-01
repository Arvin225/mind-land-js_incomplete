import { Dropdown, Flex } from "antd"
import SlipEditor from "./components/SlipEditor";
import { fetchGetAllCards, fetchGetTags, setCards } from "@/store/modules/slipBoxStore";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CardList from "./components/CardList";
import PathBar from "./components/PathBar";
import SortMenu from "./components/SortMenu";
import RightSider from "./components/RightSider";
import SearchBar from "./components/SearchBar";
import _ from "lodash";
import { getTagAPI, getTagByTagNameAPI, patchCardAPI, patchTagAPI, postCardAPI, postTagAPI } from "@/apis/slipBox";
import { Bounce, toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import { compile } from "html-to-text";
import usePathItems from "./hooks/usePathItems";
import handleCardCountZero from "./functions/handleCardCountZero";
import getCardsByTagId from "./functions/getCardsByTagId";

function SlipBox() {
    const dispatch = useDispatch()
    const { pathItems, buildPathItems } = usePathItems()
    useEffect(() => {
        dispatch(fetchGetAllCards())
        dispatch(fetchGetTags())
    }, [])
    // 得到cards、tags的loading状态
    const { loadingCards, loadingTags } = useSelector(state => state.slipBox)
    // 得到store里的cards tags
    const { cards, tags } = useSelector(state => state.slipBox)

    // 处理编辑器输入框提交
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
            // const probTagNames = contentWithText.split(' ') 

            // 过滤去重出标签
            const tagNames = _.uniq(probTagNames.filter(item => _.startsWith(item, '#') && item !== '#'))

            // 定义card的标签数组，标签存库结束后该数组也收集完毕
            const cardTags = []
            // 定义叶子标签数组，标签存库结束后该数组也收集完毕
            const leafTags = []

            // 保存标签到数据库的函数
            async function saveTag(name) {
                // 1.1 判断当前标签及其祖先标签是否存在
                const splitNames = name.split('/') // 去除“#”再按“/”分割
                let cid
                try {
                    for (let i = splitNames.length; i > 0; i--) {
                        const tagName = splitNames.slice(0, i).join('/') // 取前i个分割的name以“/”组成各父级标签的tagName（或当前标签的tagName）

                        let tag
                        try {
                            // 数据库查询该标签 //todo 或许数据库拉取所有tag（或store里保存的所有tag）再比对会更规范些？
                            const res = await getTagByTagNameAPI(tagName)

                            tag = await res.data[0]
                        } catch (error) {
                            toast.error('提交失败，请稍后重试')
                            console.error('Error: ', error)
                        }

                        // 1.1.1 存在则将cid添加到children（如果为叶子标签则cid为空）
                        if (tag) {
                            // 存在的是叶子标签则收集到cardTags和leafTags就好了
                            if (!cid) {
                                cardTags.push(tag.id)
                                leafTags.push(tag)
                                // 不再向前遍历
                                return
                            }

                            // 不是叶子标签时添加子标签的id到children属性中
                            tag.children.push(cid)
                            try {
                                // 将当前标签的 id 设置到子标签的 parent 属性中
                                await patchTagAPI({ id: cid, parent: tag.id })
                                // 将修改保存到数据库
                                await patchTagAPI(tag)

                                // 不再向前遍历
                                return
                            } catch (error) {
                                toast.error('提交失败，请稍后重试')
                                console.error('Error: ', error)
                            }

                            // 1.1.2 不存在则创建（将cardCount置为0，将子标签的id添加到children，将当前标签的id设置到子标签的parent中）
                        } else {
                            try {
                                const newTag = { tagName: tagName, children: [], cardCount: 0, cards: [] }
                                // 非叶子标签则将子标签的id添加到children属性中
                                cid && (newTag.children.push(cid))
                                // 新增到数据库
                                const res = await postTagAPI(newTag)

                                const tag = await res.data
                                const id = await tag.id

                                // 将当前标签的 id 设置到子标签的 parent 属性中
                                cid && await patchTagAPI({ id: cid, parent: id })

                                // 如果是叶子标签则收集到cardTags和leafTags
                                if (!cid) {
                                    cardTags.push(id)
                                    leafTags.push(tag)
                                }

                                // 1.1.2.1 将当前标签的id存放到cid 
                                cid = id
                                /* // 再查回来 
                                const res = await getTagByTagNameAPI(tagName) */
                            } catch (error) {
                                toast.error('提交失败，请稍后重试')
                                console.error(`${tagName} Error: `, error)
                            }
                        }
                    }
                } catch (error) {
                    toast.error('提交失败，请稍后重试')
                    console.error('For loop splitNames error', error)
                }
            }

            // 修改标签的 cardCount + 1 的函数
            async function increaseCardCount(uniqAllTagNames) {
                const promiseList = [];
                for (let i = 0; i < uniqAllTagNames.length; i++) {
                    const name = uniqAllTagNames[i];
                    // 获取当前标签
                    promiseList.push(await getTagByTagNameAPI(name)); //todo 或许可以saveTag里先收集tag再按id去重，或许直接遍历去重后的tags就好了，这里getTag就不需要了
                }
                /* uniqAllTagNames.forEach(async name => {
                    // 获取当前标签
                    promiseList.push(await getTagByTagNameAPI(name))
                }) */
                Promise.all(promiseList).then(async (resList) => {
                    const promiseList = [];
                    for (let i = 0; i < resList.length; i++) {
                        const id = await resList[i].data[0].id;
                        const cardCount = await resList[i].data[0].cardCount;
                        // 提交cardCount+1
                        promiseList.push(await patchTagAPI({ id: id, cardCount: cardCount + 1 }));
                    }
                    /* resList.forEach(async res => {
                        const id = await res.data[0].id
                        const cardCount = await res.data[0].cardCount
                        // 提交cardCount+1
                        promiseList.push(await patchTagAPI({ id: id, cardCount: cardCount + 1 }))
                    }) */
                    return Promise.all(promiseList);
                }).catch(error => {
                    toast.error('提交失败，请稍后重试');
                    console.error('Error: ', error);
                });
            }

            // 保存 card 的函数
            async function saveCard(contentWithHtml, contentWithText, cardTags) {
                const currentDateTime = dayjs().format('YYYY-MM-DD HH:mm'); // 格式化当前时间
                return await postCardAPI(
                    {
                        content: contentWithHtml,
                        builtTime: currentDateTime,
                        statistics: {
                            builtTime: currentDateTime,
                            updateTime: currentDateTime,
                            words: contentWithText.length
                        },
                        tags: cardTags,
                        del: false
                    }
                )
                /* try {
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
                    );
                    // 4.更新store (cards、tags) 
                    // 更新store-tags
                    dispatch(fetchGetTags());
                    // todo 判断添加的card的tag是否是在当前路径下，是则拉取cards
                    dispatch(fetchGetCards());
                    // 清空输入框
                    editor.clear();
                } catch (error) {
                    toast.error('提交失败，请稍后重试');
                    console.error('Error: ', error);
                } */
            }

            // 将新增的 card 的 id 添加到叶子标签中的函数
            async function addCardIdIntoTag(tags, cardId) {
                const promiseList = []
                for (let i = 0; i < tags.length; i++) {
                    const tag = tags[i];
                    promiseList.push(await patchTagAPI({ id: tag.id, cards: [...tag.cards, cardId] }))
                }
                return Promise.all(promiseList)
            }

            const uniqAllTagNames = []
            const preTagNames = []
            // 1.遍历标签，将标签存到tags表
            for (let i = 0; i < tagNames.length; i++) {
                const name = tagNames[i].slice(1) // 去除“#”
                // 将标签保存到tags表（不计数）
                await saveTag(name)

                // 收集去除“#”的叶子标签
                uniqAllTagNames.push(name) // 单独收集叶子标签是为了提高性能，已经去重了便不必再去重

                const splitNames = name.split('/') // 分离
                for (let j = splitNames.length - 1; j > 0; j--) {
                    preTagNames.push(splitNames.slice(0, j).join('/')) // 组合父级标签名并收集
                }
            }
            // 2.将所有标签（包括父级标签）去重后提交cardCount+1的修改
            // 去重父级标签
            const uniqPreTagNames = _.uniq(preTagNames)
            // 合并去重后的叶子及父级标签
            uniqAllTagNames.push(...uniqPreTagNames)
            // 2.1 提交cardCount+1
            increaseCardCount(uniqAllTagNames).then(async resList => {
                // 3.将id与html文本一起存到cards表
                saveCard(contentWithHtml, contentWithText, cardTags).then(async res => {
                    // 4.将当前卡片的id保存到其所有叶子标签中
                    addCardIdIntoTag(leafTags, res.data.id).then(resList => {
                        // 5.更新store (cards、tags) 
                        // 更新store-tags
                        dispatch(fetchGetTags());
                        // todo 判断添加的card的tag是否是在当前路径下，是则拉取cards
                        dispatch(fetchGetAllCards());
                        // 6.清空输入框
                        editor.clear();
                    }).catch(error => {
                        toast.error('提交失败，请稍后重试')
                        console.error('addCardIdIntoTag Error: ', error);
                    })
                }).catch(error => {
                    toast.error('提交失败，请稍后重试')
                    console.error('saveCard Error: ', error);
                })
            }).catch(error => {
                toast.error('提交失败，请稍后重试')
                console.error('plusCardCount Error: ', error);
            })
        }
    }


    const [selectedKey, setSelectedKey] = useState('')
    // 处理标签树标签的选中
    const handleTagSelected = async (keys) => {
        const tagId = keys[0]
        // 手动设置选中
        setSelectedKey(tagId)

        // 选中的是全部卡片则：
        if (!tagId) {
            // 拉取全部卡片
            dispatch(fetchGetAllCards())
            // 更新路径栏
            buildPathItems('')
            return
        }

        // 获取当前标签下的卡片
        const cards = await getCardsByTagId(tagId)
        // 更新store
        dispatch(setCards(cards))

        // 2.更新路径栏
        const tag = tags.find(tag => tag.id === tagId) //todo 或许从数据库查保险些
        buildPathItems(tagId, tag.tagName)

        /* getTagAPI(tagId).then(async res => { //todo 或许可以从store中查
            // 1.拉取所选标签的及其后代标签的卡片更新store
            const tag = res.data
            // 收集当前标签及其后代标签的id
            const allTagId = [tagId]
            // 孩子标签
            allTagId.push(...tag.children)
            // todo 后代标签


            // 获取卡片
            const promiseList = []
            for (let i = 0; i < allTagId.length; i++) {
                const tagId = allTagId[i];
                promiseList.push(await getCardsAPI(tagId)) //! 无法_like模糊匹配
            }
            const allCard = []
            Promise.all(promiseList).then(resList => {
                resList.forEach(res => {
                    allCard.push(...res.data)
                })

                const uniqAllCard = []
                // 有后代标签则对卡片去重（同一张卡片有可能既有当前标签又有后代标签，会被查出多次）
                resList.length > 1
                    ? uniqAllCard.push(...(_.uniqBy(allCard, 'id')))
                    : uniqAllCard.push(...allCard)

                // 更新store-cards
                dispatch(setCards(uniqAllCard))

            }).catch(error => {
                toast.error('操作失败，请稍后重试')
                console.error('Error: ', error);
            })

            // 2.更新路径栏
            const tagName = tag.tagName
            buildPathItems(tagName)

        }).catch(error => {
            toast.error('操作失败，请稍后重试')
            console.error('Error: ', error);
        }) */
    }


    let cid
    const deletedTagIds = []
    const decreasedTagIds = []
    // 卡片计数-1的函数 
    async function decreaseCardCount(id) {
        // 递归终止条件：id为空或减过
        if (!id || decreasedTagIds.includes(id)) return

        const res = await getTagAPI(id)
        const tag = res.data
        const pid = tag.parent

        // 业务逻辑
        if (tag.cardCount === 1) {
            // 保存id
            cid = id
            // 卡片数量只有1则删除当前标签
            await handleCardCountZero(id)
            deletedTagIds.push(id)
        } else {
            // 走到这表示上一级标签是最后一个卡片数量为1的标签（或者卡片数量不止1），则本标签将cid从children属性中删除
            let children
            if (cid) {
                children = _.without(tag.children, cid)
                //cid置为空
                cid = ''
            }
            // 将计数-1
            await patchTagAPI({ id: tag.id, cardCount: tag.cardCount - 1, children })
            decreasedTagIds.push(tag.id)
        }

        // 递归
        await decreaseCardCount(pid)
    }

    async function handleCardDelete(id, tagIds) {
        try {
            // 将del置为true、tags置为空
            await patchCardAPI({ id, del: true, tags: [] })

            for (let i = 0; i < tagIds.length; i++) {
                const tid = tagIds[i];
                // 向前遍历卡片的标签的所有父级，将计数-1
                await decreaseCardCount(tid)
                // 若卡片标签没被删除则将卡片从其标签中删去
                if (!deletedTagIds.includes(tid)) {
                    const res = await getTagAPI(tid) //todo 是否可直接从store-tags中查询？
                    const tag = res.data
                    tag && await patchTagAPI({ id: tag.id, cards: _.without(tag.cards, id) })
                }
            }

            // 重新拉取卡片和标签 当前在哪个标签下就拉取哪个
            // 获得当前标签
            const currentTagId = _.last(pathItems).href

            // 若当前标签被删除则标签树选中改为全部卡片，并拉取全部卡片
            if (deletedTagIds.includes(currentTagId)) {
                setSelectedKey('')
                dispatch(fetchGetAllCards())

                // 若没被删除则重新拉取当前标签下的卡片
            } else {
                currentTagId
                    ? dispatch(setCards(await getCardsByTagId(currentTagId)))
                    : dispatch(fetchGetAllCards()) // 在全部卡片下
            }

            // 有标签被删除时，重新拉取标签树
            deletedTagIds.length && dispatch(fetchGetTags())


        } catch (error) {
            toast.error('删除失败，请稍后重试')
            console.error('Error', error);
        }
    }

    // 处理卡片菜单点击
    const onCardMenuClick = (e, id, tagIds) => {
        e.domEvent.stopPropagation()

        switch (e.key) {
            case 'edit':

                break;
            case 'pin':

                break;
            case 'detail':

                break;
            case 'comment':

                break;
            case 'delete':
                handleCardDelete(id, tagIds)
                break;
            default:
                break;
        }

    }


    /* -------------------------------------未获取到数据之前不允许进一步执行（数据拼接构造、渲染等)------------------------------------- */
    if (loadingCards || loadingTags) return
    /* -------------------------------------未获取到数据之前不允许进一步执行（数据拼接构造、渲染等)------------------------------------- */

    // 标签树数组
    const tagTrees = []
    // 初始化标记
    const tags_ = tags.map(tag => ({ ...tag, TreeBuildAccomplished: false }))

    // 标签项菜单
    const tagMenuItems = [
        { label: '置顶', key: 'pin', style: { color: '#6d6d6d' } },
        { label: '重命名', key: 'rename', style: { color: '#6d6d6d' } },
        { type: 'divider' },
        { label: '仅移除标签', key: 'delete', style: { color: '#e47571' } },
        { label: '删除标签和卡片', key: 'deleteOverCards', style: { color: '#e47571' } }
    ]

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
                title:
                    <Dropdown
                        menu={{
                            items: tagMenuItems,
                            onClick: e => { e.domEvent.stopPropagation() },
                            style: { backgroundColor: '#454545' }
                        }}
                        trigger={['contextMenu']}
                        overlayStyle={{ width: 128.18 }}>
                        <span>{_.last(tag.tagName.split('/'))}<span style={{ float: 'inline-end' }}>{tag.cardCount}</span></span>
                    </Dropdown>,
                key: tag.id,
                icon: '#',
                children: childNodes
            })
        } else {
            // 无孩子（临界值处理）：叶子节点直接返回
            tag.TreeBuildAccomplished = true // 标记为已构建
            return ({
                title:
                    <Dropdown
                        menu={{
                            items: tagMenuItems,
                            onClick: e => { e.domEvent.stopPropagation() },
                            style: { backgroundColor: '#454545' }
                        }}
                        trigger={['contextMenu']}
                        overlayStyle={{ width: 128.18 }}>
                        <span>{_.last(tag.tagName.split('/'))}<span style={{ float: 'inline-end' }}>{tag.cardCount}</span></span>
                    </Dropdown>,
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
                <Flex vertical={'true'} style={{ width: '600px' }} justify={'flex-start'} align={'center'}>
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
                        <CardList cards={cards} onCardMenuClick={onCardMenuClick} />
                    </Flex>
                </Flex>

                {/* 右侧边栏-标签树 */}
                <RightSider treeData={tagTrees} onSelect={handleTagSelected} selectedKey={selectedKey} />
            </Flex >
        </>


    )
}

export default SlipBox