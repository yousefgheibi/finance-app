import { inject, Injectable } from "@angular/core";
import { IndexedDbService } from "./indexed-db.service";
import { ICategoryDto } from "../models/category.model";
import { from } from "rxjs";

@Injectable()
export class CategoriesService {

    private readonly db = inject(IndexedDbService);

    initDatabase() {
        return from(this.db.init());
    }

    loadData() {
        return from(this.db.getAll('categories'));
    }

    deleteCategory(id: number) {
        return from(this.db.delete('categories', id));
    }

    updateCategory(item: ICategoryDto) {
        return from(this.db.update('categories', item));
    }

    addNewCategory(item: ICategoryDto) {
        return from(
            this.db.add('categories', {
                name: item.name,
                description: item.description
            })
        );
    }

}