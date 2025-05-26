import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../components/navbar/navbar.service';
import { FooterService } from '../../components/footer/footer.service';
import { ProductsService } from '../../services/products.service';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule, NgxPaginationModule , DatePipe , CurrencyPipe],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  users: any[] = [];
  productForm = false;
  editForm = false;
  userForm = false;
  newProductForm!: FormGroup;
  editProductForm!: FormGroup;
  newUserForm!: FormGroup;
  submitLoading = false;
  formSubmitted = false;
  formError = '';
  successMessage = '';
  showSuccessAlert = false;
  p: number = 1;
  itemsPerPage: number = 7;
  itemsPerPageUsers: number = 13;
  activeSection: 'products' | 'users' | 'messages' = 'products';
  showDeleteConfirm = false;
  productToDelete: any = null;
  productToEdit: any = null;
  userToDelete: any = null;
  messages: any[] = [];
  itemsPerPageMessages: number = 10;
  messageToDelete: any = null;
  showDeleteMessageConfirm: boolean = false;

  onPageChange(event: any) {
    this.p = event;
  }

  setActiveSection(section: 'products' | 'users' | 'messages') {
    this.activeSection = section;
  }
  
  constructor(private navbar: NavbarService,
    private footer: FooterService,
    private Products: ProductsService,
    private fb: FormBuilder,
    private Users: UserService,
    private http: HttpClient
  ){}

  ngOnInit(){
    this.navbar.hide();
    this.footer.hide();
    this.fetchProducts();
    this.fetchUsers();
    this.initProductForm();
    this.loadMessages();
  }

  initProductForm() {
    this.newProductForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      reviews: [0, [Validators.required, Validators.min(0)]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      brand: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  initEditForm() {
    this.editProductForm = this.fb.group({
      name: [this.productToEdit.name],
      description: [this.productToEdit.description],
      quantity: [this.productToEdit.quantity , Validators.min(0)],
      reviews: [this.productToEdit.reviews],
      rating: [this.productToEdit.rating],
      category: [this.productToEdit.category],
      price: [this.productToEdit.price],
      brand: [this.productToEdit.brand],
      image: [this.productToEdit.image]
    });
  }

  initUserForm() {
    this.newUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  fetchProducts(){
    this.Products.getAllProducts().subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  fetchUsers() {
    this.Users.getallUsers().subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data: [];
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  onAddProduct(){
    this.productForm = true;
    this.initProductForm();
    this.formSubmitted = false;
    this.formError = '';
  }

  onSubmitProduct(){
    this.formSubmitted = true;
    
    if (this.newProductForm.invalid) {
      return;
    }
    
    this.submitLoading = true;
    this.formError = '';
    this.successMessage = '';
    
    const newProduct = this.newProductForm.value;

    this.Products.addProduct(newProduct).subscribe({
      next: (response: any) => {
        console.log('Product added successfully:', response);
        this.submitLoading = false;
        this.productForm = false;
        this.showSuccessMessage('The Product Added Succesfully');
        this.fetchProducts();
      },
      error: (error: any) => {
        console.error('Error adding product:', error);
        this.submitLoading = false;
        this.formError = error.message || 'Failed to add product. Please try again.';
      }
    });
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    this.showSuccessAlert = true;
    
    setTimeout(() => {
      this.showSuccessAlert = false;
      this.successMessage = '';
    }, 5000);
  }

  onDeleteProduct(productId: string) {
    const product = this.products.find(p => p._id === productId);
    if (product) {
      this.productToDelete = product;
      this.showDeleteConfirm = true;
    }
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.Products.deleteProduct(this.productToDelete._id).subscribe({
        next: (response) => {
          console.log('Product deleted successfully:', response);
          this.showDeleteConfirm = false;
          this.productToDelete = null;
          this.showSuccessMessage('Product deleted successfully');
          this.fetchProducts(); 
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.showDeleteConfirm = false;
          this.productToDelete = null;
        }
      });
    } else if (this.userToDelete) {
      this.Users.deleteUser(this.userToDelete._id).subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          this.showDeleteConfirm = false;
          this.userToDelete = null;
          this.showSuccessMessage('User deleted successfully');
          this.fetchUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.showDeleteConfirm = false;
          this.userToDelete = null;
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.productToDelete = null;
    this.userToDelete = null;
  }

  onEditProduct(product: any) {
    this.productToEdit = product;
    this.editForm = true;
    this.formSubmitted = false;
    this.formError = '';
    this.initEditForm();
  }

  onSubmitEdit() {
    this.formSubmitted = true;
    
    if (this.editProductForm.invalid) {
      return;
    }
    
    this.submitLoading = true;
    this.formError = '';
    this.successMessage = '';
    
    const updatedProduct = this.editProductForm.value;

    this.Products.updateProduct(this.productToEdit._id, updatedProduct).subscribe({
      next: (response: any) => {
        this.submitLoading = false;
        this.editForm = false;
        this.showSuccessMessage('Product updated successfully');
        this.fetchProducts();
      },
      error: (error: any) => {
        this.submitLoading = false;
        this.formError = error.message || 'Failed to update product. Please try again.';
      }
    });
  }

  onDeleteUser(userId: string) {
    const user = this.users.find(u => u._id === userId);
    if (user) {
      this.userToDelete = user;
      this.showDeleteConfirm = true;
    }
  }

  onAddUser() {
    this.userForm = true;
    this.initUserForm();
    this.formSubmitted = false;
    this.formError = '';
  }

  onSubmitUser() {
    this.formSubmitted = true;
    
    if (this.newUserForm.invalid) {
      return;
    }
    
    this.submitLoading = true;
    this.formError = '';
    this.successMessage = '';
    
    const newUser = this.newUserForm.value;

    this.Users.add(newUser).subscribe({
      next: (response: any) => {
        console.log('User added successfully:', response);
        this.submitLoading = false;
        this.userForm = false;
        this.showSuccessMessage('User added successfully');
        this.fetchUsers();
      },
      error: (error: any) => {
        console.error('Error adding user:', error);
        this.submitLoading = false;
        this.formError = error.message || 'Failed to add user. Please try again.';
      }
    });
  }

  loadMessages() {
    this.http.get<any>('http://localhost:3000/messages/all').subscribe({
      next: (response) => {
        this.messages = response.messages || [];
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.messages = [];
      }
    });
  }

  onDeleteMessage(messageId: string) {
    this.messageToDelete = this.messages.find(m => m._id === messageId);
    this.showDeleteMessageConfirm = true;
  }

  confirmDeleteMessage() {
    if (this.messageToDelete) {
      this.http.delete(`http://localhost:3000/messages/${this.messageToDelete._id}`).subscribe({
        next: () => {
          this.messages = this.messages.filter(m => m._id !== this.messageToDelete._id);
          this.showDeleteMessageConfirm = false;
          this.messageToDelete = null;
          this.showSuccessAlert = true;
          this.successMessage = 'Message deleted successfully';
          setTimeout(() => {
            this.showSuccessAlert = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error deleting message:', error);
        }
      });
    }
  }

  cancelDeleteMessage() {
    this.showDeleteMessageConfirm = false;
    this.messageToDelete = null;
  }
}
