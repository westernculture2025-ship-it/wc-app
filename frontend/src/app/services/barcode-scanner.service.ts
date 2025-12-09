import { Injectable } from '@angular/core';
import Quagga from '@ericblade/quagga2';

@Injectable({
  providedIn: 'root'
})
export class BarcodeScannerService {
  private isScanning = false;

  constructor() { }

  async initScanner(
    targetElement: string | HTMLElement,
    onDetected: (code: string) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    if (this.isScanning) {
      this.stopScanner();
    }

    try {
      await Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: targetElement,
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            facingMode: 'environment',
            aspectRatio: { min: 1, max: 2 }
          }
        },
        decoder: {
          readers: [
            'code_128_reader',
            'ean_reader',
            'ean_8_reader',
            'code_39_reader',
            'code_39_vin_reader',
            'codabar_reader',
            'upc_reader',
            'upc_e_reader',
            'i2of5_reader'
          ],
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true
          }
        },
        locate: true,
        locator: {
          halfSample: true,
          patchSize: 'medium'
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 10
      }, (err) => {
        if (err) {
          console.error('Quagga initialization failed:', err);
          if (onError) onError(err);
          return;
        }
        console.log('Quagga initialized successfully');
        Quagga.start();
        this.isScanning = true;
      });

      Quagga.onDetected((result) => {
        if (result && result.codeResult && result.codeResult.code) {
          const code = result.codeResult.code;
          console.log('Barcode detected:', code);
          onDetected(code);
        }
      });

    } catch (error) {
      console.error('Error initializing scanner:', error);
      if (onError) onError(error);
    }
  }

  stopScanner(): void {
    if (this.isScanning) {
      Quagga.stop();
      this.isScanning = false;
      console.log('Quagga scanner stopped');
    }
  }

  isActive(): boolean {
    return this.isScanning;
  }
}
