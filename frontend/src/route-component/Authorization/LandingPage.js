import { useMutation } from "@apollo/client";
import { Grid } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import makeStyles from "@material-ui/core/styles/makeStyles";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import React, { useContext, useEffect, useState } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import { ActionButton } from "../../presentational-components/Button";
import { ErrorDialog, LoadingDialog } from "../../presentational-components/Dialog";
import { PasswordInput, TextInput } from "../../presentational-components/Input";
import { TextWithLink, TitleText } from "../../presentational-components/Text";
import { REFRESHJWT_MUTATION, SIGNIN_MUTATION } from "../../service-component/API/mutation";
import { AuthorizationContext } from "../../service-component/Context/authorization";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        backgroundImage: 'url(https://dean1665.vn/uploads/school/dhqt-dhqg_hcm.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
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
        marginTop: theme.spacing(1),
    },
}));

export default function LandingPage() {
    const classes = useStyles();
    const history = useHistory();
    const [signInInfo, setSignInInfo] = useState({
        namespace: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [signIn, { loading }] = useMutation(SIGNIN_MUTATION);
    const [authorization, setAuthorization] = useContext(AuthorizationContext);
    const [refreshJWT, { loading: refreshLoading }] = useMutation(REFRESHJWT_MUTATION);

    useEffect(() => {
        (async () => {
            try {
                const data = await refreshJWT();
                await setAuthorization({
                    status: true,
                    token: data.data.refreshJWT.token,
                    user: {
                        id: data.data.refreshJWT.user.id,
                        username: data.data.refreshJWT.user.username,
                        role: {
                            name: data.data.refreshJWT.user.role.name,
                        }
                    }
                });
            } catch (error) {
                console.log(error);
            }
        })()
    }, []);

    const handleSignInChange = (prop) => (event) => {
        event.preventDefault();
        setSignInInfo({ ...signInInfo, [prop]: event.target.value });
    }

    const handleSignInClick = async () => {
        // signIn({
        //     variables: {
        //         username: signInInfo.namespace,
        //         password: signInInfo.password
        //     },
        //     errorPolicy: 'none',
        // })
        //     .then(data => {
        //         setAuthorization({
        //             status: true,
        //             token: data.data.login.token,
        //             user: {
        //                 id: data.data.login.user.id,
        //                 username: data.data.login.user.username,
        //                 role: {
        //                     name: data.data.login.user.role.name,
        //                 }
        //             }
        //         });
        //         history.push("/dashboard");
        //     })
        //     .catch(error => {
        //         setError(true);
        //     });
        history.push("/dashboard");
    }

    const handleGoToDemoClick = async () => {
        history.push("/demo");
    }

    if (authorization.token) return <Redirect to='/dashboard' />;
    return (
        <React.Fragment>
            {loading && <LoadingDialog open={loading} />}
            {error && <ErrorDialog error='Invalid namespace/password. Please try again!'
                open={error} onClose={setError(false)} />}
            {!refreshLoading &&
                <Grid container component="main" className={classes.root}>
                    <CssBaseline />
                    <Grid item xs={false} sm={4} md={8}>
                    </Grid>
                    <Grid item xs={12} sm={8} md={4} component={Paper}>
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <TitleText value="Sign In" fontSize="18px" />
                            <form className={classes.form}>
                                <TextInput label="Namespace" name="namespace" value={signInInfo.namespace}
                                    onChange={handleSignInChange('namespace')} />

                                <PasswordInput label="Password" name="password" value={signInInfo.password}
                                    onChange={handleSignInChange('password')} />

                                <ActionButton value="Sign In"
                                    onClick={() => handleSignInClick()} />
                                <Grid container direction='row' justifyContent='flex-end'>
                                    <Grid item xs>
                                        <TextWithLink
                                            value="Forgot password!"
                                            to="/forgot-password" />
                                    </Grid>
                                    <Grid item xs>
                                        <TextWithLink
                                            value="Don't have a namespace?"
                                            to="/create-account" />
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}>
                                <VisibilityIcon />
                            </Avatar>
                            <TitleText value="Just taking a look?" fontSize="18px" />
                            <form className={classes.form}>
                                <ActionButton value="Go to thesis demos"
                                    onClick={() => handleGoToDemoClick()} />
                            </form>
                        </div>
                    </Grid>
                </Grid>
            }
        </React.Fragment>
    );
};

