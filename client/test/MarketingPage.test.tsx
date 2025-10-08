import { render, screen } from '@testing-library/react';
import MarketingPage from '../src/marketing-page/MarketingPage';

describe('MarketingPage', () => {
	it('renders data immediately', async () => {
		render(<MarketingPage />);
		expect(await screen.findByTestId('app-app-bar')).toBeInTheDocument();
		expect(await screen.findByTestId('hero')).toBeInTheDocument();
		expect(await screen.findByTestId('pricing')).toBeInTheDocument();
		expect(await screen.findByTestId('footer')).toBeInTheDocument();
	});
});
