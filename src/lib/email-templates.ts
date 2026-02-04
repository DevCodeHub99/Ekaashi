import { formatPrice } from './utils'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export function generateAbandonedCartEmail(
  customerName: string,
  cartItems: CartItem[],
  totalValue: number,
  recoveryLink: string
): string {
  const itemsHtml = cartItems.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center;">
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #fef3c7, #fed7aa, #fef3c7); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-size: 24px;">💎</span>
          </div>
          <div>
            <h4 style="margin: 0; color: #1f2937; font-size: 16px;">${item.name}</h4>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Quantity: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 15px; text-align: right; border-bottom: 1px solid #eee;">
        <div style="color: #1f2937; font-weight: 600; font-size: 16px;">
          ${formatPrice(item.price * item.quantity)}
        </div>
        <div style="color: #6b7280; font-size: 14px;">
          ${formatPrice(item.price)} each
        </div>
      </td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Complete Your Purchase - Ekaashi</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">EKAASHI</h1>
          <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Exquisite Jewelry Collection</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">
            ${customerName ? `Hi ${customerName},` : 'Hello,'}
          </h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
            You left some beautiful jewelry pieces in your cart! Don't let these exquisite items slip away. 
            Complete your purchase now and add some sparkle to your collection.
          </p>

          <!-- Cart Items -->
          <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 30px 0;">
            <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 18px;">Your Cart Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
            </table>
            
            <!-- Total -->
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #d97706;">
              <div style="text-align: right;">
                <span style="color: #1f2937; font-size: 18px; font-weight: bold;">
                  Total: ${formatPrice(totalValue)}
                </span>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${recoveryLink}" 
               style="display: inline-block; background: linear-gradient(135deg, #d97706, #f59e0b); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);">
              Complete Your Purchase
            </a>
          </div>

          <p style="color: #6b7280; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px; text-align: center;">
            This link will expire in 7 days. Don't miss out on these beautiful pieces!
          </p>
        </div>

        <!-- Features -->
        <div style="background-color: #f9fafb; padding: 30px;">
          <h3 style="color: #1f2937; text-align: center; margin: 0 0 25px 0; font-size: 18px;">Why Choose Ekaashi?</h3>
          <div style="display: flex; justify-content: space-around; text-align: center;">
            <div style="flex: 1; margin: 0 10px;">
              <div style="color: #d97706; font-size: 24px; margin-bottom: 10px;">🛡️</div>
              <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 14px;">Lifetime Warranty</h4>
              <p style="color: #6b7280; margin: 0; font-size: 12px;">Full protection</p>
            </div>
            <div style="flex: 1; margin: 0 10px;">
              <div style="color: #d97706; font-size: 24px; margin-bottom: 10px;">🚚</div>
              <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 14px;">Free Shipping</h4>
              <p style="color: #6b7280; margin: 0; font-size: 12px;">On orders over $100</p>
            </div>
            <div style="flex: 1; margin: 0 10px;">
              <div style="color: #d97706; font-size: 24px; margin-bottom: 10px;">↩️</div>
              <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 14px;">Easy Returns</h4>
              <p style="color: #6b7280; margin: 0; font-size: 12px;">30-day policy</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #1f2937; color: #9ca3af; padding: 30px; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 14px;">
            © 2026 Ekaashi. All rights reserved.
          </p>
          <p style="margin: 0; font-size: 12px;">
            You received this email because you have items in your cart. 
            <a href="#" style="color: #d97706;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateOrderConfirmationEmail(
  customerName: string,
  orderNumber: string,
  orderItems: CartItem[],
  totalValue: number,
  shippingAddress: string
): string {
  // Similar structure for order confirmation emails
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Ekaashi</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">EKAASHI</h1>
          <p style="color: #fef3c7; margin: 10px 0 0 0;">Order Confirmation</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1f2937;">Thank you for your order, ${customerName}!</h2>
          <p style="color: #4b5563;">Your order #${orderNumber} has been confirmed and is being processed.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Total:</strong> ${formatPrice(totalValue)}</p>
            <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
          </div>
          
          <p style="color: #6b7280;">We'll send you another email when your order ships.</p>
        </div>
      </div>
    </body>
    </html>
  `
}