
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './Routes.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
//TASARIM İÇİN CURSOR KULLANILDI.
createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
);
