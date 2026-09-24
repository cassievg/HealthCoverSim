import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import NavBar from './components/navbar';

import './App.css';
import QuoteCreation from './pages/quote-creation';
import QuoteList from './pages/quote-list';
import QuoteDetail from './pages/quote-detail';
import QuoteEdit from './pages/quote-edit';

function App() {
	return (
		<BrowserRouter>
			<NavBar />

			<Routes>
				<Route path='/' element={<Navigate to='/quote-creation' />} />

				<Route path='/quote-creation' element={<QuoteCreation />} />
				<Route path='/quote-list' element={<QuoteList />} />
				<Route path='/quote-detail' element={<QuoteDetail />} />
				<Route path='/quote-edit' element={<QuoteEdit />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
