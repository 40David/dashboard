import { useState } from 'react'
import IrrigationDashboard from './components/dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>    
    <IrrigationDashboard/>
    </>
  )
}

export default App
