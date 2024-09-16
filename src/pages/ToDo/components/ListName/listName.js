import { Dropdown, Modal } from "antd"
import { ExclamationCircleFilled } from "@ant-design/icons"
import { deleteToDoListNameAPI } from "@/apis/layout"
import { useDispatch } from "react-redux"
import { fetchToDoListNames, setToDoListNames } from "@/store/modules/toDoListStore"
import { Bounce, ToastContainer, toast } from "react-toastify"
import { getToDoListAPI, patchToDoItemAPI, patchToDoItemByListIdAPI } from "@/apis/toDo"

const { confirm } = Modal

function ListName({ item: { id, listName } }) {

    const dispatch = useDispatch()
    // 右键菜单项
    const items = [
        { label: '编辑', key: 'edit' },
        { label: '删除', key: 'delete' }
    ]

    // 编辑操作
    const editList = () => {

    }

    // 展示编辑窗口
    const showEditWindow = () => {
        confirm({
            title: `编辑 ${listName} 列表`,
            content: `该列表下的所有任务也将被删除`,
            okText: '确定',
            okType: 'default',
            cancelText: '取消',
            onOk() {
                // 开启异步加载样式
                editList() //等待
                // 结束加载样式
            },
            onCancel() {
            },
        });
    }


    // 删除列表操作
    const deleteList = async () => {
        // 请求数据库：任务也一块儿删了 // todo 应当后端用事务确保一致性
        // 先删任务
        getToDoListAPI({ listId: id }).then(res => {
            // （获取列表）成功 开始删除
            // 依次发送修改请求 // todo 将就一下，有后端了后端做
            const promiseList = []
            res.data.forEach(item => {
                promiseList.put(patchToDoItemAPI({ id: item.id, del: true, listId: undefined, listName: undefined }))
            })
            Promise.all(promiseList).then(resList => {
                // 任务都删除成功，删列表
                deleteToDoListNameAPI(id).then(res => {
                    // 成功 重新渲染数据
                    dispatch(fetchToDoListNames())
                    // todo 如果刚好选中了当前列表，删除后应该选中紧邻的上一个列表（上一个没有就选中紧邻的下一个列表）
                }).catch(err => {
                    // 失败 提示用户
                    toast.error('删除失败，请稍后重试')
                })
            }).catch(err => {
                // （删除任务）失败 提示用户
                toast.error('删除失败，请稍后重试')
            })
        }).catch(err => {
            // （获取列表）失败 提示用户
            toast.error('删除失败，请稍后重试')
        })


    }

    // 展示删除确认框
    const showDeleteConfirm = (listName) => {
        confirm({
            title: `删除 ${listName} 列表？`,
            icon: <ExclamationCircleFilled />,
            content: `该列表下的所有任务也将被删除`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: deleteList,
            onCancel() {
            },
        });
    };


    // 处理右键菜单点击
    const handleContextMenuClick = (e) => {
        e.domEvent.stopPropagation()
        switch (e.key) {
            case 'edit':
                showEditWindow()
                break;
            case 'delete':
                showDeleteConfirm(listName)
                break;
            default:
                break;
        }
    }


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
            <Dropdown menu={{ items, onClick: handleContextMenuClick }} trigger={['contextMenu']}>
                <div>{listName}</div>
            </Dropdown>
        </>

    )
}

export default ListName