import { Checkbox, Tag, Typography } from "antd"
import { StarOutlined } from "@ant-design/icons"

function ToDoItem({ id, content, done, star, del }, tag) {
    return (
        <div className="todo-item">
            <Checkbox className="checkBox" />
            <Typography.Text className="textArea" />
            <StarOutlined className="star" />
            <Tag />
        </div>
    )
}

export default ToDoItem