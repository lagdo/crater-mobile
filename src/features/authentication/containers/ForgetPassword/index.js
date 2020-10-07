import { connect } from 'react-redux';
import { ForgotPassword } from '../../components/ForgotPassword';
import * as AuthAction from '../../actions';

const mapStateToProps = ({ auth, global }) => ({
    loading: auth.loading.forgetPasswordLoading,
    validation: true,
    language: global.language,
});

const mapDispatchToProps = {
    sendForgotPasswordMail: AuthAction.sendForgotPasswordMail,
};

//  connect
const ForgotPasswordContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ForgotPassword);

export default ForgotPasswordContainer;
