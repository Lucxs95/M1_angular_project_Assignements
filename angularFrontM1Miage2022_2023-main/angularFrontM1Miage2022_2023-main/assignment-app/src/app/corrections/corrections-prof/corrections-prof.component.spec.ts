import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionsProfComponent } from './corrections-prof.component';

describe('CorrectionsProfComponent', () => {
  let component: CorrectionsProfComponent;
  let fixture: ComponentFixture<CorrectionsProfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectionsProfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrectionsProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
