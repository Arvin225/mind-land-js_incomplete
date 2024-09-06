import { Button, DatePicker } from 'antd'
import { RouterProvider } from 'react-router-dom'
import router from '@/router';

function App() {
  return (

    <div className="App">
      <Button>click</Button><br />
      <Button type='primary'>click</Button><br />
      <DatePicker />
      <RouterProvider router={router}></RouterProvider>
    </div>
    // </RouterProvider>
  );
}

export default App;
