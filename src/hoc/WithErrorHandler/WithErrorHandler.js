import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary';
import CloseArrow from '../../components/UI/CloseArrow/CloseArrow';


const withErrorHandler = (WrappedComponent, axios) => {
    return class extends React.Component {
        state = {
            error: null
        }

        componentWillMount () {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                // Do something before request is sent
                return req;
            }, (error) => {
                // Do something with request error
                console.log(error);
                return Promise.reject(error);
            });

            this.resInterceptor = axios.interceptors.response.use(res => {
                
                return res;
            }, (error) => {
                // Do something with response error
                console.log(error);
                this.setState({error: error});
                return Promise.reject(error);
            });
        }

        componentWillUnmount () {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render () {
            return (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClose={this.errorConfirmedHandler} >
                        {this.state.error ? (
                                <Aux>
                                    <CloseArrow closePanel={this.errorConfirmedHandler} />
                                    <h3><i>Something went wrong :/</i></h3>
                                    <p>{this.state.error.message}</p>
                                </Aux>
                            ): null
                        }    
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
}

export default withErrorHandler;