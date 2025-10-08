import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MarketingPage from './marketing-page/MarketingPage.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<MarketingPage />
	</StrictMode>,
);
