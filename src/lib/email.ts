import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface BalanceChange {
  accountName: string;
  institutionName: string;
  previousBalance: number;
  currentBalance: number;
  change: number;
}

interface EmailData {
  changes: BalanceChange[];
  totalChange: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export async function sendBalanceUpdateEmail(data: EmailData) {
  const { changes, totalChange, totalAssets, totalLiabilities, netWorth } = data;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .summary-card { background-color: #f9fafb; padding: 15px; border-radius: 6px; text-align: center; }
        .summary-label { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px; }
        .summary-value { font-size: 18px; font-weight: bold; }
        .assets { color: #10b981; }
        .liabilities { color: #ef4444; }
        .net-worth { color: ${netWorth >= 0 ? '#10b981' : '#ef4444'}; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 Daily Financial Update</h1>
          <p>Your personal finance summary for ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="summary">
          <div class="summary-card">
            <div class="summary-label">Total Assets</div>
            <div class="summary-value assets">$${totalAssets.toLocaleString()}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total Liabilities</div>
            <div class="summary-value liabilities">$${totalLiabilities.toLocaleString()}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Net Worth</div>
            <div class="summary-value net-worth">$${netWorth.toLocaleString()}</div>
          </div>
        </div>

        <div class="footer">
          <p>This email was sent from your Personal Finance Dashboard</p>
          <p>Built with Next.js, Plaid, and ❤️</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `💰 Daily Finance Update - Test Email`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('Email server connection successful');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
}