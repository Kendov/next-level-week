import {Request, Response} from "express";
import knex from "../database/connection";
import sysVar from "../utils/environment";

class PointsController {
    async create(req: Request, res: Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;
    
        const transaction = await knex.transaction();
        const point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }
    
        const insertedIds = await transaction("points").insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
            return {
                item_id,
                point_id
            }
        })
        await transaction("point_items").insert(pointItems);
        transaction.commit();
    
        return res.json({
            id: point_id,
            ...point
        });
    };

    async index(req: Request, res: Response){
        const {city, uf, items} = req.query;

        const parsedItems = String(items).split(',').map(item => Number(item.trim()));

        const points = await knex("points")
            .join("point_items", "points.id", '=', "point_items.point_id")
            .whereIn("point_items.item_id", parsedItems)
            .where("city", String(city))
            .where("uf", String(uf))
            .distinct()
            .select("points.*");

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://${sysVar.SERVER_URL}/uploads/${point.image}`
            }
        });

        return res.json(serializedPoints);
    }

    async show(req: Request, res: Response){
        const {id} = req.params;

        const point = await knex("points").where("id", id).first();

        if(!point)
            return res.status(400).json({message: "Point not found."});
        
        const serializedPoint = {
            ...point,
            image_url: `http://${sysVar.SERVER_URL}/uploads/${point.image}`
        };

        const items = await knex("items")
            .join("point_items", "items.id", '=', "point_items.item_id")
            .where("point_items.point_id", id)
            .select("items.title");

        
        return res.json({point: serializedPoint, items});
    }
}

export default PointsController;