import DraggableMenuItem from "./draggableMenuItem";
import { useState } from "react";
import { Menu, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// 主组件
const DraggableMenu = () => {
    const [menuItems, setMenuItems] = useState([
        { key: '1', label: 'Menu 1' },
        { key: '2', label: 'Menu 2' },
        { key: '3', label: 'Menu 3' },
    ]);

    // 处理菜单项顺序
    const moveMenuItem = (dragIndex, hoverIndex) => {
        const updatedItems = [...menuItems];
        const [draggedItem] = updatedItems.splice(dragIndex, 1);
        updatedItems.splice(hoverIndex, 0, draggedItem);
        setMenuItems(updatedItems);
    };

    // 更新 label
    const updateLabel = (index, newLabel) => {
        const updatedItems = [...menuItems];
        updatedItems[index].label = newLabel;
        setMenuItems(updatedItems);
    };

    // 新增菜单项
    const [newMenuItemLabel, setNewMenuItemLabel] = useState('');
    const addMenuItem = () => {
        if (newMenuItemLabel.trim()) {
            const newKey = newMenuItemLabel; // 生成新的唯一key
            const newItem = { key: newKey, label: newMenuItemLabel };
            setMenuItems([...menuItems, newItem]);
            setNewMenuItemLabel(''); // 清空输入框
        }
    };

    // 删除菜单项
    const deleteMenuItem = (index) => {
        const updatedItems = [...menuItems];
        updatedItems.splice(index, 1); // 删除对应索引的项
        setMenuItems(updatedItems);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Menu mode="inline">
                {menuItems.map((item, index) => (
                    <Menu.Item key={item.key}>
                        <DraggableMenuItem
                            item={item}
                            index={index}
                            moveMenuItem={moveMenuItem}
                            updateLabel={updateLabel}
                            onDelete={deleteMenuItem} // 删除功能
                        />
                    </Menu.Item>
                ))}
            </Menu>
            {/* 新增菜单项区域 */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                <Input
                    placeholder="新增列表"
                    value={newMenuItemLabel}
                    onChange={(e) => setNewMenuItemLabel(e.target.value)}
                    onPressEnter={addMenuItem} // 按下回车键时新增
                    style={{ marginLeft: '8px', width: '200px' }}
                    variant="borderless"
                />
            </div>
        </DndProvider>
    );
};

export default DraggableMenu  