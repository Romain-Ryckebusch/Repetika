from pymongo import MongoClient
from bson import ObjectId
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongodb-service:27017/")
_client = MongoClient(MONGO_URI)

def get_db(database_name):
    return _client[database_name]

def insert_document(database_name, collection_name, document):
    db = get_db(database_name)
    collection = db[collection_name]
    result = collection.insert_one(document)
    return result.inserted_id

def find_documents_fields(database_name, collection_name, query={}, fields=None, sort=None):
    db = get_db(database_name)
    collection = db[collection_name]
    projection = {field: 1 for field in fields} if fields else {}
    if not "_id" in projection : 
        projection["_id"] = 0  # Exclude the _id field if not specified
    results = collection.find(query, projection)
    if sort : results.sort(sort)
    results = [serialize_document(doc) for doc in results]
    return results

def find_documents_all(database_name, collection_name, query={}):
    db = get_db(database_name)
    collection = db[collection_name]
    results = collection.find(query)
    results = [serialize_document(doc) for doc in results]  
    return list(results)

def update_document(database_name, collection_name, query, update_values):
    db = get_db(database_name)
    collection = db[collection_name]    
    result = collection.update_one(query, {'$set': update_values})
    return result.modified_count

def count_documents(database_name, collection_name, query):
    db = get_db(database_name)
    collection = db[collection_name]
    count = collection.count_documents(query)
    return count

def count_documents_grouped(database_name, collection_name, query, group_by_field):
    db = get_db(database_name)
    collection = db[collection_name]
    pipeline = [
        {'$match': query},
        {'$group': {'_id': f'${group_by_field}', 'count': {'$sum': 1}}}
    ]
    results = collection.aggregate(pipeline)
    return {str(doc['_id']): doc['count'] for doc in results}
    


def delete_document(database_name, collection_name, query):
    db = get_db(database_name)
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
