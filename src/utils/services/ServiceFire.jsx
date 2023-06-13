import { db } from '../firestore'

async function getAllProductItems() {

    try {
        const AllProductItems = await db.collection("ItemsProduct").get();
        return AllProductItems;
    } catch (e) {
        throw e;
    }

}

async function getAllSupplierCategories() {
    try {
        const AllSupplierCategories = await db.collection("SupplierCategories").get();
        return AllSupplierCategories;
    } catch (e) {
        throw e;
    }

}

async function AddNewProductItem(productName, pruductSupplierCategory, productPrice, productDate) {
    const data = {
        productName,
        pruductSupplierCategory,
        productPrice: parseFloat(productPrice),
        productDate
      };
    
      try {
        const docRef = await db.collection("ItemsProduct").add(data);
        return docRef;
      } catch (error) {
        throw error;
      }

}

async function UpateProductItem(productItemID, productName, pruductSupplierCategory, productPrice, productDate) {
    const data = {
        productName,
        pruductSupplierCategory,
        productPrice: parseFloat(productPrice),
        productDate
      };
    
      try {
        await db.collection("ItemsProduct").doc(productItemID).update(data);
        return;
      } catch (error) {
        throw error;
      }

}

async function DeleteProductItem(productItemID) {

    try {
        await db.collection("ItemsProduct").doc(productItemID).delete();
        return;
      } catch (error) {
        throw error;
      }

}
 
export default { getAllProductItems,getAllSupplierCategories, AddNewProductItem, UpateProductItem, DeleteProductItem}