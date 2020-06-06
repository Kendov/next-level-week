import {Request, Response} from "express";
import knex from "../database/connection";
import sysVar from "../utils/environment"

class ItemsController{
    
    async index (req: Request, res: Response) {
        const uri = process.env.SERVER_URI;
        const items = await knex("items").select("*");
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://${sysVar.SERVER_URL}/uploads/${item.image}`
            }
        });
        
        return res.json(serializedItems);
    
    }
}

export default ItemsController;