import React, { useState } from 'react';
import { Input } from 'antd';
import { useDrag, useDrop } from 'react-dnd';

// 定义拖拽类型
const ItemType = 'MENU_ITEM';

// 可拖拽的菜单项
const DraggableMenuItem = ({ item, index, moveMenuItem, updateLabel }) => {
  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover(draggedItem) {
      if (draggedItem.index !== index) {
        moveMenuItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(item.label);

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleLabelUpdate = () => {
    updateLabel(index, label);
    setIsEditing(false);
  };

  return (
    <div ref={(node) => drag(drop(node))}>
      {isEditing ? (
        <Input
          value={label}
          onChange={handleLabelChange}
          onBlur={handleLabelUpdate}
          onPressEnter={handleLabelUpdate}
        />
      ) : (
        <span onDoubleClick={() => setIsEditing(true)}>{label}</span>
      )}
    </div>
  );
};

export default DraggableMenuItem;