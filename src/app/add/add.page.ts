import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  userForm: FormGroup;
  categories: any[];
  selectedCategory: number;

  constructor(
    private formBuilder: FormBuilder,
    private db: AngularFireDatabase,
  ) {
    this.categories = [
      { name: 'No merezco categoría', value: 0 },
      { name: 'Aprendiz de Pedro', value: 1 },
      { name: 'Una verga todavía', value: 2 },
      { name: 'Va queriendo', value: 3 },
      { name: 'Intermedio', value: 4 },
      { name: 'Avanzado', value: 5 },
      { name: 'Profesional', value: 6 },
      { name: 'Kakaroto', value: 7 },
    ]
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      alias: ['', Validators.required],
      score: [0]
    });
    this.selectedCategory = 0;
  }

  ngOnInit() {
  }

  addUser() {
    if (this.userForm.invalid) return;
    
    let user = {
      name: this.userForm.get('name').value,
      surname: this.userForm.get('surname').value,
      alias: this.userForm.get('alias').value,
      score: this.userForm.get('score').value,
      category: this.categories[this.selectedCategory],
      amount: 0,
      apples: 0
    }
    
    try {
      this.db.list('users').push(user);
      this.resetForm();
    } catch(err) {
      console.log(err);
    }
  }

  resetForm() {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      alias: ['', Validators.required],
      score: [0]
    });
    this.selectedCategory = 0;
  }
}
