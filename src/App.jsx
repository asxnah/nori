import 'react';
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom';

import PopupHandler from './PopupHandler';

import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

import { MainPage } from './pages/MainPage/MainPage';
import { AnswersPage } from './pages/AnswersPage/AnswersPage';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { CreatePage } from './pages/CreatePage/CreatePage';
import { PreviewPage } from './pages/PreviewPage/PreviewPage';
import { QuizPage } from './pages/QuizPage/QuizPage';
import { UserPage } from './pages/UserPage/UserPage';

const AppContent = () => {
	const location = useLocation();
	const excludedRoute = '/preview';
	const shouldHideHeader = excludedRoute === location.pathname;

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
