export default () => (localStorage.getItem('user_id') !== null);

export const checkSessionExpiration = () => {
    const expirationDate = localStorage.getItem('expiration_date');
    if (expirationDate) {
        if (Date.now() >= expirationDate) {
            localStorage.removeItem('expiration_date');
            localStorage.removeItem('user_id');
            console.log('session expired.');
        } 
        else {
            setTimeout( () => {
                localStorage.removeItem('expiration_date');
                localStorage.removeItem('user_id');
                console.log('timedout - session expired.');
            }, expirationDate - Date.now());
        }
    }
}