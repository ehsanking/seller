import { Order, FactorSettings } from '../types';

export const generatePdfReadyInvoiceHtml = (
  order: Order,
  factorSettings: FactorSettings,
  type: 'invoice' | 'packing_slip' = 'invoice'
): string => {
  const isInvoice = type === 'invoice';
  const title = isInvoice 
    ? `${factorSettings.headerTitle || 'Commercial Invoice'} #${order.orderNumber}`
    : `Packing Slip #${order.orderNumber}`;

  const maxPaperWidth = factorSettings.paperFormat === 'thermal' 
    ? '300px' 
    : factorSettings.paperFormat === 'a5' 
    ? '550px' 
    : '800px';

  const subtotal = order.totalAmount;
  const tax = factorSettings.showTax ? subtotal * 0.09 : 0;
  const grandTotal = subtotal + tax;

  return `
    <!DOCTYPE html>
    <html dir="ltr" lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
          * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 24px;
            color: #0f172a;
            background: #ffffff;
            max-width: ${maxPaperWidth};
            margin: 0 auto;
            line-height: 1.5;
            font-size: ${factorSettings.paperFormat === 'thermal' ? '11px' : '13px'};
          }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid ${factorSettings.accentColor}; padding-bottom: 16px; margin-bottom: 20px; }
          .company-brand { display: flex; align-items: center; gap: 12px; }
          .logo { max-width: 60px; max-height: 60px; border-radius: 6px; object-fit: contain; }
          .title-badge { font-size: 11px; font-weight: bold; background: ${factorSettings.accentColor}; color: #ffffff; padding: 3px 8px; border-radius: 4px; display: inline-block; margin-bottom: 4px; }
          .economic-bar { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-size: 11px; font-family: monospace; margin-bottom: 16px; display: flex; justify-content: space-between; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .info-box h4 { margin: 0 0 2px 0; font-size: 10px; text-transform: uppercase; color: #64748b; }
          .info-box p { margin: 0; font-weight: bold; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; text-align: left; }
          th { background: #f1f5f9; padding: 8px 10px; font-size: 11px; font-weight: 700; color: #475569; border-bottom: 1px solid #cbd5e1; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .total-box { margin-top: 16px; text-align: right; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
          .total-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; }
          .grand-total { font-size: 15px; font-weight: 900; color: ${factorSettings.accentColor}; border-top: 1px solid #cbd5e1; padding-top: 6px; margin-top: 4px; }
          .signatures { display: flex; justify-content: space-between; margin-top: 32px; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b; }
          .sig-box { text-align: center; width: 140px; border: 1px solid #e2e8f0; padding: 8px; border-radius: 6px; height: 50px; }
          .footer { margin-top: 32px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          
          @media print {
            body { padding: 0; margin: 0; width: 100%; max-width: 100%; }
            @page { margin: 1cm; size: ${factorSettings.paperFormat === 'a5' ? 'A5' : 'A4'}; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-brand">
            ${factorSettings.logoUrl ? `<img src="${factorSettings.logoUrl}" class="logo" alt="Logo" />` : ''}
            <div>
              <h2 style="margin: 0; font-size: 16px; font-weight: bold; color: ${factorSettings.accentColor};">${factorSettings.companyName}</h2>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${factorSettings.companyAddress}</div>
              <div style="font-size: 10px; color: #64748b;">Phone: ${factorSettings.companyPhone} | ${factorSettings.companyEmail || ''}</div>
            </div>
          </div>
          <div style="text-align: right;">
            <span class="title-badge">${isInvoice ? (factorSettings.headerTitle || 'Commercial Invoice') : 'PACKING SLIP'}</span>
            <div style="font-size: 14px; font-weight: bold; color: #0f172a; font-family: monospace;">#${order.orderNumber}</div>
            <div style="font-size: 11px; color: #64748b;">Date: ${new Date(order.createdAt).toLocaleDateString('en-US')}</div>
          </div>
        </div>

        ${isInvoice && (factorSettings.economicCode || factorSettings.nationalId) ? `
          <div class="economic-bar">
            <span>Economic Code: <strong>${factorSettings.economicCode || '---'}</strong></span>
            <span>National ID / Reg: <strong>${factorSettings.nationalId || '---'}</strong></span>
          </div>
        ` : ''}

        <div class="info-grid">
          <div class="info-box">
            <h4>Billed To (Customer)</h4>
            <p>${order.customerName}</p>
            <div style="font-size: 11px; color: #64748b; font-weight: normal;">${order.customerEmail}</div>
          </div>
          <div class="info-box">
            <h4>Shipping Destination</h4>
            <p style="font-weight: normal;">${order.shippingAddress}</p>
          </div>
          ${factorSettings.showPaymentMethod ? `
            <div class="info-box">
              <h4>Payment Method</h4>
              <p style="font-weight: normal;">${order.paymentMethod}</p>
            </div>
            <div class="info-box">
              <h4>Order Status</h4>
              <p style="text-transform: capitalize;">${order.status}</p>
            </div>
          ` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              ${factorSettings.showSku ? '<th style="font-family: monospace;">SKU</th>' : ''}
              <th style="text-align: center;">Qty</th>
              ${isInvoice ? '<th style="text-align: right;">Unit Price</th><th style="text-align: right;">Total Amount</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td><strong>${item.productTitle}</strong></td>
                ${factorSettings.showSku ? `<td style="font-family: monospace; font-size: 11px; color: #64748b;">${item.sku || '---'}</td>` : ''}
                <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
                ${isInvoice ? `<td style="text-align: right;">$${item.price.toFixed(2)}</td><td style="text-align: right; font-weight: bold;">$${(item.quantity * item.price).toFixed(2)}</td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${isInvoice ? `
          <div class="total-box">
            <div class="total-row"><span>Subtotal:</span><span style="font-family: monospace;">$${subtotal.toFixed(2)}</span></div>
            ${factorSettings.showTax ? `<div class="total-row"><span>Tax / VAT (9%):</span><span style="font-family: monospace;">$${tax.toFixed(2)}</span></div>` : ''}
            <div class="total-row grand-total"><span>Grand Total:</span><span style="font-family: monospace;">$${grandTotal.toFixed(2)}</span></div>
          </div>
        ` : ''}

        ${factorSettings.bankInfo || factorSettings.termsAndConditions ? `
          <div style="background:#f8fafc; padding:10px; border-radius:6px; border:1px solid #e2e8f0; font-size:11px; margin-top:16px;">
            ${factorSettings.bankInfo ? `<div style="font-family:monospace; margin-bottom:4px;"><strong>Payment Info:</strong> ${factorSettings.bankInfo}</div>` : ''}
            ${factorSettings.termsAndConditions ? `<div><strong>Terms & Conditions:</strong> ${factorSettings.termsAndConditions}</div>` : ''}
          </div>
        ` : ''}

        ${factorSettings.showSignatureBox ? `
          <div class="signatures">
            <div class="sig-box">Seller Signature</div>
            <div class="sig-box">Buyer Signature</div>
          </div>
        ` : ''}

        <div class="footer">
          ${factorSettings.footerNote || 'Thank you for your purchase!'}
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

export const openPdfReadyInvoicePrintWindow = (
  order: Order,
  factorSettings: FactorSettings,
  type: 'invoice' | 'packing_slip' = 'invoice'
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = generatePdfReadyInvoiceHtml(order, factorSettings, type);
  printWindow.document.write(html);
  printWindow.document.close();
};
