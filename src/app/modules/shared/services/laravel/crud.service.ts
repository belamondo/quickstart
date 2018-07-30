import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

/*Laravel*/
import { environment } from './../../../../../environments/environment';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class CrudService {
  errors: any = [];
  headersToAuth: any;
  optionsToAuth: any;
  url = environment.urlToApi;

  constructor(private http: Http) {}

  create = (params) => new Promise((resolve, reject) => {
    const route: string = params.route;
    const objectToCreate: any = params.objectToCreate;

    if (!route) { // Verifica se pelo menos uma child foi definida
      reject({
        cod: 'c-01',
        message: 'Informar erro c-01 ao administrador'
      });
    }

    this.headersToAuth = new Headers({
      'Authorization': sessionStorage.getItem('access_token')
    });

    this.optionsToAuth = new RequestOptions({
      'headers': this.headersToAuth
    });

    this.http
    .post(this.url+route,objectToCreate,this.optionsToAuth)
    .subscribe(res => {
      const json = JSON.parse(res['_body']);
      resolve({
        cod: 'c-02',
        apiBody: json
      });
    }, rej => {
      const json = JSON.parse(rej['_body']);
      let error;
      if(json.errors)
        error = Object.values(json.errors);
      else
        error = json.message;

      reject({
        errors: error,
        apiBody: json
      });
    });
  })

  read = (params) => new Promise ((resolve, reject) => {
    let hide = '', limit = '', obj, objFiltered, objFilteredTemp, order = '',
    page = '', setGet = '', search = '', where = '', show = '';

    if (params) {
      if (!params.route) {
        if (!params.outterData) {
          reject({
            cod: 'r-01',
            message: 'Defina a rota de pesquisa ou objeto externo a ser utilizado (route: string || outterData: Array<Object>)'
          });
        }
      }

      if (params.route){
        if (params.show && params.hide) {
          reject({
            cod: "ra-02",
            message: "Não pode declarar os parâmetros show e hide ao mesmo tempo"
          });
        }

        if (params.show) {
          setGet = "?";
          show = "&show=[";
          
          for (let lim = params.show.length, i =0; i < lim; i++) {
            show += params.show[i]+",";            
          }

          show = show.substring(0, show.length - 1)+"]";
        }

        if (params.hide) {
          setGet = "?";
          hide = "&hide=";
          
          for (let lim = params.hide.length, i =0; i < lim; i++) {
            hide += params.hide[i]+",";            
          }

          hide = hide.substring(0, hide.length - 1);
        }

        if (params.limit) {
          setGet = "?";
          limit = "&limit="+params.limit;
        }

        if (params.order) {
          if (params.order.length == 2) {
            setGet = "?";
            order = "&order="+params.order[0]+","+params.order[1];
          }
        }

        if (params.search) {
          if (params.search[0]) {
            setGet = "?";

            if (params.search.length == 1) {
              search = "&like="+params.search[0].where+","+params.search[0].value;
            }
          }
        }

        if (params.where) {
          setGet = "?";
          
          if (params.where.length == 1) {
            where = "&where["+params.where[0].field+"]="+params.where[0].value;
          };
          
          if (params.where.length > 1) {
            where = "&where";
          };
        }

        if (params.page) {
          setGet = '?';
          if(params.route.split('?')[0] === 'report') setGet = '&';
          page = "page="+params.page;
        } else {
          if (params.route != "user") {
            setGet = "?";
            page = "noPaginate=true";
          } else {
            page = ""
          }
        }

        this.headersToAuth = new Headers({
          'Authorization': sessionStorage.getItem('access_token')
        });

        this.optionsToAuth = new RequestOptions({
          'headers': this.headersToAuth
        })
        
        let data = params.data

        if (params.search) { 
          let arrayObj = [];
          
          if (params.search.length > 1) { //searching multiples fields
            setGet = "?";

            for (let lim = params.search.length, i =0; i < lim; i++) {
              search = "&like="+params.search[i].where+","+params.search[i].value;
              
              if (params.getByPost) { 
                this.http.post(
                  environment.urlToApi + params.route,
                  data,
                  this.optionsToAuth
                )
                .subscribe(res => {
                  obj = JSON.parse(res['_body']);
                  
                  if (params.route != 'user') {
                    objFiltered = obj.data;
                  } else {
                    objFiltered = obj;
                  }
                  
                  if (obj.total) {
                    objFiltered.total = obj.total;
                  }
  
                  if (params.show) {
                    if (obj.data) {
                      objFilteredTemp = obj.data;
                    } else {
                      objFilteredTemp = obj;
                    }
          
                    objFiltered = [];
                    
                    for (let lim = objFilteredTemp.length, i =0; i < lim; i++) {
                      let temp = {};
          
                      for (let j = 0; j < params.show.length; j++) {
                        temp[params.show[j]] = objFilteredTemp[i][params.show[j]];
                      }
          
                      objFiltered.push(temp);
                    }
          
                    obj = objFiltered;
          
                    resolve({
                      obj
                    });
                  } else {
                    if (objFiltered) {
                      obj = objFiltered;
                    }
  
                    if (obj.length > 0) {
                      for (let lim2 = obj.length, j =0; j < lim2; j++) {
                        if (arrayObj.length > 0) {
                          let tempCheck = true;
                          for (let lim3 = arrayObj.length, k = 0; k < lim3; k++) {
                            if (arrayObj[k][0][params.search[i].pKToCheck] == arrayObj[j][0][params.search[i].pKToCheck]) {
                              tempCheck = true;
                            }
                          }
  
                          if (!tempCheck) {
                            arrayObj.push(obj)
                          }
                        } else {
                          arrayObj.push(obj)
                        }
                      }
                    }
                    /*if (obj.length > 0) {
                      if (params.search[i].pKToCheck) {
  
                      }
                      arrayObj.push(obj);
                    }*/
                    if ((lim-1) == i) {
                      obj = arrayObj[0];
                      resolve({
                        obj
                      });
                    }
                  }
                })
              } else {  
                this.http.get(
                  environment.urlToApi + params.route + setGet + page +  show + hide + limit + order + search + where,
                  this.optionsToAuth
                )
                .subscribe(res => {
                  obj = JSON.parse(res['_body']);
                  
                  if (params.route != 'user') {
                    objFiltered = obj.data;
                  } else {
                    objFiltered = obj;
                  }
                  
                  if (obj.total) {
                    objFiltered.total = obj.total;
                  }
  
                  if (params.show) {
                    if (obj.data) {
                      objFilteredTemp = obj.data;
                    } else {
                      objFilteredTemp = obj;
                    }
          
                    objFiltered = [];
                    
                    for (let lim = objFilteredTemp.length, i =0; i < lim; i++) {
                      let temp = {};
          
                      for (let j = 0; j < params.show.length; j++) {
                        temp[params.show[j]] = objFilteredTemp[i][params.show[j]];
                      }
          
                      objFiltered.push(temp);
                    }
          
                    obj = objFiltered;
          
                    resolve({
                      obj
                    });
                  } else {
                    if (objFiltered) {
                      obj = objFiltered;
                    }
  
                    if (obj.length > 0) {
                      for (let lim2 = obj.length, j =0; j < lim2; j++) {
                        if (arrayObj.length > 0) {
                          let tempCheck = true;
                          for (let lim3 = arrayObj.length, k = 0; k < lim3; k++) {
                            if (arrayObj[k][0][params.search[i].pKToCheck] == arrayObj[j][0][params.search[i].pKToCheck]) {
                              tempCheck = true;
                            }
                          }
  
                          if (!tempCheck) {
                            arrayObj.push(obj)
                          }
                        } else {
                          arrayObj.push(obj)
                        }
                      }
                    }
                    /*if (obj.length > 0) {
                      if (params.search[i].pKToCheck) {
  
                      }
                      arrayObj.push(obj);
                    }*/
                    if ((lim-1) == i) {
                      obj = arrayObj[0];
                      resolve({
                        obj
                      });
                    }
                  }
                })
              }
            }
          } else {
            if (params.getByPost) {
              this.http.post(
                environment.urlToApi + params.route,
                data,
                this.optionsToAuth
              )
              .subscribe(res => {
                obj = JSON.parse(res['_body']);
                
                if (params.route != 'user') {
                  objFiltered = obj.data;
                } else {
                  objFiltered = obj;
                }
                
                if (obj.total) {
                  objFiltered.total = obj.total;
                }
                
                if (params.show) {
                  if (obj.data) {
                    objFilteredTemp = obj.data;
                  } else {
                    objFilteredTemp = obj;
                  }
        
                  objFiltered = [];
                  
                  for (let lim = objFilteredTemp.length, i =0; i < lim; i++) {
                    let temp = {};
        
                    for (let j = 0; j < params.show.length; j++) {
                      temp[params.show[j]] = objFilteredTemp[i][params.show[j]];
                    }
        
                    objFiltered.push(temp);
                  }
        
                  obj = objFiltered;
        
                  resolve({
                    obj
                  });
                } else {
                  if (objFiltered) {
                    obj = objFiltered;
                  }
                  
                  resolve({
                    obj
                  });
                }
              })
            } else {
              this.http.get(
                environment.urlToApi + params.route + setGet + page +  show + hide + limit + order + search + where,
                this.optionsToAuth
              )
              .subscribe(res => {
                obj = JSON.parse(res['_body']);
                
                if (params.route != 'user') {
                  objFiltered = obj.data;
                } else {
                  objFiltered = obj;
                }
                
                if (obj.total) {
                  objFiltered.total = obj.total;
                }
                
                if (params.show) {
                  if (obj.data) {
                    objFilteredTemp = obj.data;
                  } else {
                    objFilteredTemp = obj;
                  }
        
                  objFiltered = [];
                  
                  for (let lim = objFilteredTemp.length, i =0; i < lim; i++) {
                    let temp = {};
        
                    for (let j = 0; j < params.show.length; j++) {
                      temp[params.show[j]] = objFilteredTemp[i][params.show[j]];
                    }
        
                    objFiltered.push(temp);
                  }
        
                  obj = objFiltered;
        
                  resolve({
                    obj
                  });
                } else {
                  if (objFiltered) {
                    obj = objFiltered;
                  }
                  
                  resolve({
                    obj
                  });
                }
              })
            }
          }
        } else {
          if (params.getByPost) {
            this.http.post(
              environment.urlToApi + params.route,
              data,
              this.optionsToAuth
            )
            .subscribe(res => {
              obj = JSON.parse(res['_body']);
              
              if (params.route != 'user') {
                objFiltered = obj.data;
              } else {
                objFiltered = obj;
              }
              
              if (obj.total) {
                objFiltered.total = obj.total;
              }
              
              if (params.show) {
                if (obj.data) {
                  objFilteredTemp = obj.data;
                } else {
                  objFilteredTemp = obj;
                }
      
                objFiltered = [];
                
                for (let lim = objFilteredTemp.length, i =0; i < lim; i++) {
                  let temp = {};
      
                  for (let j = 0; j < params.show.length; j++) {
                    temp[params.show[j]] = objFilteredTemp[i][params.show[j]];
                  }
      
                  objFiltered.push(temp);
                }
      
                obj = objFiltered;
      
                resolve({
                  obj
                });
              } else {
                if (objFiltered) {
                  obj = objFiltered;
                }
                
                resolve({
                  obj
                });
              }
            })
          } else {
            this.http.get(
              environment.urlToApi + params.route + setGet + page +  show + hide + limit + order + search + where,
              this.optionsToAuth
            )
            .subscribe(res => {
              obj = JSON.parse(res['_body']);
              
              if (params.route != 'user') {
                objFiltered = obj.data;
              } else {
                objFiltered = obj;
              }
              
              if (obj.total) {
                objFiltered.total = obj.total;
              }
              
              if (params.show) {
                if (obj.data) {
                  objFilteredTemp = obj.data;
                } else {
                  objFilteredTemp = obj;
                }
      
                objFiltered = [];
                
                for (let lim = objFilteredTemp.length, i =0; i < lim; i++) {
                  let temp = {};
      
                  for (let j = 0; j < params.show.length; j++) {
                    temp[params.show[j]] = objFilteredTemp[i][params.show[j]];
                  }
      
                  objFiltered.push(temp);
                }
      
                obj = objFiltered;
      
                resolve({
                  obj
                });
              } else {
                if (objFiltered) {
                  obj = objFiltered;
                }
                
                resolve({
                  obj
                });
              }
            })
          }          
        }
      }

      if (params.outterData) {
        obj = params.outterData;
        resolve({
          obj
        })
      }
    } else {
      reject({
        cod: "p-01",
        message: "Definir parâmetros mínimos do serviço"
      })
    }
  })

  update = (params) => new Promise((resolve, reject) => {
    const route: string = params.route;
    const objectToUpdate: any = params.objectToUpdate;
    const paramToUpdate: any = params.paramToUpdate;

    if (!route) {
      reject({
        cod: 'u-01',
        message: 'Informar erro u-01 ao administrador'
      });
    }

    if (!paramToUpdate) {
      reject({
        cod: 'u-02',
        message: 'Informar erro u-02 ao administrador'
      });
    }

    this.headersToAuth = new Headers({
      'Authorization': sessionStorage.getItem('access_token')
    });

    this.optionsToAuth = new RequestOptions({
      'headers': this.headersToAuth
    })

    this.http
    .patch(
      this.url + route + '/' + paramToUpdate,
      objectToUpdate,
      this.optionsToAuth
    )
    .subscribe(res => {
      resolve({
        cod: 'u-03',
        message: 'Salvo com sucesso'
      });
    }, rej => {
      if (rej['_body']) {
        const json = JSON.parse(rej['_body']);
        reject({
          cod: 'error-c-01',
          message: JSON.stringify(json.message)
        })
      }
    })
  })

  delete = (params) => new Promise((resolve, reject) => {
    const route: string = params.route;
    const paramToDelete: any = params.paramToDelete;

    if (!route) {
      reject({
        cod: 'u-01',
        message: 'Informar erro u-01 ao administrador'
      });
    }

    if (!paramToDelete) {
      reject({
        cod: 'u-02',
        message: 'Informar erro u-02 ao administrador'
      });
    }

    this.headersToAuth = new Headers({
      'Authorization': sessionStorage.getItem('access_token')
    });

    this.optionsToAuth = new RequestOptions({
      'headers': this.headersToAuth
    });

    for (let lim = paramToDelete.length, i = 0; i < lim; i++) {
      this.http
      .delete(
        this.url+route+'/'+paramToDelete[i],
        this.optionsToAuth
      )
      .subscribe(res => {
        if (i == (lim - 1)) {
          resolve({
            cod: 'u-03',
            message: 'Ítens apagados com sucesso'
          });
        }
      }, rej => {
        if (rej['_body']) {
          const json = JSON.parse(rej['_body']);
          reject({
            cod: 'error-c-01',
            message: JSON.stringify(json.message)
          });
        }
      });
    }
  })

  newRead = (params) => new Promise ((resolve, reject) => {

    this.headersToAuth = new Headers({
      'Authorization': sessionStorage.getItem('access_token'),
      'Access-Control-Allow-Origin': '*'
    });

    this.optionsToAuth = new RequestOptions({
      'headers': this.headersToAuth
    });

    let obj = [];
    let route;
    (params.order) ? route = params.route+'?noPaginate=true&order='+params.order: route = params.route+'?noPaginate=true&order=id,desc';
    this.http.get(environment.urlToApi + route,this.optionsToAuth)
    .subscribe(res => {
      if(res['_body'])
        obj = JSON.parse(res['_body']);

      resolve({
        obj
      });
    }, rej => {
      if(rej['_body'])
        obj = JSON.parse(rej['_body']);

      reject({
        apiBody: obj,
        status: 500
      });
    });
  })
}
