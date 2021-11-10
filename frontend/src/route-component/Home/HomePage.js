import { useMutation } from "@apollo/client";
import MenuItem from "@material-ui/core/MenuItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useContext } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { AuthorizationContainer } from "../../container-components/Authorization/AuthorizationContainer";
import NavigationBar from "../../presentational-components/NavigationBar";
import { SIGNOUT_MUTATION } from "../../service-component/API/mutation";
import { AuthorizationContext } from "../../service-component/Context/authorization";

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	content: {
		flexGrow: 1,
		overflow: 'auto'
	},
	appBarSpacer: theme.mixins.toolbar,
}));

export default function HomePage() {
	const classes = useStyles();
	const history = useHistory();
	const [signOut] = useMutation(SIGNOUT_MUTATION);
	const [authorization, setAuthorization] = useContext(AuthorizationContext);
	const navigationBarFunction = [
		<MenuItem onClick={() => history.push('/dashboard')}>Home</MenuItem>,
		<MenuItem onClick={() => handleSignOut()}>Sign Out</MenuItem>,
	];

	const handleSignOut = () => {
		signOut()
			.then(data => {
				setAuthorization({
					status: false,
					token: null,
					user: {
						id: null,
						username: null,
						role: {
							name: null
						}
					}
				})
			})
			.catch();
	}

	// if (!authorization.token) return <Redirect to='/' />
	return (
		<AuthorizationContainer>
			<div className={classes.root}>
				<NavigationBar options={navigationBarFunction} />
				<div className={classes.content}>
					<div className={classes.appBarSpacer} />
					<Switch>
						<Route exact path="/" />
					</Switch>
					{/* <Dashboard /> */}
				</div>
			</div>
		</AuthorizationContainer>
	);
};

