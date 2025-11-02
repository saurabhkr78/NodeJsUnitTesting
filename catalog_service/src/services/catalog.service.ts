import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";

export class CatalogService{
    
    private _repository: ICatalogRepository;


    constructor(repository:ICatalogRepository){
        this._repository = repository;
    }



    async createProduct(input: Product){
       const data =await this._repository.create(input);

       if (!data.id){
       throw new Error("unable to create product");
       }
         return data;
     }

    async updateProduct(input: Product){}
   
    getProducts(limit: number, offset: number){
        
    }
    getProduct(id: number){
        
    }
     deleteProduct(id: number){
        
    }
}