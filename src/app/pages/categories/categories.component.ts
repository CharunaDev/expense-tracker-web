import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/expense.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  showModal = false;
  editingCategory: Category | null = null;
  categoryForm: FormGroup;
  activeTab: 'expense' | 'income' = 'expense';

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      type: ['expense', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.filterCategories();
    });
  }

  filterCategories() {
    this.filteredCategories = this.categories.filter(c => c.type === this.activeTab);
  }

  openCategoryModal(category?: Category) {
    this.editingCategory = category || null;
    if (category) {
      this.categoryForm.patchValue({
        name: category.name,
        type: category.type
      });
    } else {
      this.categoryForm.reset({ type: this.activeTab });
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  closeModalOnBackdrop(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.closeModal();
    }
  }

  saveCategory() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      
      if (this.editingCategory) {
        this.apiService.updateCategory(this.editingCategory.id, categoryData).subscribe(() => {
          this.loadCategories();
          this.closeModal();
        });
      } else {
        this.apiService.createCategory(categoryData).subscribe(() => {
          this.loadCategories();
          this.closeModal();
        });
      }
    }
  }

  editCategory(category: Category) {
    this.openCategoryModal(category);
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category? This will affect all related transactions.')) {
      this.apiService.deleteCategory(id).subscribe(() => {
        this.loadCategories();
      });
    }
  }
}