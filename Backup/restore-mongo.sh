#!/bin/bash
# restore_mongo.sh

# Get the directory where the script resides
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="$SCRIPT_DIR/."

for filepath in "$BACKUP_DIR"/DB_*.json; do
    filename=$(basename -- "$filepath")
    db_collection="${filename%.json}"  # Remove .json
    db="${db_collection%%.*}"          # Extract database name
    collection="${db_collection#*.}"   # Get collection name
    
    echo "Resetting $db.$collection..."
    mongosh "$db" --eval "db.getCollection('$collection').deleteMany({})"

    echo "Importing $filepath into $db.$collection..."
    mongoimport --db "$db" --collection "$collection" --file "$filepath" --jsonArray
done

