// Polyfills for DOM APIs that PDF.js needs
if (typeof window !== 'undefined') {
  // DOMMatrix polyfill
  if (!window.DOMMatrix) {
    (window as any).DOMMatrix = class DOMMatrix {
      constructor(init?: string | number[]) {
        // Basic implementation - PDF.js will handle the rest
      }
    };
  }

  // DOMMatrixReadOnly polyfill
  if (!window.DOMMatrixReadOnly) {
    (window as any).DOMMatrixReadOnly = class DOMMatrixReadOnly {
      constructor(init?: string | number[]) {
        // Basic implementation
      }
    };
  }

  // DOMRect polyfill
  if (!window.DOMRect) {
    (window as any).DOMRect = class DOMRect {
      constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }

  // DOMRectReadOnly polyfill
  if (!window.DOMRectReadOnly) {
    (window as any).DOMRectReadOnly = class DOMRectReadOnly {
      constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }
      readonly x: number;
      readonly y: number;
      readonly width: number;
      readonly height: number;
    };
  }

  // DOMPoint polyfill
  if (!window.DOMPoint) {
    (window as any).DOMPoint = class DOMPoint {
      constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
      }
      x: number;
      y: number;
      z: number;
      w: number;
    };
  }

  // DOMPointReadOnly polyfill
  if (!window.DOMPointReadOnly) {
    (window as any).DOMPointReadOnly = class DOMPointReadOnly {
      constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
      }
      readonly x: number;
      readonly y: number;
      readonly z: number;
      readonly w: number;
    };
  }
} 