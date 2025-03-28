import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Home from './components_main/Home';
import CreateUser from "./user-management/CreateUser";
import ReadUsers from "./user-management/ReadUsers";
import UpdateUser from "./user-management/UpdateUser";
import DeleteUser from "./user-management/DeleteUser";

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>

          <Route path="/" exact element={<Home/>}/>
          <Route path="/create" exact element={<CreateUser/>}/>
          <Route path="/read" exact element={<ReadUsers/>}/>
          <Route path="/update" exact element={<UpdateUser/>}/>
          <Route path="/delete" exact element={<DeleteUser/>}/>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
