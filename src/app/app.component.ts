import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService } from '../services/http-service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports:[
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private httpService = inject(HttpService);
  todolist = new FormControl('', [Validators.required]);
  
  async ngOnInit(): Promise<void> {
    this.getTodoList();
  }

  async getTodoList(){
    const result = await this.httpService.PostData<Todolist>('/getTodoList',{})
    if("body" in result){
      if (Array.isArray(result.body)) {
        this.todoLists = result.body;
      } 
    }
  }

  async addTodoList() {
    this.httpService.PostData('/insert-todolist', {
      todolist: this.todolist.value,
      isCheck: 0,
    });
    this.todolist.setValue("");
    this.getTodoList();

  }

  async updateCheckTodo($completed: boolean, index: number,todolistId:string){
    if($completed){
    await this.httpService.PostData('/update-todolist', {
      todolistId:todolistId,
      isCheck: 1,
    });
    }
    else{
      await this.httpService.PostData('/update-todolist', {
        todolistId:todolistId,
      isCheck: 0,
    });
    }
  }
  public todoLists:Array<Todolist>  = [];
}

interface Todolist{
  todolistId:string;
  todolist:string | null;
  isCheck:number;
}