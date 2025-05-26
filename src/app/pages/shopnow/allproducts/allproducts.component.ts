import { Component, OnInit, ViewChild, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import { HttpClientModule } from '@angular/common/http';
import { ProductsService } from '../../../services/products.service'
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { SliderModule } from 'primeng/slider';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-allproducts',
  standalone: true,
  imports: [MatSliderModule, HttpClientModule, CommonModule, MatPaginatorModule, AnimateOnScrollModule, SliderModule, FormsModule, ReactiveFormsModule],
  templateUrl: './allproducts.component.html',
  styleUrls: ['./allproducts.component.scss'],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AllproductsComponent implements OnInit {
  startvalue = 100;
  endvalue = 5000;
  products: any[] = [];
  displayedProducts: any[] = [];
  isLoading = true;
  itemsToShow = 16;
  itemsPerPage = 12;
  currentPage = 0;
  selectedCategories: string[] = [];
  selectedBrands: string[] = [];
  selectedSizes: string[] = [];
  selectedFilters: string[] = [];
  searchQuery: string = '';


  @ViewChild('productList', { static: false }) productList!: ElementRef;

  user = { name: '', email: '' };
  message: string = '';

  constructor(
    private productsService: ProductsService, 
    private userService: UserService, 
    private router: Router, 
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }



  fetchProducts() {
    this.isLoading = true;
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        console.log('Fetched Products:', data);
        this.products = Array.isArray(data) ? data : [];
        this.products.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        this.updateDisplayedProducts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    });
  }

  updateDisplayedProducts() {
    const startIndex = this.currentPage * this.itemsPerPage;
    this.displayedProducts = this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.updateDisplayedProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadMore(){
    this.itemsToShow += 8;
    this.displayedProducts = this.products.slice(0 , this.itemsToShow);
  }

  onSelectProduct(id: string){
    this.router.navigate(['/singleproduct', id]);
  }

  updateSelection(type: string, value: string, checked: boolean) {
    if (checked) {
      if (type === 'category') {
        this.selectedCategories.push(value);
      } else if (type === 'brand') {
        this.selectedBrands.push(value);
      } else if (type === 'size') {
        this.selectedSizes.push(value);
      } else if(type === 'filters'){
        this.selectedFilters.push(value);
      }
    } else {
      if (type === 'category') {
        this.selectedCategories = this.selectedCategories.filter(item => item !== value);
      } else if (type === 'brand') {
        this.selectedBrands = this.selectedBrands.filter(item => item !== value);
      } else if (type === 'size') {
        this.selectedSizes = this.selectedSizes.filter(item => item !== value);
      } else if(type === 'filters'){
        this.selectedFilters = this.selectedFilters.filter(item => item !== value);
      }
    }
  }

  onSearchChange(searchText: string) {
    this.searchQuery = searchText;
  }

  applyFilters() {
    const queryParams: any = {};
    
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      queryParams['q'] = this.searchQuery.trim();
    }
    
    if (this.startvalue) {
      queryParams['priceMin'] = this.startvalue;
    }
    
    if (this.endvalue) {
      queryParams['priceMax'] = this.endvalue;
    }
    
    if (this.selectedCategories.length > 0) {
      queryParams['category'] = this.selectedCategories.join(',');
    }
    
    if(this.selectedFilters.length > 0){
      queryParams['filters'] = this.selectedFilters.join(',');
    }

    if (this.selectedBrands.length > 0) {
      queryParams['brand'] = this.selectedBrands.join(',');
    }
    
    if (this.selectedSizes.length > 0) {
      queryParams['size'] = this.selectedSizes.join(',');
    }
    
    
    this.http.get('http://localhost:3000/products', { params: queryParams })
      .subscribe(
        (data: any) => {
          this.products = data;
          this.updateDisplayedProducts();
        },
        (error: any) => {
        }
      );
  }
}
