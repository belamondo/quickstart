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
      let key, obj, ref, res, objFiltered, objFilteredOnSearch, stringToFilter, functionToFilter;
    
      if(!params.route) {
        resolve({
          code: 'r-error-02',
          message: 'Parâmetro obrigatório: route'
        })
      }

      if(params.where) {
        for(let lim = params.where.length, i = 0; i < lim; i++) {
          stringToFilter += ".where('"+params.where[i].property+"', '"+params.where[i].operation+"', '"+params.where[i].value+"')";
        }

        stringToFilter = "_firestore.collection(params.route)" + stringToFilter;
      } else {
        stringToFilter = "_firestore.collection(params.route)";
      }
      console.log(stringToFilter)
      _firestore.collection('test').doc
      functionToFilter = eval(stringToFilter);

      functionToFilter
      .get()
      .then((querySnapshot) => {
        let result = [];
        querySnapshot.forEach((doc) => {
          result.push({
            _id: doc.id,
            _data: doc.data()
          })
        });

        resolve(result);
      })
    }
  })

  updtate = (params) => new Promise((resolve, reject) => {

  })
}
