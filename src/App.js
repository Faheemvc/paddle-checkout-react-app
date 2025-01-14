import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaddleCheckout from './PaddleCheckout';
import DirectCheckout from './DirectCheckout';
import PaymentStatus from './PaymentStatus';
import TransactionCheckout from './TransactionCheckout';
// import PlanList from './PlanList';

function App() {
  return (
    // <div className="App">
    //   {/* <PlanList onSelect={plan => console.log('Selected Plan:', plan)} /> */}
    //   <PaddleCheckout />
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaddleCheckout />} />
        <Route path="/pay-link/:priceId" element={<DirectCheckout />} />
        <Route path="/pay" element={<TransactionCheckout />} />
        <Route path="/billing" element={<PaymentStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;