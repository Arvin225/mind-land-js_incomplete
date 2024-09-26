import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from '@/App';
import { Provider } from 'react-redux';
import store from './store';
import { ConfigProvider, theme } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
      components: {
        Tree: {
          titleHeight: 35.980
        }
      }
    }}>
    <Provider store={store}><App /></Provider>
  </ConfigProvider>

);

