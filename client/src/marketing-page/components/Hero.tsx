import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import visuallyHidden from '@mui/utils/visuallyHidden';

const StyledBox = styled('div')(({ theme }) => ({
	alignSelf: 'center',
	width: '65%',
	height: 350,
	marginTop: theme.spacing(8),
	borderRadius: (theme.vars || theme).shape.borderRadius,
	outline: '4px solid',
	outlineColor: 'hsla(220, 25%, 80%, 0.2)',
	boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
	backgroundImage: `url(https://media.istockphoto.com/id/533229488/photo/cute-dog.jpg?s=612x612&w=0&k=20&c=7eEOOiH4NCQ_7YiL4yMWP61JNMybiZgTVOxhT-lnxXg=)`,
	backgroundSize: 'cover',
	backgroundPosition: 'center',
}));

export default function Hero() {
	return (
		<Box
			id="hero"
			data-testid="hero"
			sx={(theme) => ({
				width: '100%',
				backgroundRepeat: 'no-repeat',
				backgroundImage:
					'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
				...theme.applyStyles('dark', {
					backgroundImage:
						'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
				}),
			})}
		>
			<Container
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignContent: 'center',
					alignItems: 'center',
					pt: { xs: 14, sm: 20 },
					pb: { xs: 8, sm: 12 },
				}}
			>
				<Stack
					spacing={2}
					useFlexGap
					sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
				>
					<Typography
						variant="h1"
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', sm: 'row' },
							alignItems: 'center',
							fontSize: 'clamp(3rem, 10vw, 3.5rem)',
						}}
					>
						Your Trusted&nbsp;
						<Typography
							component="span"
							variant="h1"
							sx={(theme) => ({
								fontSize: 'inherit',
								color: 'primary.main',
								...theme.applyStyles('dark', {
									color: 'primary.light',
								}),
							})}
						>
							Pet Marketplace
						</Typography>
					</Typography>
					<Typography
						sx={{
							textAlign: 'center',
							color: 'text.secondary',
							width: { sm: '100%', md: '80%' },
						}}
					>
						Singapore's first online pet centric marketplace. Discover all
						everything from purchasing your pet to essential products and
						services. Sign up to be a beta tester below today!
					</Typography>
					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						spacing={1}
						useFlexGap
						sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
					>
						<InputLabel htmlFor="email-hero" sx={visuallyHidden}>
							Email
						</InputLabel>
						<TextField
							id="email-hero"
							hiddenLabel
							size="small"
							variant="outlined"
							aria-label="Enter your email address"
							placeholder="Your email address"
							fullWidth
							slotProps={{
								htmlInput: {
									autoComplete: 'off',
									'aria-label': 'Enter your email address',
								},
							}}
						/>
						<Button
							variant="contained"
							color="primary"
							size="small"
							sx={{ minWidth: 'fit-content' }}
						>
							Sign Up
						</Button>
					</Stack>
					<Typography
						variant="caption"
						color="text.secondary"
						sx={{ textAlign: 'center' }}
					>
						By clicking &quot;Sign Up&quot; you agree to our&nbsp;
						<Link href="#" color="primary">
							Terms & Conditions
						</Link>
						.
					</Typography>
				</Stack>
				<StyledBox id="image" />
			</Container>
		</Box>
	);
}
