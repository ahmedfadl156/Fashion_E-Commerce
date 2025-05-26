import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private myApi = 'http://localhost:3000/products';
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<any[]>('http://localhost:3000/products/all', { headers })
      .pipe(
        retry(1), 
        catchError(this.handleError)
      );
  }


  getProductById(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<any>(`${this.myApi}/${id}`, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addProduct(product: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<any>(`${this.myApi}/add`, product, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  deleteProduct(id: string): Observable<any>{
    return this.http.delete<any>(`${this.myApi}/${id}`)
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.myApi}/${id}`, product)
  }

  updateProductQuantity(productId: string, quantity: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.put<any>(`${this.myApi}/update-quantity/${productId}`, 
      { quantity }, 
      { headers }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateProductsQuantities(products: {id: string, quantity: number}[]): Observable<any> {
    console.log('Updating products quantities:', products);
    
    const uniqueProducts = products.reduce((acc, current) => {
      const existingProduct = acc.find(item => item.id === current.id);
      if (existingProduct) {
        existingProduct.quantity += current.quantity;
      } else {
        acc.push({...current});
      }
      return acc;
    }, [] as {id: string, quantity: number}[]);
    
    const updateObservables = uniqueProducts.map(product => 
      this.updateProductQuantity(product.id, product.quantity)
    );
    
    return new Observable(observer => {
      if (updateObservables.length === 0) {
        observer.next({ message: "No products to update" });
        observer.complete();
        return;
      }
      
      const results: any[] = [];
      let completed = 0;
      
      updateObservables.forEach((updateObservable, index) => {
        updateObservable.subscribe({
          next: (result) => {
            results.push({
              productId: uniqueProducts[index].id,
              success: true,
              result
            });
          },
          error: (error) => {
            console.error('Error updating product:', error);
            results.push({
              productId: uniqueProducts[index].id,
              success: false,
              error: error.message
            });
          },
          complete: () => {
            completed++;
            
            if (completed === updateObservables.length) {
              observer.next({
                message: "All product updates completed",
                results
              });
              observer.complete();
            }
          }
        });
      });
    });
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.error('========= API Error =========');
    console.error('Status code:', error.status);
    console.error('Status text:', error.statusText);
    console.error('Message:', error.message);
    console.error('Error details:', error.error);
    console.error('=============================');

    return of({ error: true, message: error.error?.message || 'An error occurred', details: error.error });
  }
}

