import { Order } from '../types';

export interface FedexLabelData {
  trackingNumber: string;
  carrier: string;
  serviceType: string;
  weightKg: number;
  recipientName: string;
  destinationAddress: string;
  generatedAt: string;
}

export const generateFedexLabelHtml = (order: Order, labelData: FedexLabelData): string => {
  const dateStr = new Date(labelData.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Generate a pattern of varying widths for barcode simulation
  const stripeWidths = [1, 3, 1, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 3, 2, 1, 1, 3, 4, 2, 1, 1, 2, 3, 4, 1, 2, 1, 3, 2, 4, 1, 1];

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>FedEx Shipping Label - ${order.orderNumber}</title>
        <style>
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #ffffff;
            color: #000000;
            display: flex;
            justify-content: center;
          }
          
          /* Standard 4x6 Inch Label Container */
          .label-container {
            width: 4in;
            height: 6in;
            border: 3px solid #000000;
            padding: 12px;
            position: relative;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
          }

          /* General Layout Helpers */
          .section-divider {
            border-top: 2px solid #000000;
            margin: 6px 0;
            width: 100%;
          }
          .bold { font-weight: bold; }
          .mono { font-family: "Courier New", Courier, monospace; }

          /* Header Section */
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .fedex-logo {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: -1px;
          }
          .logo-fed { color: #4D148C; } /* Official FedEx Purple */
          .logo-ex { color: #FF6600; } /* Official FedEx Ground Orange */

          .dhl-logo {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: #D40511; /* Official DHL Red */
            background: #FFCC00; /* Official DHL Yellow */
            padding: 2px 6px;
            border-radius: 4px;
          }

          .ups-logo {
            font-size: 18px;
            font-weight: 900;
            color: #FFC72C; /* UPS Yellow */
            background: #351C15; /* UPS Brown */
            padding: 3px 8px;
            border-radius: 4px;
            border: 1px solid #FFC72C;
          }
          
          .service-symbol {
            font-size: 24px;
            font-weight: 900;
            border: 3px solid #000000;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }

          /* Address Details */
          .addresses-row {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            font-size: 9px;
            gap: 6px;
          }
          .address-block {
            line-height: 1.2;
          }
          .to-header {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 2px;
          }
          .to-address {
            font-size: 10px;
            font-weight: bold;
            line-height: 1.3;
          }

          /* Metadata (Weight, Date, Reference) */
          .meta-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1.2fr;
            font-size: 9px;
            border-top: 1px solid #000000;
            border-bottom: 1px solid #000000;
            padding: 3px 0;
            text-align: left;
          }
          .meta-item {
            display: flex;
            flex-direction: column;
          }
          .meta-label {
            font-size: 7px;
            text-transform: uppercase;
            color: #444444;
          }

          /* Large Routing/Zip Section */
          .routing-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 0;
          }
          .postal-barcode-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          .routing-square {
            width: 32px;
            height: 32px;
            border: 2px solid #000000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 18px;
          }

          /* Big Service Level Banner */
          .service-banner {
            background-color: #000000;
            color: #ffffff;
            text-align: center;
            font-weight: 900;
            font-size: 16px;
            padding: 4px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 4px 0;
          }

          /* Main Barcode & Tracking Number */
          .barcode-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 8px 0;
          }
          .barcode-stripes-wrapper {
            display: flex;
            height: 52px;
            align-items: stretch;
            margin-bottom: 4px;
            width: 100%;
            justify-content: center;
          }
          .stripe-bar {
            background: #000000;
          }
          .stripe-space {
            background: #ffffff;
          }
          .tracking-label-box {
            font-size: 10px;
            text-align: center;
            letter-spacing: 1.5px;
          }

          /* Footer Info & Billing */
          .footer-section {
            font-size: 8px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: auto;
          }

          @media print {
            body {
              padding: 0;
              margin: 0;
              background: #ffffff;
            }
            .label-container {
              border: 3px solid #000000;
            }
            @page {
              size: 4in 6in;
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <!-- Top Row: Logo & Service block -->
          <div class="header-row">
            ${labelData.carrier === 'DHL' || labelData.carrier === 'DHL Express' ? `
              <div class="dhl-logo">DHL</div>
            ` : labelData.carrier === 'UPS' ? `
              <div class="ups-logo">UPS</div>
            ` : `
              <div class="fedex-logo">
                <span class="logo-fed">Fed</span><span class="logo-ex">Ex</span>
              </div>
            `}
            <div style="font-size: 9px; text-align: right; line-height: 1.2;">
              <div class="bold">${labelData.serviceType}</div>
              <div class="mono" style="font-size: 8px;">STATION ID: ${labelData.carrier === 'DHL' || labelData.carrier === 'DHL Express' ? 'DHL-991A' : labelData.carrier === 'UPS' ? 'UPS-883C' : 'STATION ID: 9918'}</div>
            </div>
            <div class="service-symbol">${labelData.carrier === 'DHL' || labelData.carrier === 'DHL Express' ? 'D' : labelData.carrier === 'UPS' ? 'U' : 'G'}</div>
          </div>

          <div class="section-divider"></div>

          <!-- FROM & TO addresses -->
          <div class="addresses-row">
            <div class="address-block">
              <div class="bold" style="font-size: 8px; text-transform: uppercase;">FROM:</div>
              <div>Seller Core AI Fulfillment</div>
              <div>1200 Innovation Way, Suite 100</div>
              <div>Silicon Valley, CA 94025</div>
              <div>Phone: (800) 463-3339</div>
            </div>
            <div class="address-block" style="text-align: right;">
              <div>SHIP DATE: ${dateStr}</div>
              <div>CAD: 100928172</div>
              <div>ACTWGT: ${labelData.weightKg.toFixed(1)} KG</div>
            </div>
          </div>

          <div class="section-divider"></div>

          <!-- Target Delivery Address -->
          <div class="address-block">
            <div class="to-header">TO:</div>
            <div class="to-address">${labelData.recipientName}</div>
            <div class="to-address">${labelData.destinationAddress}</div>
          </div>

          <div class="section-divider"></div>

          <!-- Routing details and quick barcode -->
          <div class="routing-section">
            <div class="postal-barcode-container">
              <div style="font-size: 9px; font-weight: bold; margin-bottom: 2px;">REF: ${order.orderNumber}</div>
              <!-- Simulated mini routing barcode -->
              <div style="display: flex; height: 18px; width: 140px;">
                ${stripeWidths.slice(0, 20).map((w, i) => `
                  <div class="stripe-bar" style="width: ${w}px;"></div>
                  <div class="stripe-space" style="width: 2px;"></div>
                `).join('')}
              </div>
            </div>
            <div class="routing-square">5G</div>
          </div>

          <!-- Big service level block -->
          <div class="service-banner">
            ${labelData.serviceType}
          </div>

          <!-- Main high density tracking barcode -->
          <div class="barcode-area">
            <div class="barcode-stripes-wrapper">
              ${stripeWidths.map((w, i) => `
                <div class="stripe-bar" style="width: ${w}px;"></div>
                <div class="stripe-space" style="width: ${i % 3 === 0 ? 3 : 1}px;"></div>
              `).join('')}
            </div>
            <div class="tracking-label-box font-mono bold">
              TRK# <span style="font-size: 12px;">${labelData.trackingNumber.replace(/(.{4})/g, '$1 ')}</span>
            </div>
          </div>

          <div class="section-divider"></div>

          <!-- Footer Metadata -->
          <div class="footer-section">
            <div>
              <div class="bold">DEPT ID: INBOUND-72</div>
              <div>Form 0201 - Rev 2026</div>
            </div>
            <div style="text-align: right; font-weight: bold; font-family: monospace;">
              [G] ${labelData.carrier ? labelData.carrier.toUpperCase() : 'FEDEX'}-SHIPPING-REST-v1
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;
};

export const openFedexLabelPrintWindow = (order: Order, labelData: FedexLabelData) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = generateFedexLabelHtml(order, labelData);
  printWindow.document.write(html);
  printWindow.document.close();
};
