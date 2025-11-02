import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { MockCatalogRepository } from "./../../respository/MockCatalog.repository";
import { CatalogService } from "../catalog.service";
import { faker } from '@faker-js/faker';
import { promiseHooks } from "v8";
import { Product } from "../../models/product.model";



const mockProduct=(rest:any) =>{
    return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.commerce.department(),
    price: parseFloat(faker.commerce.price()),
    stock: faker.datatype.number({min:0, max:1000}),
    ...rest
};
};

describe("catalogService", () => {
    let repository:ICatalogRepository;

    beforeEach(() => {
        repository=new MockCatalogRepository();
     });
    afterEach(() => {
        repository= {} as MockCatalogRepository;
    });



    describe("createProduct", () => {
           test("should create a product successfully",  async() => {
            const service=new CatalogService(repository);
            const reqBody=mockProduct(
                { id:faker.datatype.number({min:1}), }
            );


            const result=await service.createProduct(reqBody);


            expect(result).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                price: expect.any(Number),
                category: expect.any(String),
                stock: expect.any(Number)
            });

           });

            test("should throw an error unable to create product",  async() => {
            const service=new CatalogService(repository);
            const reqBody=mockProduct(
                { id:faker.datatype.number({min:1}), }
            );
            jest.spyOn(repository, 'create').mockImplementationOnce(() => Promise.resolve({} as Product));
            await expect(service.createProduct(reqBody)).rejects.toThrow("unable to create product");
            });


            test("should throw an error with product already exist",  async() => {
            const service=new CatalogService(repository);
            const reqBody=mockProduct(
                { id:faker.datatype.number({min:1}), }
            );
            jest.spyOn(repository, 'create').mockImplementationOnce(() => Promise.reject(new Error("product already exist")));
            await expect(service.createProduct(reqBody)).rejects.toThrow("product already exist");
            });
        });
    });