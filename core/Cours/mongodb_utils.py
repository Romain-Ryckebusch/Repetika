from pymongo import MongoClient
from bson import ObjectId

MONGO_URI = "mongodb://localhost:27017/" # TODO : Set these values with Django settings later
DATABASE_NAME = "DB_Cours"

def get_db():
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    return db

def insert_document(collection_name, document):
    db = get_db()
    collection = db[collection_name]
    result = collection.insert_one(document)
    return result.inserted_id

def find_documents_fields(collection_name, query={}, fields=None):
    db = get_db()
    collection = db[collection_name]
    projection = {field: 1 for field in fields} if fields else {}
    if not "_id" in projection : 
        projection["_id"] = 0  # Exclude the _id field if not specified
    results = collection.find(query, projection)
    results = [serialize_document(doc) for doc in results]
    return results

def find_documents_all(collection_name, query={}):
    db = get_db()
    collection = db[collection_name]
    results = collection.find(query)
    results = [serialize_document(doc) for doc in results]
    return list(results)

def update_document(collection_name, query, update_values):
    db = get_db()
    collection = db[collection_name]
    result = collection.update_one(query, {'$set': update_values})
    return result.modified_count

def count_documents(collection_name, query):
    db = get_db()
    collection = db[collection_name]
    count = collection.count_documents(query)
    return count


def delete_document(collection_name, query):
    db = get_db()
    collection = db[collection_name]
    result = collection.delete_one(query)
    return result.deleted_count


####### Conversion functions ########
def serialize_document(doc):
    # Convert all ObjectId fields to string
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
    return doc
