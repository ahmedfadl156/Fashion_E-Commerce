import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { AllproductsComponent } from './pages/shopnow/allproducts/allproducts.component';
import { SingleProductComponent } from './pages/shopnow/single-product/single-product.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MessageSentComponent } from './pages/contact/message-sent/message-sent.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminGuard } from './services/guard.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'allproducts', component: AllproductsComponent },
  { path: 'singleproduct/:id' , component: SingleProductComponent},
  { path: 'contact' , component: ContactComponent},
  { path: 'message-sent' , component: MessageSentComponent},
  { path: 'cart' , component: CartComponent},
  { path: 'checkout' , component: CheckoutComponent},
  { path: 'login' , component: LoginComponent},
  { path: 'signup' , component: SignupComponent},
  { path: 'dashboard' , component: DashboardComponent , canActivate: [AdminGuard]},
  { path: '**', redirectTo: '' },
];
