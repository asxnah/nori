import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Preview from './pages/Preview';
import Quiz from './pages/Quiz';
import Answers from './pages/Answers';
import Auth from './pages/Auth';
import User from './pages/User';
import Create from './pages/Create';

const App = () => {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/preview" element={<Preview />} />
				<Route path="/quiz" element={<Quiz />} />
				<Route path="/answers" element={<Answers />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/user" element={<User />} />
				<Route path="/create" element={<Create />} />
			</Routes>
			<Footer />
		</Router>
	);
};

export default App;
