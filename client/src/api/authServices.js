import baseApiClient from "./config"
import { authEndpoints } from "./endpoints"


const authServices = {
    login: (data) => {
        return baseApiClient.post(authEndpoints.login, data)
    },
    register: (data) => {
        return baseApiClient.post(authEndpoints.register, data)
    }
}

export default authServices;