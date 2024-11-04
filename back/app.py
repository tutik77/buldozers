import fastapi
from fastapi import FastAPI, HTTPException
from models import ProductSchema, ProductSchemaOut, SupportSchema, SupportSchemaOut
from database import engine, Base, ProductsTable, MakeSyncSession, SupportTable
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.post("/products")
async def add_product(product: ProductSchema):
    with MakeSyncSession() as session:
        new_product = ProductsTable(name=product.name, price=product.price, info=product.info, image_path=product.image_path)
        session.add(new_product)
        session.commit()
        return new_product

@app.get("/products", response_model=list[ProductSchemaOut])
async def get_all_products():
    with MakeSyncSession() as session:
        products = session.query(ProductsTable).all()
        if not products:
            raise HTTPException(status_code=404, detail="Products table is empty")
        return products

@app.get("/products/{id}", response_model=ProductSchemaOut)
async def get_product_by_id(id):
    with MakeSyncSession() as session:
        product = session.query(ProductsTable).get(id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product


@app.delete("/products/{id}")
async def delete_product_by_id(id):
    with MakeSyncSession() as session:
        product = session.query(ProductsTable).get(id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        session.delete(product)
        session.commit()

@app.get("/support", response_model=list[SupportSchemaOut])
async def get_questions():
    with MakeSyncSession() as session:
        support = session.query(SupportTable).all()
        if not support:
            raise HTTPException(status_code=404, detail="Support table is empty")
        return support

@app.post("/support")
async def add_question(question: SupportSchema):
    
    with MakeSyncSession() as session:
        new_question = SupportTable(name=question.name, email=question.email, message=question.message)
        session.add(new_question)
        session.commit()
        return new_question

@app.delete("/support/{id}", response_model=SupportSchemaOut)
async def delete_question_by_id(id):
    with MakeSyncSession() as session:
        question = session.query(SupportTable).get(id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        session.delete(question)
        session.commit()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    