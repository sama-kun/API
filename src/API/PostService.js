import axios from "axios";

const api = new axios.create({
    baseURL: 'http://localhost:5000/'
})


export default class PostService{
    
    static async getAll(){

        try {
            const res = await api.get('/todo')
            return res.data;
        } catch (error) {
            console.log(error)
        }

    }

    static async delete(id){
        try {
            await api.delete('/todo/'+id);
            return true
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    static async create(newPost){
        try {
            const res = await api.post('/todo',newPost);
            return res.data;
        } catch (error) {
            console.log(error)
        }
    }

    static async getById(id){
        try {
            const res = await api.get(`/todo/${id}`);

            return res.data;
        } catch (error) {
            console.log(error)
        }
    }

    static async edit(id, post){
        try {
            const res = await api.put(`/todo/${id}`,post);

            return res.data;
        } catch (error) {
            console.log(error)
        }
    }

}