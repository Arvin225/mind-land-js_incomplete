import { Breadcrumb } from "antd"

function PathBar({ pathItems }) {

    return (
        <Breadcrumb
            style={{ fontSize: '16px', fontWeight: '700', fontFamily: ['HarmonyOS Sans SC', 'Consolas', 'Courier New', 'monospace'] }}
            items={pathItems}
        />
    )

}

export default PathBar