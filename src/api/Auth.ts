import axios from "axios";

const API = axios.create({
    baseURL: "https://api.freeapi.app/api/v1",
    timeout: 5000,
})

//LOGIN
export const loginUser = async (data: { username: string; password: string })=>{
    const res = await API.post("/users/login", data)
    return res.data;
}

//REGISTER
export const registerUser = async(data:{ username: string; email: string; password: string })=>{
    const res = await API.post("/users/register", data)
    return res.data;
}

//LOGOUT
export const logoutUser = async (accessToken: string) => {
    const res = await API.post(
        "/users/logout",
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return res.data;
}