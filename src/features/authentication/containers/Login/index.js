import { connect } from 'react-redux';
import { Login } from '../../components/Login'; //imports the feature's login component.
import * as AuthAction from '../../actions';

const mapStateToProps = ({
    auth,
    global: { language, endpointApi, endpointURL },
    settings: { account }

}) => ({
    loading: auth.loading && auth.loading.loginLoading,
    socialLoading: auth.loading && auth.loading.socialLoginLoading,
    language,
    endpointApi,
    endpointURL,
    initialValues: {
        username: (typeof account !== 'undefined' && account !== null) ? account.email ? account.email : '' : '',
    }
});

const mapDispatchToProps = {
    login: AuthAction.login,
    // socialLogin: AuthAction.socialLogin,
};

// Connects the login-component.
const LoginContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);

export default LoginContainer;
