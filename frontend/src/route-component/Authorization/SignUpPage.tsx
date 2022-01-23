import { Theme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import makeStyles from "@material-ui/core/styles/makeStyles";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import React from 'react';
import { TextWithLink, TitleText } from "../../presentational-components/Text";


const useStyles = makeStyles((theme: Theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(3),
	},
}));

export default function SignUpPage() {
	const classes = useStyles();

	return (
		<React.Fragment>
			<Container maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<SupervisorAccountIcon />
					</Avatar>
					<TitleText value="Please contact an administrator to create your account" fontSize="18px" />
					<TextWithLink
						value="Back to login"
						align="right"
						to="/" />
				</div>
			</Container>
		</React.Fragment>
	)
}