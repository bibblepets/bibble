import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Pricing from './components/Pricing';

export default function MarketingPage(
	props: Readonly<{ disableCustomTheme?: boolean }>,
) {
	return (
		<AppTheme {...props}>
			<CssBaseline enableColorScheme />

			<AppAppBar />
			<Hero />
			<div>
				<Divider />
				<Pricing />
				<Divider />
				<Footer />
			</div>
		</AppTheme>
	);
}
