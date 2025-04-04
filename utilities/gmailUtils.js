// require("dotenv").config();
var SibApiV3Sdk = require("sib-api-v3-sdk");
var defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = "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";

//apiKey.apiKey =   	v.BREVO_EMAIL_API;

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
function generateUserEmail(userName) {
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <title>Welcome to Steady Fast!</title>
      </head>
      <body>
        <div class="container mt-4">
          <div class="jumbotron">
            <h1>Welcome, ${userName}!</h1>
            <p>We're thrilled to have you onboard at Steady Fast Cargo. Thank you for choosing us for your freight needs.</p>
            <p>Your account has been successfully created. If you have any questions or need assistance, our support team is here to help.</p>
            <p>We look forward to serving you and wish you a smooth experience with us.</p>
            <hr class="my-4">
            <p>Best regards,<br>The Steady Fast Team</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return emailHtml;
  }
  
  function generateAdminEmail({ userName, email }) {
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <title>New User Registration</title>
      </head>
      <body>
        <div class="container mt-4">
          <div class="alert alert-info">
            <h1>New User Registered</h1>
            <p>A new user has registered an account with Steady Fast Cargo.</p>
            <p><strong>User Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p>Please review and approve their account to grant them full access to our services.</p>
            <hr class="my-4">
            <p>Thank you for ensuring a smooth onboarding process!</p>
          </div>
        </div>
      </body>
      </html>
    `;
    return emailHtml;
  }
  

function sendAccountCreateEmail({email, userName}) {
  apiInstance
    .sendTransacEmail({
      sender: { email: `${email}`, name: userName },
      subject: "Account Created",
      htmlContent: `<html>
          <head></head>
          <body></body>
          </html>
          `,
      messageVersions: [
        //Definition for Message Version 1
        {
          to: [
            {
              email: email,
              name: userName,
            },
          ],
          htmlContent: generateUserEmail(userName),
          subject: "Account Created! ~ Steadfast Cargo",
        },
        {
          to: [
            {
              email:`chisalecharles23@gmail.com`,
  
              name: userName,
            },
          ],
          htmlContent: generateAdminEmail({userName, email}),
          subject: "New User! ~ Steadfast Cargo",
        },
      ],
    })
    .then(
      function (data) {
        //console.log(data);
      },
      function (error) {
        console.error(error);
      }
    );
}

function generateForgotPasswordHtmlAlert({ email }) {
  return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forgot Password Alert</title>
  <style>
  
    
  </style>
</head>
<body>
  <div class="container">
  
    <h1>Email '<span> ${email}</span> is reseting a password.</h1>
    <p>Reminder for administrative, awareness and security purposes.</p>
    
  </div>
</body>
</html>
`
}



function generateForgotPasswordHtml({ code, email }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rate Limit Exceeded</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #f6f6f6;
    }
    .container {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 40px;
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    h1 {
      color: #ff6768;
      font-size: 2em;
      margin-bottom: 20px;
    }
    p {
      color: #555;
      font-size: 1.2em;
      margin-bottom: 30px;
    }
    
  </style>
</head>
<body>
  <div class="container">
  
    <h1>Your Steadfast Password Reset Code is ${code}</h1>
    <p>If this was not you, ignore this.</p>
  </div>
</body>
</html>
`;
}

function sendForgotPasswordEmail({ email, code }) {
  apiInstance
    .sendTransacEmail({
      sender: { email: `chisalecharles23@gmail.com`, name: "Steadfast Cargo" },
      subject: "Forgot Password Steadfast Cargo",
      htmlContent: `<html>
        <head></head>
        <body></body>
        </html>
        `,
      messageVersions: [
        //Definition for Message Version 1
        {
          to: [
            {
              email: email,
              name: "Steadfast Cargo",
            },
          ],
          htmlContent: generateForgotPasswordHtml({ email, code }),
          subject: "Steadfast Cargo - Forgot Password!",
        },
        {
          to: [
            {
              email:`chisalecharles23@gmail.com`,
              name: "Steadfast Cargo",
            },
          ],
          htmlContent: generateForgotPasswordHtmlAlert({ email }),
          subject: "Steadfast Cargo - Forgot Password Alert!",
        },
      ],
    })
    .then(
      function (data) {
        //console.log(data);
      },
      function (error) {
        console.error(error);
      }
    );
}


function sendExceededLoginEmail({ ipAddress}) {
  console.log('ip adress',ipAddress)
  apiInstance
    .sendTransacEmail({
      sender: { email: `chisaglecharles@gmail.com`, name: "Steadfast Cargo" },
      subject: "Steadfast Cargo - Exceeded Login Attempts",
      htmlContent: `<html>
        <head></head>
        <body></body>
        </html>
        `,
      messageVersions: [
        //Definition for Message Version 1
        
        {
          to: [
            {
              email:`chisalecharles23@gmail.com`,
              name: "Steadfast Cargo",
            },
          ],
          htmlContent: generatePasswordAttemptsAlert({ipAddress}),
          subject: "Steadfast Cargo - Exceeded Login Attempts!",
        },
      ],
    })
    .then(
      function (data) {
        //console.log(data);
      },
      function (error) {
        console.error(error);
      }
    );
}

function generateTokenHTML({ email, token }) {
  const emailHtml = `
  <div style="max-width: 400px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  <h2 style="color: #333;">Steadfast Email Verification</h2>
  <p style="color: #555; margin-bottom: 20px;">Congratulations for registering with Steadfast Cargo. Please click the button below to verify your email:</p>


  <a href="https://steadfastcargo.onrender.com/auth/verify/${token}/${email}" style="display: inline-block; text-decoration: none; background-color: #ffc107; color: #333; padding: 10px 20px; border-radius: 5px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
    Confirm Email
  </a>

  <p style="color: #555; margin-top: 20px;">If you didn't register with Steadfast, please ignore this email.</p>
</div>
  `
  return emailHtml;
}

function sendTokenEmail({ userName, email, token }) {
  console.log(email)
  apiInstance
    .sendTransacEmail({
      sender: { email: `chisalecharles23@gmail.com`, name: 'Steadfast Cargo' },
      subject: "Steadfast Cargo Transaction",
      htmlContent: `<html>
      <head></head>
      <body></body>
      </html>
      `,
      messageVersions: [
        //Definition for Message Version 1
        {
          to: [
            {
              email: email,
              name: userName,
            },
          ],
          htmlContent: generateTokenHTML({ email, token }),
          subject: "Steadfast Cargo - Email Verification!",
        }
      ],
    })
    .then(
      function (data) {
        //console.log(data);
      },
      function (error) {
        return null;
        console.error(error);
      }
    );
}




function generatePasswordAttemptsAlert({ ipAddress }) {
  return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forgot Password Alert</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #f6f6f6;
    }
    .container {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 40px;
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    h1 {
      color: #ff6768;
      font-size: 2em;
      margin-bottom: 20px;
    }
    p {
      color: #555;
      font-size: 1.2em;
      margin-bottom: 30px;
    }
    span{
      color:#ffc107;
    }
    
  </style>
</head>
<body>
  <div class="container">
  
    <h1>The IP Address at<span> ${ipAddress}</span> attempted to login over 4 times.</h1>
    <p>This serves to remind just you, for administrative and security purposes.</p>
    
  </div>
</body>
</html>
`
}




module.exports = {
  sendAccountCreateEmail,
  generateUserEmail,
  generateForgotPasswordHtml,
  sendForgotPasswordEmail,
  generateTokenHTML,
  sendTokenEmail,
  sendExceededLoginEmail
};