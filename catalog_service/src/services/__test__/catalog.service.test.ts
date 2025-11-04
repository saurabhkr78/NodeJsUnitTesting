import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { MockCatalogRepository } from "./../../respository/MockCatalog.repository";
import { CatalogService } from "../catalog.service";
import { faker } from '@faker-js/faker';
import { promiseHooks } from "v8";
import { Product } from "../../models/product.model";
import { Factory } from "rosie";
import { ModuleResolutionKind } from "typescript";


const productFactory = new Factory<Product>()
    .attr('id', () => faker.datatype.number({ min: 1,max: 1000 }))
    .attr('name', () => faker.commerce.productName())
    .attr('description', () => faker.commerce.productDescription())
    .attr('category', () => faker.commerce.department())
    .attr('price', () => parseFloat(faker.commerce.price()))
    .attr('stock', () => faker.datatype.number({ min: 0, max: 1000 }));


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
            //mimic a failed creation
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
        //update product tests
        describe("updateProduct", () => {
            test("should update product successfully", async() => {
                  const service=new CatalogService(repository);
                  const reqBody=mockProduct({ id:faker.datatype.number({min:10, max:1000}),price:+faker.commerce.price()});

            
            const result=await service.updateProduct(reqBody);


            expect(result).toMatchObject(reqBody);
            });
        });
        //if you make a test case test.only then other test cases will be skipped
        test("should throw an error with product doesn't exist",  async() => {
            const service=new CatalogService(repository);

            jest.spyOn(repository, 'update').mockImplementationOnce(() => Promise.reject(new Error("product doesn't exist")));
            await expect(service.updateProduct({})).rejects.toThrow("product doesn't exist");
            });

            //get products tests
            describe("getProducts", () => {
                test("should get products successfully", async() => {
                      const service=new CatalogService(repository);
                    const randomLimit=faker.datatype.number({min:1, max:100});
                    const products=productFactory.buildList(randomLimit);

                jest.spyOn(repository, 'find').mockImplementationOnce(() =>Promise.resolve(products));
                const result=await service.getProducts(randomLimit,0);


                expect(result.length).toEqual(randomLimit);
                expect(result).toMatchObject(products);
                });

            test("should throw an error with products doesn't exist",  async() => {
            const service=new CatalogService(repository);

            jest.spyOn(repository, 'find').mockImplementationOnce(() => Promise.reject(new Error("products doesn't exist") ));
            await expect(service.getProducts(0, 0)).rejects.toThrow("products doesn't exist");
            });
            });

            //get product tests
             describe("getProduct", () => {
                test("should get product successfully", async() => {
                      const service=new CatalogService(repository);
                    const product=productFactory.build();

                jest.spyOn(repository, 'findOne').mockImplementationOnce(() =>Promise.resolve(product));

                const result=await service.getProduct(product.id!);


                expect(result).toMatchObject(product);
                });
            });

            //delete product tests
            describe("deleteProduct", () => {
                test("should delete Product by id", async() => {
                    const service=new CatalogService(repository);
                    const product=productFactory.build();
                    jest.spyOn(repository, 'delete').mockImplementationOnce(() =>Promise.resolve({id:product.id}));

                const result=await service.deleteProduct(product.id!);

                expect(result).toMatchObject({id:product.id});
             });

        test("should throw an error with product doesn't exist by id",  async() => {
            const service=new CatalogService(repository);

            jest.spyOn(repository, 'delete').mockImplementationOnce(() => Promise.reject(new Error("product doesn't exist to delete")));
            await expect(service.deleteProduct(1)).rejects.toThrow("product doesn't exist to delete");
            });
        });
});