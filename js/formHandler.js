// js/formHandler.js - helper utilities
async function getAllDocuments(collectionName){
  const snap = await db.collection(collectionName).get();
  return snap;
}
async function saveFormData(collectionName, data){
  return await db.collection(collectionName).add(data);
}
