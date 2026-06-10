import axios from "axios";

const API_URL = "https://portfolio-website-6-w0fn.onrender.com/api/projects";

export const getProjects = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};