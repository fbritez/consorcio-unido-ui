import axios from '../utils/http-client';
import SERVICE_URL from '../utils/constants';

class LoginService {

    async validateEmail(email){

        let validEmail = false
        let firstLogin = false

        try {
            const response =  await axios.get(`${SERVICE_URL}/validateUserEmail?user_email=${email}`);
            firstLogin = response.data
            validEmail = true
        } catch (error) {
        }

        return {
            validEmail,
            firstLogin
        }
    }

    async setCredentials( email, password){
        const result = await axios.post(`${SERVICE_URL}/setCredentials`, {user_email: email, password});
        return result
    }

    async authenticate(email, password){
        let result
        try{
            // The backend answers with a Set-Cookie carrying the signed session
            // token; withCredentials is what lets the browser keep it.
            result = await axios.post(`${SERVICE_URL}/authenticate`, {user_email: email, password});
        }catch{
            result = {data: {success: false}}
        }
        return result.data.success
    }

    async getSession(){
        try{
            const result = await axios.get(`${SERVICE_URL}/session`);
            return result.data
        }catch{
            return {authenticated: false}
        }
    }

    async logout(){
        try{
            await axios.post(`${SERVICE_URL}/logout`, {});
        }catch{
        }
    }
}

export default new LoginService();
