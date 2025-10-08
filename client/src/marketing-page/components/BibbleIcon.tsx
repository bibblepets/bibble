import { Icon } from '@mui/material';
import logo from '../../assets/logo.svg';

export default function BibbleIcon() {
	return (
		<Icon sx={{ height: 21, width: 100, mr: 2 }}>
			<img width={86} height={19} src={logo} alt="bibble logo" />
		</Icon>
	);
}
