import { Card, Checkbox, Input, Tag, Typography } from "antd"
import { StarFilled, StarOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { patchToDoItemAPI } from "@/apis/toDo"

function ToDoItem({ item, tag }) { //只有在 全部 中时，tag才有值（所属列表名）

    const { id, content, done, star, del } = item

    const [star_, setStar_] = useState(star)

    // 处理星标点击
    const handleStarClick = () => {
        // 提交修改到数据库

        // 失败：恢复旧状态

        // 成功：修改星标状态
        setStar_(!star_) //异步
    }

    // 星标状态更新后将修改同步到数据库
    useEffect(() => {
        patchToDoItemAPI({ id: id, star: star_ })
    }, [star_])

    // 处理输入框失焦
    let content_ = content
    const handleBlur = (e) => {

        //内容发生改变则提交修改到数据库
        if (e.target.value !== content_) {
            patchToDoItemAPI({ id: id, content: e.target.value })
            // 修改失败，提示失败，并复原旧值

            // 修改成功，保存本次修改的内容，以供下次比对使用
            content_ = e.target.value
        }
    }

    // 处理check事件
    const [disabled, setDisabled] = useState(false)
    const [visible, setVisible] = useState(done ? done : !done)
    const handleCheck = (e) => {
        // 表明在非‘已完成’和‘删除’列表，执行了提交完成的操作
        if (e.target.checked) { // 值得注意的是，此代码块中的两个函数均为异步函数，会按顺序执行
            // 禁用checkbox
            setDisabled(true)
            // 提交数据库修改done
            patchToDoItemAPI({ id: id, done: true }).then(res => {
                // 修改成功，卸载当前todo项
                setVisible(!visible)
            }).catch(err => {
                // 修改失败，提示用户
                console.log('网络异常，提交失败，请稍后再试');
                // 回滚check状态
                e.target.checked = false
                // 取消checkBox的禁用
                setDisabled(false)
            })


            // 表明在已完成列表中，执行的撤销完成的操作
        } else {
            // 禁用checkbox
            setDisabled(true)
            // 提交数据库修改done
            patchToDoItemAPI({ id: id, done: false }).then(() => {
                // 修改成功，卸载当前todo项
                setVisible(!visible)
            }).catch(err => {
                // 修改失败，提示用户
                console.log('网络异常，提交失败，请稍后再试');
                // 回滚check状态
                e.target.checked = true
                // 取消checkBox的禁用
                setDisabled(false)
            })

        }

    }

    return (
        <>
            {
                visible &&
                <Card type="inner" style={{ marginTop: 6 }
                } size="default" >
                    <Checkbox className="checkBox" style={{ marginLeft: 6 }} onChange={handleCheck} disabled={disabled} />
                    <Input defaultValue={content} variant="borderless" style={{ marginLeft: 12, minWidth: '50%', maxWidth: '90%' }} onBlur={(e) => handleBlur(e)} onPressEnter={(e) => e.target.blur(e, true)} />
                    <div style={{ float: 'right' }} >
                        <Tag bordered={false} style={{ marginLeft: 20, marginRight: 20 }} >{tag}</Tag>
                        {/* 条件渲染：根据星标状态切换icon样式 */}
                        {star_ ? <StarFilled className="star" style={{ marginRight: 6 }} onClick={handleStarClick} />
                            : <StarOutlined className="star" style={{ marginRight: 6 }} onClick={handleStarClick} />}
                    </div>
                </Card >

            }

        </>

    )
}

export default ToDoItem