import { Client, Query, Databases, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

//create a new Appwrite client
const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(PROJECT_ID);

//create a new Database instance
const database = new Databases(client);

//
export const updateSearchCount = async (searchTerm, movie) => {
    // console.log(DATABASE_ID, COLLECTION_ID, PROJECT_ID);

    //1- use Appwrite SDK to check if the searchTerm exists in the database
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm),
        ])

        //2- if it exists, increment the count by 1
        if (result.documents.length > 0) {
            //increment the count by 1
            const doc = result.documents[0];
            
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            })

            //3- if it doesn't exist, create a new document with the searchTerm and count of 1
        } else {
            //create a new document with the searchTerm and count of 1
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error(`Error updating search count: ${error}`);
    }

} 

export const getTrendingMovies = async () => {
    try {
        const results = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count"),
        ])

        return results.documents;
    } catch (error) {
        console.error(error);
    }
}