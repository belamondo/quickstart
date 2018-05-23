import { Injectable } from '@angular/core';

/**
 * Third party class
 */
import { initializeApp } from 'firebase';

const _firestore = initializeApp({
  apiKey: "AIzaSyBGXN1FkZjubMRWJ-KuAaAnpCTXlHFl9zw",
  authDomain: "quickstart-belamondo.firebaseapp.com",
  databaseURL: "https://quickstart-belamondo.firebaseio.com",
  projectId: "quickstart-belamondo",
  storageBucket: "quickstart-belamondo.appspot.com",
  messagingSenderId: "506374782568"
}, 'database').firestore();

@Injectable()
export class CrudService {

  constructor() {
  }

  create = (params) => new Promise((resolve, reject) => {
    if(!params) {
      resolve({
        code: 'c-error-01',
        message: 'Defina parâmetros mínimos'
      })
    } else {
      if(!params.collection) {
        resolve({
          code: 'c-error-02',
          message: 'Parâmetro obrigatório: collection'
        })
      }
    }
  })

  delete = (params) => new Promise((resolve, reject) => {

  })

  read = (params) => new Promise((resolve, reject) => {
    if(!params) {
      resolve({
        code: 'r-error-01',
        message: 'Defina parâmetros mínimos'
      })
    } else {
      let key, obj, ref, res, objFiltered, stringToFilter, stringCreatingFilter, functionToFilter;
    
      if(!params.route) {
        resolve({
          code: 'r-error-02',
          message: 'Parâmetro obrigatório: route'
        })
      }

      if(!params.where && !params.whereId) {
        resolve({
          code: 'u-error-03',
          message: 'Parâmetros conflitantes: where And whereId'
        })
      }

      stringToFilter = "_firestore.collection(params.route)";
      stringCreatingFilter = "";

      if(params.whereId) {
        stringCreatingFilter += ".doc('"+params.whereId+"')";
      }

      if(params.where) {
        for(let lim = params.where.length, i = 0; i < lim; i++) {
          stringCreatingFilter += ".where('"+params.where[i][0]+"', '"+params.where[i][1]+"', '"+params.where[i][2]+"')";
        }
      }

      stringToFilter += stringCreatingFilter;

      functionToFilter = eval(stringToFilter);

      functionToFilter
      .get()
      .then((querySnapshot) => { 
        let result = [];
        
        if((querySnapshot.exists && params.whereId) || (querySnapshot.docs && querySnapshot.docs.length > 0)) {
          querySnapshot.forEach((doc) => {
            result.push({
              _id: doc.id,
              _data: doc.data()
            })
          });
        }

        resolve(result);
      })
    }
  })

  update = (params) => new Promise((resolve, reject) => {
    if(!params) {
      resolve({
        code: 'u-error-01',
        message: 'Defina parâmetros mínimos'
      })
    } else {
      let key, obj, ref, res, objFiltered, stringToFilter, stringCreatingFilter, functionToFilter;
    
      if(!params.route) {
        resolve({
          code: 'u-error-02',
          message: 'Parâmetro obrigatório: route'
        })
      }

      if(!params.objectToUpdate) {
        resolve({
          code: 'u-error-03',
          message: 'Parâmetro obrigatório: objectToUpdate'
        })
      }

      if(!params.where && !params.whereId) {
        resolve({
          code: 'u-error-03',
          message: 'Parâmetros conflitantes: where And whereId'
        })
      }

      stringToFilter = "_firestore.collection(params.route)";
      stringCreatingFilter = "";

      if(params.whereId) {
        stringCreatingFilter += ".doc('"+params.whereId+"')";
      }
      
      if(params.where) {
        for(let lim = params.where.length, i = 0; i < lim; i++) {
          stringCreatingFilter += ".where('"+params.where[i][0]+"', '"+params.where[i][1]+"', '"+params.where[i][2]+"')";
        }
      }

      stringToFilter += stringCreatingFilter;
      
      functionToFilter = eval(stringToFilter);

      functionToFilter
      .set(params.objectToUpdate)
      .then(res => {
        console.log(res)
      })
    }
  })
}
