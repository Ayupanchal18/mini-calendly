const availabilityEndpoints = {
    createSlots: "/frontend/availability/create-slots",
    bookSlots: "/frontend/availability/book-slots",
    getSlots: (token) => `/frontend/availability/get-slots/${token}`,
    getSlotsPost: "/frontend/availability/get-slots",
    generateLink: "/frontend/availability/generate-link",
};

export default availabilityEndpoints;
