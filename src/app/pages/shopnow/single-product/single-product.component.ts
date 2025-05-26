import { Component, OnInit} from '@angular/core';
import { GalleriaModule  } from 'primeng/galleria';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { cartService } from '../../../services/cart.service';

@Component({
  selector: 'app-single-product',
  standalone: true,
  imports: [GalleriaModule, DropdownModule, FormsModule, TabsModule, CommonModule],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.scss'
})
export class SingleProductComponent implements OnInit {
  images: any[] = [];
  selectedSize: any;
  product: any = {};
  loading: boolean = true;
  addedToCart: boolean = false;
  doneadd: boolean = false;
  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: cartService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadProduct(id);
    });
  }

  loadProduct(id: string) {
    this.loading = true;
    this.productsService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;

        if (this.product.image) {
          this.images = [
            {
              itemImageSrc: this.product.image,
              thumbnailImageSrc: this.product.image
            }
          ];
        }
      },
      error: (error) => {
        console.error('Error fetching product:', error);
        this.loading = false;
      }
    });
  }

  addImages(newImages: any[]) {
    this.images = newImages;
  }

  sizes = [
    { label: 'Small', code: 's', value: 'small' },
    { label: 'Medium', code: 'm', value: 'medium' },
    { label: 'Large', code: 'l', value: 'large' }
  ];

  onAddToCart(id: string){
    const added = this.cartService.addtocart(this.product);
    if (added) {
      this.addedToCart = true;
      setTimeout(() => {
        this.addedToCart = false;
      }, 3000);
    } else {
      this.addedToCart = false;
        this.doneadd = true;
        setTimeout(() => {
          this.doneadd = false;
        }, 3000);
    }
  }

  getStarsArray(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.1;
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    if (hasHalfStar) {
      stars.push('half');
    }
    while (stars.length < 5) {
      stars.push('empty');
    }
    return stars;
  }
}
