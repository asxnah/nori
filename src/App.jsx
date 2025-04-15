import 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
	Navigate,
} from 'react-router-dom';
import Cookies from 'js-cookie';

import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

import { MainPage } from './pages/MainPage/MainPage';
import { AnswersPage } from './pages/AnswersPage/AnswersPage';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { CreatePage } from './pages/CreatePage/CreatePage';
import { PreviewPage } from './pages/PreviewPage/PreviewPage';
import { QuizPage } from './pages/QuizPage/QuizPage';
import { UserPage } from './pages/UserPage/UserPage';
import { ResultsPage } from './pages/ResultsPage/ResultsPage';
import { AboutPage } from './pages/AboutPage/AboutPage';

const AppContent = () => {
	const location = useLocation();
	const excludedRoute = '/preview';
	const shouldHideHeader = excludedRoute === location.pathname;
	const isAuthenticated = Cookies.get('isAuthenticated');

	// List of public routes that don't require authentication
	const publicRoutes = ['/', '/auth', '/about', '/preview'];

	// Check if current route requires authentication
	const requiresAuth = !publicRoutes.includes(location.pathname);

	// Redirect to auth page if route requires authentication and user is not logged in
	if (requiresAuth && !isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	return (
		<>
			{!shouldHideHeader && <Header />}
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="/answers" element={<AnswersPage />} />
				<Route path="/auth" element={<AuthPage />} />
				<Route path="/create" element={<CreatePage />} />
				<Route path="/preview" element={<PreviewPage />} />
				<Route path="/quiz" element={<QuizPage />} />
				<Route path="/user" element={<UserPage />} />
				<Route path="/results" element={<ResultsPage />} />
				<Route path="/about" element={<AboutPage />} />
			</Routes>
			{!shouldHideHeader && <Footer />}
		</>
	);
};

const App = () => {
	return (
		<Router>
			<AppContent />
		</Router>
	);
};

export default App;
