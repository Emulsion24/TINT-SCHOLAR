
import { Mailtrapclient,sender } from "./mailtrap.js";
import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailtemplate.js";
export const sendVerificationCode=async(email,verificationToken)=>{
    const recipint=[{email}];
    try{
        const response=await Mailtrapclient.send({
            from:sender,
            to:recipint,
            subject:"Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification Code"
        })
        console.log("Verification Code Send successfully",response);
    }
    catch(error){
        console.error(`Error sending Verification Code`,error);
        throw new Error(`Error Sending verification Code ${error}`);

    }

}

export const sendRestEmail=async(email,resetURL)=>{
    const recipient=[{email}];
 try {
     const response=await Mailtrapclient.send({
         from:sender,
         to:recipient,
         subject:"Rest Password",
         html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
         category:"password Rest"
     })
     
 } catch (error) {
     console.error(`Eroor Sending rest Password Eamil`);
     throw new Error(`Error Sending Rest Password Wmail ${error}`);
 }
 };

 export const sendWelcomeEmail= async(email,name)=>{
    const recipint=[{email}];
    try{
        const response=await Mailtrapclient.send({
            from:sender,
            to:recipint,
            template_uuid: "6f1204c2-972d-4bbe-9abd-778ad83a4ec7",
    template_variables: {
      "name": name
    }
        })
        console.log("Welcome Email Send successfully",response);
    }
    catch(error){
        console.error(`Error sending Welcome Email`,error);
        throw new Error(`Error Sending Welcome Email ${error}`);

    }

}