import WagmiProvider from "./providers/WagmiProvider"
import Dashboard from "./pages/Dashboard"
import { ToastContainer, Zoom } from "react-toastify"

function App() {

  return (
    <WagmiProvider>
      <Dashboard />
      <ToastContainer position="top-center" transition={Zoom} theme="light" draggable={true} />
    </WagmiProvider>
  )
}

export default App
