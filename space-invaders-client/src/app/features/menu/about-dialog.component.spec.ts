import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AboutDialogComponent } from './about-dialog.component';

describe('AboutDialogComponent', () => {
  let component: AboutDialogComponent;
  let fixture: ComponentFixture<AboutDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<AboutDialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        AboutDialogComponent,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Dialog Actions', () => {
    it('should close dialog when close is called', () => {
      component.close();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Template Rendering', () => {
    it('should render dialog title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('About the Project');
    });

    it('should display credit to creators Olle Zsanna & Tamas Vamosi', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const developersPanel = compiled.querySelector('.developers-panel');
      expect(developersPanel).toBeTruthy();
      expect(developersPanel?.textContent).toContain('Olle Zsanna');
      expect(developersPanel?.textContent).toContain('Tamas Vamosi');
    });

    it('should render close button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const closeButton = compiled.querySelector('mat-dialog-actions button');
      expect(closeButton).toBeTruthy();
    });
  });
});
