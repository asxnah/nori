import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';

import PopupHandler from './PopupHandler';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Preview from './pages/Preview';
import Quiz from './pages/Quiz';
import Answers from './pages/Answers';
import Auth from './pages/Auth';
import User from './pages/User';
import Create from './pages/Create';

const AppContent = () => {
	const location = useLocation();
	const excludedRoute = '/preview';
	const shouldHideHeader = excludedRoute === location.pathname;

	return (
		<>
			{!shouldHideHeader && <Header />}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/preview" element={<Preview />} />
				<Route path="/quiz" element={<Quiz />} />
				<Route path="/answers" element={<Answers />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/user" element={<User />} />
				<Route path="/create" element={<Create />} />
			</Routes>
			{!shouldHideHeader && <Footer />}
		</>
	);
};

const App = () => {
	return (
		<Router>
			<PopupHandler />
			<AppContent />
		</Router>
	);
};

export default App;
