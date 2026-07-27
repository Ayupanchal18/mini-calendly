import baseApiClient from "./config";
import { availabilityEndpoints } from "./endpoints";

const availabilityServices = {
    createSlot: (data) => {
        return baseApiClient.post(availabilityEndpoints.createSlots, data);
    },
    bookSlot: (data) => {
        return baseApiClient.post(availabilityEndpoints.bookSlots, data);
    },
    getSlotsByToken: (token) => {
        return baseApiClient.get(availabilityEndpoints.getSlots(token));
    },
    generateLink: (data) => {
        return baseApiClient.post(availabilityEndpoints.generateLink, data);
    }
};

export default availabilityServices;
