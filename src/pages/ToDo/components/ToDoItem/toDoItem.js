import { Card, Checkbox, Input, Tag, Typography } from "antd"
import { StarFilled, StarOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { patchToDoItemAPI } from "@/apis/toDo"

function ToDoItem({ item, tag }) { //只有在 全部 中时，tag才有值（所属列表名）

    const { id, content, done, star, del } = item

    const [star_, setStar_] = useState(star)

    // 处理星标点击
    const handleStarClick = () => {
        // 修改星标状态
        setStar_(!star_) //异步
    }

    // 星标状态更新后将修改同步到数据库
    useEffect(() => {
        patchToDoItemAPI({ id: id, star: star_ })
    }, [star_])

    let content_ = content
    // 处理输入框失焦
    const handleBlur = (e) => {
        //内容发生改变则提交修改到数据库
        if (e.target.value !== content_) {
            patchToDoItemAPI({ id: id, content: e.target.value })
            content_ = e.target.value //保存本次修改的内容，以供下次比对使用
        }
    }

    return (

        <Card type="inner" style={{ marginTop: 6 }} size="default">
            <Checkbox className="checkBox" style={{ marginLeft: 6 }} />
            <Input defaultValue={content} variant="borderless" style={{ marginLeft: 12, minWidth: '50%', maxWidth: '90%' }} onBlur={(e) => handleBlur(e)} onPressEnter={(e) => e.target.blur(e, true)} />
            <div style={{ float: 'right' }} >
                <Tag bordered={false} style={{ marginLeft: 20, marginRight: 20 }} >{tag}</Tag>
                {/* 条件渲染：根据星标状态切换icon样式 */}
                {star_ ? <StarFilled className="star" style={{ marginRight: 6 }} onClick={handleStarClick} />
                    : <StarOutlined className="star" style={{ marginRight: 6 }} onClick={handleStarClick} />}
            </div>
        </Card>

    )
}

export default ToDoItem