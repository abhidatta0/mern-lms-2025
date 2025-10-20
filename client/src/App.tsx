import AuthPage from "./app/auth/page";
import {Route, Routes} from 'react-router-dom';
function App() {

  return (
    <Routes>
      <Route path="/auth" Component={AuthPage} />
    </Routes>
  )
}

export default App
