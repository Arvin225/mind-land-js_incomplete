import { Menu, Tree } from "antd"
import Sider from "antd/es/layout/Sider"

function RightSider({ treeData, onSelect }) {

    return (
        <Sider className='tagTree' width={260} style={{ minHeight: '100vh' }} theme="light" > {/* , border: '1px solid #40a9ff'  */}
            {/* <Menu items={[{ key: 'all', label: '全部卡片', style: { color: '#9d9d9d' } }]} onSelect={(e) => { }} /> */}
            <Tree treeData={[
                {
                    title: '全部卡片',
                    key: '',
                    style: { color: '#9d9d9d' }
                },
                {
                    title: '全部标签',
                    key: '0',
                    icon: '#',
                    children: treeData,
                    selectable: false,
                    style: { fontSize: '12px', color: '#ded1b7' }
                }]}
                showLine={true} showIcon={true} style={{ color: '#9d9d9d' }}
                onSelect={(keys) => onSelect(keys)} />
        </Sider>
    )

}

export default RightSider