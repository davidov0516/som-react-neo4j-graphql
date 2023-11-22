import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Shipping from './pages/Shipping/Shipping';
import WaterArea from './pages/WaterArea/WaterArea';
import Charterer from './pages/Charterer/Charterer';
import Certificate from './pages/Certificate/Certificate';
import CertificateEdit from './pages/Certificate/CertificateEdit';
import Ship from './pages/Ship/Ship';
import ShipDetail from './pages/Ship/ShipDetail';
import ShipCreate from './pages/Ship/ShipCreate';
import Mariner from './pages/Mariner/Mariner';
import MarinerCreate from './pages/Mariner/MarinerCreate';
import MarinerDetail from './pages/Mariner/MarinerDetail';
import TypeOfCertificate from './pages/TypeOfCertificate/TypeOfCertificate';
import ComponentLayout from './pages/Component/Layout';
import ComponentMenu from './pages/Component/Menu';
import SelectWrapper from './pages/Component/Select/SelectWrapper';
import TabWrapper from './pages/Component/Tab/TabWrapper';
import CardWrapper from './pages/Component/Card/CardWrapper';
import ModalWrapper from './pages/Component/Modal/ModalWrapper';
import TableWrapper from './pages/Component/Table/TableWrapper';
import LabelGroupWrapper from './pages/Component/LabelGroup/LabelGroupWrapper';
import CheckBoxAndInputWrapper from './pages/Component/CheckBoxAndInput/CheckBoxAndInputWrapper';
import CarouselWrapper from './pages/Component/Carousel/CarouselWrapper';
import FileAttachmentWrapper from './pages/Component/FileAttachment/FileAttachmentWrapper';
import SearchInputWrapper from './pages/Component/SearchInput/SearchInputWrapper';

import { SharedContextProvider } from './pages/DataContext';

export default function App() {
  return (
    <SharedContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="water-area" element={<WaterArea />} />
            <Route path="charterer" element={<Charterer />} />
            <Route path="certificate" element={<Certificate />} />
            <Route path="certificate-edit" element={<CertificateEdit />} />
            <Route path="ship" element={<Ship />} />
            <Route path="ship-detail" element={<ShipDetail />} />
            <Route path="ship-create" element={<ShipCreate />} />
            <Route path="mariner" element={<Mariner />} />
            <Route path="mariner-detail" element={<MarinerDetail />} />
            <Route path="mariner-create" element={<MarinerCreate />} />
            <Route path="type-of-certificate" element={<TypeOfCertificate />} />
            <Route path="components" element={<ComponentLayout />}>
              <Route index element={<ComponentMenu />} />
              <Route path="select" element={<SelectWrapper />} />
              <Route path="tab" element={<TabWrapper />} />
              <Route path="card" element={<CardWrapper />} />
              <Route path="modal" element={<ModalWrapper />} />
              <Route path="table" element={<TableWrapper />} />
              <Route path="label-group" element={<LabelGroupWrapper />} />
              <Route path="checkbox-and-input" element={<CheckBoxAndInputWrapper />} />
              <Route path="carousel" element={<CarouselWrapper />} />
              <Route path="file-attachment" element={<FileAttachmentWrapper />} />
              <Route path="search-input" element={<SearchInputWrapper />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </SharedContextProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register();