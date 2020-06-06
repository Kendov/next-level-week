import {Request, Response} from "express";
import knex from "../database/connection";
import dotenv from "dotenv";



dotenv.config();

class ItemsController{
    
    async index (req: Request, res: Response) {
        const uri = process.env.SERVER_URI;
        const items = await knex("items").select("*");
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://${uri}/uploads/${item.image}`
            }
        });
        
        return res.json(serializedItems);
    
    }
}

export default ItemsController;