import { Flex, Space } from "antd"
import Sider from "antd/es/layout/Sider"

function SlipBox() {

    return (
        <>
            <Flex horizontal gap={20} justify="center">
                <Flex vertical style={{ width: '600px', border: '1px solid #40a9ff' }} justify={'flex-start'} align={'center'}>
                    <div className="topBar">
                        <div className="left">
                            <div>location</div>
                            <div>sorter</div>
                        </div>
                        <span className="search">
                            <div>searchInput</div>
                            <div style={{ display: "none" }}>filter</div>
                        </span>
                    </div>
                    <div className="input">inputZone</div>
                    <div className="memos">cardsZone</div>
                </Flex>
                <Sider className='tagTree' width={260} style={{ minHeight: '100vh', border: '1px solid #40a9ff' }} theme="light" />
            </Flex>
        </>


    )
}

export default SlipBox