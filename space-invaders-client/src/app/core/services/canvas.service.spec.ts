import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CanvasService } from './canvas.service';

describe('CanvasService', () => {
  let service: CanvasService;
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanvasService,
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(CanvasService);

    // Create mock canvas element
    mockCanvas = document.createElement('canvas');
    
    // Create mock 2D context with all required methods
    mockContext = {
      fillRect: jasmine.createSpy('fillRect'),
      clearRect: jasmine.createSpy('clearRect'),
      fillText: jasmine.createSpy('fillText'),
      canvas: mockCanvas,
      fillStyle: '',
      font: ''
    } as unknown as CanvasRenderingContext2D;

    // Mock getContext to return our mock context
    spyOn(mockCanvas, 'getContext').and.returnValue(mockContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initCanvas', () => {
    it('should initialize canvas context correctly', () => {
      const width = 800;
      const height = 600;

      service.initCanvas(mockCanvas, width, height);

      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
      expect(mockCanvas.width).toBe(width);
      expect(mockCanvas.height).toBe(height);
    });

    it('should store canvas dimensions', () => {
      const width = 800;
      const height = 600;

      service.initCanvas(mockCanvas, width, height);

      // We can verify dimensions are stored by trying to use methods that depend on them
      expect(() => service.clearCanvas()).not.toThrow();
    });

    it('should throw error if canvas context cannot be obtained', () => {
      (mockCanvas.getContext as jasmine.Spy).and.returnValue(null);

      expect(() => service.initCanvas(mockCanvas, 800, 600))
        .toThrowError('Unable to get 2D rendering context');
    });
  });

  describe('getContext', () => {
    it('should return stored 2D context after initialization', () => {
      service.initCanvas(mockCanvas, 800, 600);

      const context = service.getContext();

      expect(context).toBe(mockContext);
    });

    it('should throw error if canvas not initialized', () => {
      expect(() => service.getContext())
        .toThrowError('Canvas not initialized. Call initCanvas() first.');
    });
  });

  describe('clearCanvas', () => {
    it('should clear entire canvas area', () => {
      const width = 800;
      const height = 600;
      service.initCanvas(mockCanvas, width, height);

      service.clearCanvas();

      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, width, height);
    });

    it('should throw error if canvas not initialized', () => {
      expect(() => service.clearCanvas())
        .toThrowError('Canvas not initialized. Call initCanvas() first.');
    });
  });

  describe('drawRect', () => {
    beforeEach(() => {
      service.initCanvas(mockCanvas, 800, 600);
    });

    it('should call fillRect with correct parameters', () => {
      const x = 100;
      const y = 200;
      const width = 50;
      const height = 30;
      const color = '#FF0000';

      service.drawRect(x, y, width, height, color);

      expect(mockContext.fillStyle).toBe(color);
      expect(mockContext.fillRect).toHaveBeenCalledWith(x, y, width, height);
    });

    it('should handle different colors', () => {
      service.drawRect(10, 20, 30, 40, '#00FF00');
      expect(mockContext.fillStyle).toBe('#00FF00');

      service.drawRect(10, 20, 30, 40, 'rgba(255, 0, 0, 0.5)');
      expect(mockContext.fillStyle).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should throw error if canvas not initialized', () => {
      const uninitializedService = new CanvasService();
      
      expect(() => uninitializedService.drawRect(0, 0, 10, 10, '#000'))
        .toThrowError('Canvas not initialized. Call initCanvas() first.');
    });
  });

  describe('drawText', () => {
    beforeEach(() => {
      service.initCanvas(mockCanvas, 800, 600);
    });

    it('should call fillText with proper positioning', () => {
      const text = 'Score: 1000';
      const x = 50;
      const y = 100;
      const font = '24px Arial';
      const color = '#FFFFFF';

      service.drawText(text, x, y, font, color);

      expect(mockContext.font).toBe(font);
      expect(mockContext.fillStyle).toBe(color);
      expect(mockContext.fillText).toHaveBeenCalledWith(text, x, y);
    });

    it('should handle different fonts', () => {
      service.drawText('Test', 0, 0, '16px Courier', '#000');
      expect(mockContext.font).toBe('16px Courier');

      service.drawText('Test', 0, 0, 'bold 32px Roboto', '#FFF');
      expect(mockContext.font).toBe('bold 32px Roboto');
    });

    it('should throw error if canvas not initialized', () => {
      const uninitializedService = new CanvasService();
      
      expect(() => uninitializedService.drawText('Test', 0, 0, '12px Arial', '#000'))
        .toThrowError('Canvas not initialized. Call initCanvas() first.');
    });
  });

  describe('integration', () => {
    it('should allow multiple drawing operations after initialization', () => {
      service.initCanvas(mockCanvas, 800, 600);

      service.clearCanvas();
      service.drawRect(10, 20, 30, 40, '#FF0000');
      service.drawText('Test', 50, 60, '16px Arial', '#000000');

      expect(mockContext.clearRect).toHaveBeenCalled();
      expect(mockContext.fillRect).toHaveBeenCalled();
      expect(mockContext.fillText).toHaveBeenCalled();
    });
  });
});
