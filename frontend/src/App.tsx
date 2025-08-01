import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { Auth } from './components/Auth';
import { NotFound } from './components/Notfound';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Auth />}></Route>
				<Route path='/home' element={<Home />}></Route>
				<Route path='*' element={<NotFound />}></Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App