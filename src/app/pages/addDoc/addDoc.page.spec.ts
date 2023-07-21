import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDocPage } from './addDoc.page';

describe('AddDocPage', () => {
  let component: AddDocPage;
  let fixture: ComponentFixture<AddDocPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddDocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
