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
                console.log('im here');

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
            let content = null
            
            if (this.state.error) {
                
                // if (!this.state.error.response) {
                //     content // no response - server unavailable
                // }
                if (this.state.error.response && this.state.error.response.status === 401) {
                    localStorage.removeItem('user_id');
                    content = <Aux><h3><i>Unauthorized access</i></h3>
                    <p>You are not logged. Please login or signup.</p></Aux>
                }
                else {
                    content = (<Aux><h3><i>Something went wrong :/</i></h3>
                        <p>{this.state.error.message}</p> </Aux>);
                }
            }
            return (
                <Aux>
                    <Modal 
                        zIndex={1000}
                        show={this.state.error}
                        modalClose={this.errorConfirmedHandler} >
                        {this.state.error ? (
                                <Aux>
                                    <CloseArrow closePanel={this.errorConfirmedHandler} />
                                    {content}
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